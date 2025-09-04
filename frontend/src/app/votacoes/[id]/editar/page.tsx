'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useVotacao from '@/hooks/useVotacao';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarVotacao() {
  const { id } = useParams();
  const router = useRouter();
  const { votacoes, getFieldsProps, getVotacao ,handleSubmitEditVotacao, clearVotacaoError } = useVotacao();
  const { current, status, error, fieldErrors } = votacoes;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getVotacao(id as string);
    }
  }, [getVotacao, id]);

  useEffect(() => {
    setEditLayout({ path: `/votacoes`, label: 'Votações', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Votação não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearVotacaoError() }}/>} 
      <Form
        onClick={() => router.push('/votacoes')}
        handleSubmit={handleSubmitEditVotacao}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}