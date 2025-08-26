'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCooperado, deleteCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { texto } from '@/data/textos';
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';

export default function Cooperador() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.cooperados);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'cooperado',
    redirectTo: '/cooperados',
    deleteAction: (id: string) => deleteCooperado(id), 
  });
  const { setLayoutData } = useLayout();
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchCooperado(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }, 
        { path: `/cooperados/${id}`, label: current?.nome || 'Detalhes' }
      ],
      title: current?.nome ? `Detalhes: ${current.nome}` : 'Detalhes do Cooperado',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`/cooperados/${id}/editar`}>
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
            label: texto[current.tipo_pessoa].nome,
            value: current.nome
          },
          {
            label: 'Tipo',
            value: current.tipo_pessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'
          },
          {
            label: texto[current.tipo_pessoa].documento,
            value: formatDocument(current.documento, current.tipo_pessoa)
          },
          {
            label: texto[current.tipo_pessoa].data,
            value: formatDate(current.data)
          },
          {
            label: texto[current.tipo_pessoa].valor,
            value: formatCurrency(current.valor)
          },
        ]
      }}
      secondColumn={{
        title: 'Contato',
        icon: 'bi-telephone',
        contents: [
          {
            label: 'Telefone',
            value: `${current.codigo_pais} ${current.telefone}`
          },
          {
            label: 'Email',
            value: (
              <a href={`mailto:${current.email}`} className="text-decoration-none">
                {current.email}
              </a>
            )
          },
        ]
      }}
    />
  );
}
