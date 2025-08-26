'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
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
  const { setLayoutData } = useLayout();
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
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/contas-correntes', label: 'Contas Correntes' }, 
        { path: `/contas-correntes/${id}`, label: current?.numero_conta || 'Detalhes' }
      ],
      title: current?.numero_conta ? `Detalhes: ${current.numero_conta}` : 'Detalhes da Conta Corrente',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/contas-correntes/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => current?.id && handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href="/contas-correntes">
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

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