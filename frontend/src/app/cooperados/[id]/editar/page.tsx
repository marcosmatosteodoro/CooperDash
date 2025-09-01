'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useCooperado from '@/hooks/useCooperado';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarCooperador() {
  const { id } = useParams();
  const router = useRouter();
  const { setEditLayout } = useLayout();
  const { cooperados, handleSubmitEditCooperado, clearCooperadoError, getFieldsProps, getCooperado } = useCooperado();
  const { current, status, error, fieldErrors } = cooperados;

  useEffect(() => {
    getCooperado(id as string);
  }, [getCooperado, id]);

  useEffect(() => {
    setEditLayout({ path: `/cooperados`, label: 'Cooperados', id: typeof id === 'string' ? id : '', dynamicLabel: current?.nome || 'Novo Cooperado' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Cooperado não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearCooperadoError() }}/>} 
      <Form 
        onClick={() => router.push('/cooperados')}
        handleSubmit={handleSubmitEditCooperado}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}