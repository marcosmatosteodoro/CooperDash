'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useVotacao from '@/hooks/useVotacao';
import { Form, ErrorAlert } from '@/components'

export default function NovoVotacao() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { votacoes, getFieldsProps, handleSubmitNewVotacao, clearVotacaoError } = useVotacao();
  const { error, fieldErrors } = votacoes;
  useEffect(() => {
    setNewLayout({path: '/votacoes',label: 'Nova Votação',title: 'Nova Votação'});
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearVotacaoError() }}/>}
      <Form
        onClick={() => router.push('/votacoes')}
        handleSubmit={handleSubmitNewVotacao}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}