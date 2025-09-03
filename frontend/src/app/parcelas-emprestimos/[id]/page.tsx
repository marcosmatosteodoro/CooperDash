'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { deleteParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import useParcelaEmprestimo from '@/hooks/useParcelaEmprestimo';
import useEmprestimo from '@/hooks/useEmprestimo';

export default function ParcelaEmprestimo() {
  const { id } = useParams<{ id: string }>();
  const { parcelasEmprestimos, getParcelaEmprestimo } = useParcelaEmprestimo();
  const { emprestimos, getEmprestimo } = useEmprestimo();
  const { current, status, error } = parcelasEmprestimos;
  const { current: emprestimo } = emprestimos;

  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'parcelaEmprestimo',
    redirectTo: '/parcelas-emprestimos',
    deleteAction: (id: string) => deleteParcelaEmprestimo(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatCurrency, formatDate, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
    getParcelaEmprestimo(id);
  }, [getParcelaEmprestimo, id]);
  
  useEffect(() => {
    if(current && current.emprestimo_id) {
      getEmprestimo(current.emprestimo_id);
    }
  }, [current, getEmprestimo]);

  useEffect(() => {
    setShowLayout({ path: `/parcelas-emprestimos`, label: 'Parcelas de Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Endereço não encontrado" />;
  if (error) return <ErrorAlert message={error} />;


  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Número da Parcela',
            value: `${current?.numero_parcela} / ${emprestimo?.parcelas || '...'}`
          },
          {
            label: 'Valor da Parcela',
            value: formatCurrency(current?.valor_parcela)
          },
          {
            label: 'Data de Vencimento',
            value: formatDate(current?.data_vencimento)
          },
          {
            label: 'Data de Pagamento',
            value: formatDate(current?.data_pagamento || null)
          },
          {
            label: 'Status',
            value: formatTextToCapitalized(current?.status)
          },
          {
            label: 'Valor Pago',
            value: formatCurrency(current?.valor_pago)
          },
          
        ]
      }}
      secondColumn={{
        title: 'Outras Informações',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Dias de Atraso',
            value: current?.dias_atraso
          },
          {
            label: 'multa',
            value: formatCurrency(current?.multa)
          },
          {
            label: 'juros',
            value: formatCurrency(current?.juros)
          },
          {
            label: 'Valor do emprestimo',
            value: emprestimo ? formatCurrency(emprestimo.valor_aprovado || emprestimo.valor_solicitado) : 'Carregando...'
          },
        ]
      }}
    />
  );
}