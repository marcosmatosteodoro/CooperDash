'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useLayout } from '@/providers/LayoutProvider'
import useParcelaEmprestimo from '@/hooks/useParcelaEmprestimo';
import { Form, ErrorAlert } from '@/components'

export default function NovoEndereco() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { parcelasEmprestimos, getFieldsProps, handleSubmitNewParcelaEmprestimo, clearParcelaEmprestimoError } = useParcelaEmprestimo();
  const { error, fieldErrors } = parcelasEmprestimos;

  useEffect(() => {
    setNewLayout({ path: '/parcelas-emprestimos', label: 'Parcelas', title: 'Nova Parcela' });
  }, [setNewLayout]);

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearParcelaEmprestimoError() }}/>}
      <Form
        onClick={() => router.push('/parcelas-emprestimos')}
        handleSubmit={handleSubmitNewParcelaEmprestimo}
        fieldErrors={fieldErrors}
        fields={getFieldsProps()}
      />
    </>
  );
}