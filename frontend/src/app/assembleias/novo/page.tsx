'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useAssembleia from '@/hooks/useAssembleia';
import { Form, ErrorAlert } from '@/components'

export default function NovoAssembleia() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { assembleias, getFieldsProps, handleSubmitNewAssembleia, clearAssembleiaError } = useAssembleia();
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