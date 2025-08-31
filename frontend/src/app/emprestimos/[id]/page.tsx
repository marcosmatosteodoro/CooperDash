'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchEmprestimo, deleteEmprestimo } from '@/store/slices/emprestimosSlice';
import { fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function Emprestimo() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.emprestimos);
  const { current: cooperado } = useSelector((state: RootState) => state.cooperados);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'emprestimo',
    redirectTo: '/emprestimos',
    deleteAction: (id: string) => deleteEmprestimo(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatDate, formatTextToCapitalized, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchEmprestimo(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if(current && current.cooperado_id) {
      dispatch(fetchCooperado(current.cooperado_id));
    }
  }, [current]);

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