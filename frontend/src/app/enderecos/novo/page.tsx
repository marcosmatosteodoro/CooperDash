'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useEndereco from '@/hooks/useEndereco';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'

export default function NovoEndereco() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { getFieldsProps, handleSubmitNewEndereco, clearEnderecoError } = useEndereco();
  const { error, fieldErrors } = useSelector((state: RootState) => state.enderecos);

  useEffect(() => {
    setNewLayout({ path: '/enderecos', label: 'Endereços', title: 'Novo Endereço' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEnderecoError() }}/>}
      <Form 
        onClick={() => router.push('/enderecos')}
        handleSubmit={handleSubmitNewEndereco}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}