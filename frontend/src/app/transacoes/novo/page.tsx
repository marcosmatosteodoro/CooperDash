'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useTransacao from '@/hooks/useTransacao';
import { Form, ErrorAlert } from '@/components'

export default function NovoTransacao() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { transacoes, getFieldsProps, handleSubmitNewTransacao, clearTransacaoError } = useTransacao();
  const { error, fieldErrors } = transacoes;

  useEffect(() => {
    setNewLayout({ path: '/transacoes', label: 'Transações', title: 'Novo Transação' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearTransacaoError() }}/>}
      <Form 
        onClick={() => router.push('/transacoes')}
        handleSubmit={handleSubmitNewTransacao}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}