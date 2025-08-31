'use client'

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchVotacao, deleteVotacao } from '@/store/slices/votacoesSlice';
import { fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { NotFoundPage, ErrorAlert, LoadingSpinner, ShowModel } from '@/components';
import { fetchAssembleia } from '@/store/slices/assembleiasSlice';

export default function Votacao() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { current, status, error } = useSelector((state: RootState) => state.votacoes);
  const { current: cooperado } = useSelector((state: RootState) => state.cooperados);
  const { current: assembleia } = useSelector((state: RootState) => state.assembleias);
  const { handleDelete, deleting } = useDeleteWithConfirmation({
    entityName: 'votacao',
    redirectTo: '/votacoes',
    deleteAction: (id: string) => deleteVotacao(id), 
  });
  const { setShowLayout } = useLayout();
  const { formatDateTime,formatDocument, formatDate } = useFormatters();

  useEffect(() => {
    dispatch(fetchVotacao(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if(current && current.cooperado_id) {
      dispatch(fetchCooperado(current.cooperado_id));
      dispatch(fetchAssembleia(current.assembleia_id));
    }
  }, [current]);

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