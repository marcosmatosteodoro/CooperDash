'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useTransacao from '@/hooks/useTransacao';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarTransacao() {
  const { id } = useParams();
  const router = useRouter();
  const { transacoes, getFieldsProps, getTransacao ,handleSubmitEditTransacao, clearTransacaoError } = useTransacao();
  const { current, status, error, fieldErrors } = transacoes;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getTransacao(id as string);
    }
  }, [getTransacao, id]);

  useEffect(() => {
    setEditLayout({ path: `/transacoes`, label: 'Transações', id: typeof id === 'string' ? id : '', dynamicLabel: current?.valor.toString() || 'Transação' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Transação não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearTransacaoError() }}/>} 
      <Form 
        onClick={() => router.push('/transacoes')}
        handleSubmit={handleSubmitEditTransacao}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}