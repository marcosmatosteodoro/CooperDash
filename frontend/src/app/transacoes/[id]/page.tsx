'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTransacao, deleteTransacao } from '@/store/slices/transacoesSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import { fetchContaCorrente } from '@/store/slices/contasCorrentesSlice';

export default function Transacao() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.transacoes);
  const { current: contasCorrente } = useSelector((state: RootState) => state.contasCorrentes);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'transacao',
    redirectTo: '/transacoes',
    deleteAction: (id: string) => deleteTransacao(id), 
  });
  const { setLayoutData } = useLayout();
  const { formatCurrency, formatDate, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
    dispatch(fetchTransacao(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if(current && current.contas_corrente_id) {
      dispatch(fetchContaCorrente(current.contas_corrente_id));
    }
  }, [current]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/transacoes', label: 'Transações' }, 
        { path: `/transacoes/${id}`, label: current?.valor.toString() || 'Detalhes' }
      ],
      title: current?.valor.toString() ? `Detalhes: ${current.valor.toString()}` : 'Detalhes do Transação',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/transacoes/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => current?.id && handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href="/transacoes">
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

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