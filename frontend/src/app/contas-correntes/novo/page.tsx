'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useContaCorrenteForm from '@/hooks/useContaCorrenteForm';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoEndereco() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { formData, CooperadoOptions, handleChange, handleSubmitNewContaCorrente, clearContaCorrenteError } = useContaCorrenteForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.enderecos);

  useEffect(() => {
    setNewLayout({ path: '/contas-correntes', label: 'Contas Correntes', title: 'Nova Conta Corrente' });
  }, [setNewLayout]);

  const formProps: FormProps = {
    onClick: () => router.push('/contas-correntes'),
    handleSubmit: handleSubmitNewContaCorrente,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Número da Conta',
        type: 'number',
        tag: 'input',
        name: 'numero_conta',
        value: formData.numero_conta,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Saldo',
        type: 'number',
        tag: 'input',
        name: 'saldo',
        value: formData.saldo,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Limite de Crédito',
        type: 'number',
        tag: 'input',
        name: 'limite_credito',
        value: formData.limite_credito,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Status',
        type: 'text',
        tag: 'select',
        name: 'status',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.status,
        onChange: handleChange,
        options: [
          {
            value: "ATIVA",
            text: "Ativa"
          },
          {
            value: "BLOQUEADA",
            text: "Bloqueada"
          },
          {
            value: "CANCELADA",
            text: "Cancelada"
          },
        ]
      },
      {
        label: 'Data de abertura',
        type: 'date',
        tag: 'input',
        name: 'data_abertura',
        value: formData.data_abertura,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data de encerramento',
        type: 'date',
        tag: 'input',
        name: 'data_encerramento',
        value: formData.data_encerramento,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },

      {
        label: 'Cooperado',
        type: 'text',
        tag: 'select',
        name: 'cooperado_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.cooperado_id,
        onChange: handleChange,
        options: CooperadoOptions
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearContaCorrenteError() }}/>}
      <Form {...formProps} />
    </>
  );
}