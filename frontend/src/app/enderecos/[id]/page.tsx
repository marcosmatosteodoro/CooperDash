'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchEndereco, deleteEndereco } from '@/store/slices/enderecosSlice';
import { fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function Endereco() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.enderecos);
  const { current: cooperado } = useSelector((state: RootState) => state.cooperados);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'endereco',
    redirectTo: '/enderecos',
    deleteAction: (id: string) => deleteEndereco(id), 
  });
  const { setLayoutData } = useLayout();
  const { formatCep } = useFormatters();

  useEffect(() => {
    dispatch(fetchEndereco(id));
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
        { path: '/enderecos', label: 'Endereços' }, 
        { path: `/enderecos/${id}`, label: current?.logradouro || 'Detalhes' }
      ],
      title: current?.logradouro ? `Detalhes: ${current.logradouro}` : 'Detalhes do Endereço',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/enderecos/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => current?.id && handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href="/cooperados">
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Cooperado não encontrado" />;
  if (error) return <ErrorAlert message={error} />;


  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Logradouro',
            value: current?.logradouro
          },
          {
            label: 'CEP',
            value: formatCep(current?.cep)
          },
          {
            label: 'Número',
            value: current?.numero
          },
          {
            label: 'Bairro',
            value: current?.bairro
          },
          {
            label: 'Cidade',
            value: current?.cidade
          },
          {
            label: 'Estado',
            value: current?.estado
          },
          
        ]
      }}
      secondColumn={{
        title: 'Outras Informações',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Principal',
            value: current?.principal ? 'Sim' : 'Não'
          },
          {
            label: 'Tipo',
            value: current?.tipo
          },
          {
            label: 'Complemento',
            value: current?.complemento || '-'
          },
          {
            label: 'Cooperado',
            value: cooperado?.nome || 'Carregando...'
          },
        ]
      }}
    />
  );
}