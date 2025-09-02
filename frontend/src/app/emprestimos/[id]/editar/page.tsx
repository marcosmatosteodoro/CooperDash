'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useEmprestimo from '@/hooks/useEmprestimo';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarEmprestimo() {
  const { id } = useParams();
  const router = useRouter();
  const { emprestimos, getFieldsProps, getEmprestimo ,handleSubmitEditEmprestimo , clearEmprestimoError } = useEmprestimo();
  const { current, status, error, fieldErrors } = emprestimos;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getEmprestimo(id as string);
    }
  }, [getEmprestimo, id]);

  useEffect(() => {
    setEditLayout({ path: `/emprestimos`, label: 'Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Emprestimo não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEmprestimoError() }}/>} 
      <Form 
        onClick={() => router.push('/emprestimos')}
        handleSubmit={handleSubmitEditEmprestimo}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}