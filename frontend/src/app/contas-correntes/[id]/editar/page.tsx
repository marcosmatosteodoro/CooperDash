'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useContaCorrente from '@/hooks/useContaCorrente';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarContaCorrente() {
  const { id } = useParams();
  const router = useRouter();
  const {  contasCorrentes, getFieldsProps, getContaCorrente, handleSubmitEditContaCorrente, clearContaCorrenteError } = useContaCorrente();
  const { current, status, error, fieldErrors } = contasCorrentes;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getContaCorrente(id as string);
    }
  }, [getContaCorrente, id]);

  useEffect(() => {
    setEditLayout({ path: `/contas-correntes`, label: 'Contas Correntes', id: typeof id === 'string' ? id : '', dynamicLabel: current?.numero_conta || 'Conta' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearContaCorrenteError() }}/>} 
      <Form 
        onClick={() => router.push('/contas-correntes')}
        handleSubmit={handleSubmitEditContaCorrente}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}