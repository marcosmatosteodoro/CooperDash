'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { deleteEndereco } from '@/store/slices/enderecosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import useEndereco from '@/hooks/useEndereco';
import useCooperado from '@/hooks/useCooperado';

export default function Endereco() {
  const { id } = useParams<{ id: string }>();
  const { enderecos, getEndereco } = useEndereco();
  const { cooperados, getCooperado } = useCooperado();
  const { current, status, error } = enderecos;
  const { current: cooperado } = cooperados;
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'endereco',
    redirectTo: '/enderecos',
    deleteAction: (id: string) => deleteEndereco(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatCep } = useFormatters();

  useEffect(() => {
    getEndereco(id);
  }, [getEndereco, id]);

  useEffect(() => {
    if(current && current.cooperado_id) {
      getCooperado(current.cooperado_id);
    }
  }, [current, getCooperado]);

  useEffect(() => {
    setShowLayout({ path: `/enderecos`, label: 'Endereços', id: typeof id === 'string' ? id : '', dynamicLabel: current?.logradouro || 'Endereço', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

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