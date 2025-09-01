'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useAssembleiaForm from '@/hooks/useAssembleiaForm';
import { Form, ErrorAlert } from '@/components'

export default function NovoAssembleia() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { assembleias, getFieldsProps, handleSubmitNewAssembleia, clearAssembleiaError } = useAssembleiaForm();
  const { error, fieldErrors } = assembleias;

  useEffect(() => {
    setNewLayout({ path: '/assembleias', label: 'Assembleias', title: 'Nova Assembleia' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearAssembleiaError() }}/>}
      <Form
        onClick={() => router.push('/assembleias')}
        handleSubmit={handleSubmitNewAssembleia}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}