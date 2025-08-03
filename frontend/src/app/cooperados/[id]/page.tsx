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
import { NotFoundPage, ErrorAlert, LoadingSpinner } from '@/components';

export default function Cooperador() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.cooperados);
  const handleDelete = useDeleteWithConfirmation({
    entityName: 'cooperado',
    redirectTo: '/cooperados',
    deleteAction: deleteCooperado,
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
            onClick={() => current?.id && handleDelete(parseInt(current.id))}
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

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Cooperado não encontrado" />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <h5 className="text-muted mb-3">
            <i className="bi bi-file-text me-2"></i>
            Informações Básicas
          </h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{texto[current.tipo_pessoa].nome}:</span>
              <span>{current.nome}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">Tipo:</span>
              <span>{current.tipo_pessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{texto[current.tipo_pessoa].documento}:</span>
              <span>{formatDocument(current.documento, current.tipo_pessoa)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{texto[current.tipo_pessoa].data}:</span>
              <span>{formatDate(current.data)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{texto[current.tipo_pessoa].valor}:</span>
              <span>{formatCurrency(current.valor)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-md-6">
        <div className="mb-3">
          <h5 className="text-muted mb-3">
            <i className="bi bi-telephone me-2"></i>
            Contato
          </h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">Telefone:</span>
              <span>{current.codigo_pais} {current.telefone}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">Email:</span>
              <a href={`mailto:${current.email}`} className="text-decoration-none">
                {current.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
