'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { deleteEmprestimo } from '@/store/slices/emprestimosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import useEmprestimo from '@/hooks/useEmprestimo';
import useCooperado from '@/hooks/useCooperado';

export default function Emprestimo() {
  const { id } = useParams<{ id: string }>();
  const { emprestimos, getEmprestimo } = useEmprestimo();
  const { cooperados, getCooperado } = useCooperado();
  const { current, status, error } = emprestimos;
  const { current: cooperado } = cooperados;
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'emprestimo',
    redirectTo: '/emprestimos',
    deleteAction: (id: string) => deleteEmprestimo(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatDate, formatTextToCapitalized, formatCurrency } = useFormatters();

  useEffect(() => {
    getEmprestimo(id);
  }, [getEmprestimo, id]);
  
  useEffect(() => {
    if(current && current.cooperado_id) {
      getCooperado(current.cooperado_id);
    }
  }, [current, getCooperado]);

  useEffect(() => {
    setShowLayout({ path: `/emprestimos`, label: 'Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Emprestimo não encontrado" />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Valor Solicitado',
            value: formatCurrency(current?.valor_solicitado)
          },
          {
            label: 'Valor Aprovado',
            value: formatCurrency(current?.valor_aprovado) || '-'
          },
          {
            label: 'Parcelas',
            value: current?.parcelas
          },
          {
            label: 'Taxa de Juros',
            value: current?.taxa_juros + '%'
          },
          {
            label: 'Status',
            value: formatTextToCapitalized(current?.status)
          },
          {
            label: 'Cooperado',
            value: cooperado?.nome || 'Carregando...'
          },
          
        ]
      }}
      secondColumn={{
        title: 'Outras Informações',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Data da Solicitação',
            value: formatDate(current?.data_solicitacao)
          },
          {
            label: 'Data da Análise',
            value: current?.data_analise ? formatDate(current?.data_analise) : '-'
          },
          {
            label: 'Data da Liquidação',
            value: current?.data_liquidacao ? formatDate(current?.data_liquidacao) : '-'
          },
          {
            label: 'Finalidade',
            value: current?.finalidade
          },
          {
            label: 'Observação',
            value: current?.observacao || '-'
          },
        ]
      }}
    />
  );
}