'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useParcelaEmprestimo from '@/hooks/useParcelaEmprestimo';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';

export default function EditarParcelaEmprestimo() {
  const { id } = useParams();
  const router = useRouter();
  const { parcelasEmprestimos, getParcelaEmprestimo, getFieldsProps, handleSubmitEditParcelaEmprestimo, clearParcelaEmprestimoError } = useParcelaEmprestimo();
  const { current, status, error, fieldErrors } = parcelasEmprestimos;
  const { setEditLayout } = useLayout();

  useEffect(() => {
    if (id) {
      getParcelaEmprestimo(id as string);
    }
  }, [getParcelaEmprestimo, id]);

  useEffect(() => {
    setEditLayout({ path: `/parcelas-emprestimos`, label: 'Parcelas de Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearParcelaEmprestimoError() }}/>} 
      <Form
        onClick={() => router.push('/parcelas-emprestimos')}
        handleSubmit={handleSubmitEditParcelaEmprestimo}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}