'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { deleteTransacao } from '@/store/slices/transacoesSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import useTransacao from '@/hooks/useTransacao';
import useContaCorrente from '@/hooks/useContaCorrente';

export default function Transacao() {
  const { id } = useParams<{ id: string }>();
  const { transacoes, getTransacao } = useTransacao();
  const { contasCorrentes, getContaCorrente } = useContaCorrente();
  const { current, status, error } = transacoes;
  const { current: contasCorrente } = contasCorrentes;
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'transacao',
    redirectTo: '/transacoes',
    deleteAction: (id: string) => deleteTransacao(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatCurrency, formatDate, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
    getTransacao(id);
  }, [getTransacao, id]);
  
  useEffect(() => {
    if(current && current.contas_corrente_id) {
      getContaCorrente(current.contas_corrente_id);
    }
  }, [getContaCorrente, current]);

  useEffect(() => {
    setShowLayout({ path: `/transacoes`, label: 'Transações', id: typeof id === 'string' ? id : '', dynamicLabel: current?.valor.toString() || 'Transação', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Transação não encontrado" />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Valor',
            value: formatCurrency(current?.valor)
          },
          {
            label: 'Saldo anterior',
            value: formatCurrency(current?.saldo_anterior)
          },
          {
            label: 'Saldo posterior',
            value: formatCurrency(current?.saldo_posterior)
          },
          {
            label: 'Tipo',
            value: formatTextToCapitalized(current?.tipo)
          },
          {
            label: 'Data de transação',
            value: formatDate(current?.data_transacao)
          },
          
        ]
      }}
      secondColumn={{
        title: 'Outras Informações',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Numero da conta',
            value: contasCorrente?.numero_conta || 'Carregando...'
          },
          {
            label: 'Status da conta',
            value: formatTextToCapitalized(contasCorrente?.status || 'Carregando...')
          },
          {
            label: 'Categoria',
            value: current?.categoria
          },
          {
            label: 'Descrição',
            value: current?.descricao
          },
        ]
      }}
    />
  );
}