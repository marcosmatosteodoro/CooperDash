'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useEmprestimo from '@/hooks/useEmprestimo';
import { Form, ErrorAlert } from '@/components'

export default function NovoEmprestimo() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { emprestimos, getFieldsProps, handleSubmitNewEmprestimo, clearEmprestimoError } = useEmprestimo();
  const { error, fieldErrors } = emprestimos;

  useEffect(() => {
    setNewLayout({ path: '/emprestimos', label: 'Emprestimos', title: 'Novo Emprestimo' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEmprestimoError() }}/>}
      <Form 
        onClick={() => router.push('/emprestimos')}
        handleSubmit={handleSubmitNewEmprestimo}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}