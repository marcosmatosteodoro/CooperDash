'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useCooperado from '@/hooks/useCooperado';
import { Form, ErrorAlert } from '@/components'

export default function NovoCooperador() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const {  cooperados, handleSubmitNewCooperado, clearCooperadoError, getFieldsProps } = useCooperado();
  const { error, fieldErrors } = cooperados;

  useEffect(() => {
    setNewLayout({ path: '/cooperados', label: 'Cooperados', title: 'Novo Cooperado' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearCooperadoError() }}/>}
      <Form 
        onClick={() => router.push('/cooperados')}
        handleSubmit={handleSubmitNewCooperado}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}