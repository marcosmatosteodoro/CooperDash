'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useContaCorrente from '@/hooks/useContaCorrente';
import { Form, ErrorAlert } from '@/components'

export default function NovoEndereco() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const {  contasCorrentes, getFieldsProps, handleSubmitNewContaCorrente, clearContaCorrenteError } = useContaCorrente();
  const { error, fieldErrors } = contasCorrentes;

  useEffect(() => {
    setNewLayout({ path: '/contas-correntes', label: 'Contas Correntes', title: 'Nova Conta Corrente' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearContaCorrenteError() }}/>}
      <Form 
        onClick={() => router.push('/contas-correntes')}
        handleSubmit={handleSubmitNewContaCorrente}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}