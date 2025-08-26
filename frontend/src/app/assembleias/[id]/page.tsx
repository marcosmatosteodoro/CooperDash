'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAssembleia, deleteAssembleia } from '@/store/slices/assembleiasSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function Cooperador() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.assembleias);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'assembleia',
    redirectTo: '/assembleias',
    deleteAction: (id: string) => deleteAssembleia(id), 
  });
  const { setLayoutData } = useLayout();
  const { formatCep } = useFormatters();

  useEffect(() => {
    dispatch(fetchAssembleia(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/assembleias', label: 'Assembleias' }, 
        { path: `/assembleias/${id}`, label: current?.titulo || 'Detalhes' }
      ],
      title: current?.titulo ? `Detalhes: ${current.titulo}` : 'Detalhes da Assembleia',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/assembleias/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => current?.id && handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href="/assembleias">
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
            label: 'Título',
            value: current?.titulo
          },
          {
            label: 'Data e Hora',
            value: formatCep(current?.data_hora)
          },
          {
            label: 'Tipo',
            value: current?.tipo
          },
          {
            label: 'Status',
            value: current?.status
          },
          {
            label: 'Pauta',
            value: current?.pauta
          },
          {
            label: 'Quorum Mínimo',
            value: current?.quorum_minimo
          },
          
        ]
      }}
      secondColumn={{
        title: 'Outras Informações',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Local',
            value: current?.local
          },
          {
            label: 'Descrição',
            value: current?.descricao
          },
          {
            label: 'Resultado',
            value: current?.resultado || '-'
          },
        ]
      }}
    />
  );
}