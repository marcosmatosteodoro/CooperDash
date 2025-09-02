'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useEndereco from '@/hooks/useEndereco';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarEndereco() {
  const { id } = useParams();
  const router = useRouter();
  const { enderecos, getFieldsProps, getEndereco, handleSubmitEditEndereco, clearEnderecoError } = useEndereco();
  const { current, status, error, fieldErrors } = enderecos;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getEndereco(id as string);
    }
  }, [getEndereco, id]);

  useEffect(() => {
    setEditLayout({ path: `/enderecos`, label: 'Endereços', id: typeof id === 'string' ? id : '', dynamicLabel: current?.logradouro || 'Endereço' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEnderecoError() }}/>} 
      <Form 
        onClick={() => router.push('/enderecos')}
        handleSubmit={handleSubmitEditEndereco}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}