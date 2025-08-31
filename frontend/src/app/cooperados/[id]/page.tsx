'use client'

import React, { useEffect } from 'react';
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
  const { setShowLayout } = useLayout();
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchCooperado(id));
  }, [dispatch, id]);

  useEffect(() => {
    setShowLayout({ path: `/cooperados`, label: 'Cooperados', id: typeof id === 'string' ? id : '', dynamicLabel: current?.nome || 'Novo Cooperado', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

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
