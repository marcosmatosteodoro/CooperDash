'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchContaCorrente, deleteContaCorrente } from '@/store/slices/contasCorrentesSlice';
import { fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function Endereco() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.contasCorrentes);
  const { current: cooperado } = useSelector((state: RootState) => state.cooperados);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'contaCorrente',
    redirectTo: '/contas-correntes',
    deleteAction: (id: string) => deleteContaCorrente(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatCurrency, formatDate, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
    dispatch(fetchContaCorrente(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if(current && current.cooperado_id) {
      dispatch(fetchCooperado(current.cooperado_id));
    }
  }, [current]);

  useEffect(() => {
    setShowLayout({ path: `/contas-correntes`, label: 'Contas Correntes', id: typeof id === 'string' ? id : '', dynamicLabel: current?.numero_conta || 'Conta', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Conta Corrente não encontrada" />;
  if (error) return <ErrorAlert message={error} />;


  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Número da Conta',
            value: current?.numero_conta
          },
          {
            label: 'Saldo',
            value: formatCurrency(current?.saldo)
          },
          {
            label: 'Limite de Crédito',
            value: formatCurrency(current?.limite_credito)
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
        title: 'Datas',
        icon: 'bi-calendar2',
        contents: [
          {
            label: 'Data de Abertura',
            value: formatDate(current?.data_abertura)
          },
          {
            label: 'Data de Encerramento',
            value: current?.data_encerramento ? formatDate(current?.data_encerramento) : 'Não Informada'
          },
        ]
      }}
    />
  );
}