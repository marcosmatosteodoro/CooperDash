'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useAssembleia from '@/hooks/useAssembleia';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarCooperador() {
  const { id } = useParams();
  const router = useRouter();
  const { assembleias, getFieldsProps, getAssembleia, handleSubmitEditAssembleia, clearAssembleiaError  } = useAssembleia();
  const { current, status, error, fieldErrors } = assembleias;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getAssembleia(id as string);
    }
  }, [getAssembleia, id]);

  useEffect(() => {
    setEditLayout({ path: `/assembleias`, label: 'Assembleias', id: typeof id === 'string' ? id : '', dynamicLabel: current?.titulo || 'Assembleia' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearAssembleiaError() }}/>} 
      <Form 
        onClick={ () => router.push('/assembleias') }
        handleSubmit={ handleSubmitEditAssembleia }
        fieldErrors={ fieldErrors }
        fields={ getFieldsProps() }
      />
    </>
  );
}