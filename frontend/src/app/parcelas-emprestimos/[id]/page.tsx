'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchParcelaEmprestimo, deleteParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';
import { fetchEmprestimo } from '@/store/slices/emprestimosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function ParcelaEmprestimo() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.parcelasEmprestimos);
  const { current: emprestimo } = useSelector((state: RootState) => state.emprestimos);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'parcelaEmprestimo',
    redirectTo: '/parcelas-emprestimos',
    deleteAction: (id: string) => deleteParcelaEmprestimo(id), 
  });
  const { setLayoutData } = useLayout();
  const { formatCurrency, formatDate, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
    dispatch(fetchParcelaEmprestimo(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if(current && current.emprestimo_id) {
      dispatch(fetchEmprestimo(current.emprestimo_id));
    }
  }, [current]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/parcelas-emprestimos', label: 'Parcelas' }, 
        { path: `/parcelas-emprestimos/${id}`, label: 'Detalhes' }
      ],
      title: 'Detalhes da Parcela',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/parcelas-emprestimos/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => current?.id && handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href="/parcelas-emprestimos">
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

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