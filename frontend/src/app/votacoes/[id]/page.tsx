'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import {  deleteVotacao } from '@/store/slices/votacoesSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import useVotacao from '@/hooks/useVotacao';
import useCooperado from '@/hooks/useCooperado';
import useAssembleia from '@/hooks/useAssembleia';

export default function Votacao() {
  const { id } = useParams<{ id: string }>();
  const { votacoes, getVotacao } = useVotacao();
  const { cooperados, getCooperado } = useCooperado();
  const { assembleias, getAssembleia } = useAssembleia();
  const { current, status, error } = votacoes;
  const { current: cooperado } = cooperados;
  const { current: assembleia } = assembleias;
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'votacao',
    redirectTo: '/votacoes',
    deleteAction: (id: string) => deleteVotacao(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatDateTime,formatDocument, formatDate } = useFormatters();

  useEffect(() => {
    getVotacao(id);
  }, [getVotacao, id]);
  
  useEffect(() => {
    if(current && current.cooperado_id && current.assembleia_id) {
      getCooperado(current.cooperado_id);
      getAssembleia(current.assembleia_id);
    }
  }, [current, getCooperado, getAssembleia]);

  useEffect(() => {
    setShowLayout({ path: `/votacoes`, label: 'Votações', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes', onClick: () => current?.id && handleDelete(current.id) });
  }, [setShowLayout, current, id]);

  if (status === 'loading' || status === 'idle' || deleting) return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Votação não encontrado" />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <ShowModel
      firstColumn={{
        title: 'Informações Básicas',
        icon: 'bi-file-text',
        contents: [
          {
            label: 'Assembleia',
            value: assembleia?.titulo || 'Carregando...'
          },
          {
            label: 'Pauta',
            value: assembleia?.pauta || 'Carregando...'
          },
          {
            label: 'Data e hora',
            value: assembleia ? formatDateTime(assembleia.data_hora) : 'Carregando...'
          },
          {
            label: 'Nome',
            value: cooperado?.nome || 'Carregando...'
          },
          {
            label: cooperado?.tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ',
            value: cooperado ? formatDocument(cooperado.documento, cooperado.tipo_pessoa) : 'Carregando...'
          },
          {
            label: 'Tipo',
            value: cooperado?.tipo_pessoa || 'Carregando...'
          },
          
        ]
      }}
      secondColumn={{
        title: 'Informações do Voto',
        icon: 'bi-info-circle',
        contents: [
          {
            label: 'Voto',
            value: current?.voto
          },
          {
            label: 'Data do voto',
            value: current?.data_voto ? formatDate(current.data_voto) : 'Carregando...'
          },
          {
            label: 'Justificativa',
            value: current?.justificativa || '-'
          },
        ]
      }}
    />
  );
}