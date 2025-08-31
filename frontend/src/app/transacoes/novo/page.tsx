'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useTransacaoForm from '@/hooks/useTransacaoForm';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoTransacao() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { formData, contaCorrenteOptions, handleChange, handleSubmitNewTransacao, clearTransacaoError } = useTransacaoForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.transacoes);

  useEffect(() => {
    setNewLayout({ path: '/transacoes', label: 'Transações', title: 'Novo Transação' });
  }, [setNewLayout]);

  const formProps: FormProps = {
    onClick: () => router.push('/transacoes'),
    handleSubmit: handleSubmitNewTransacao,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Conta Corrente',
        type: 'text',
        tag: 'select',
        name: 'contas_corrente_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.contas_corrente_id,
        onChange: handleChange,
        options: contaCorrenteOptions
      },
      {
        label: 'Valor',
        type: 'number',
        tag: 'input',
        name: 'valor',
        value: formData.valor,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Tipo',
        type: 'text',
        tag: 'select',
        name: 'tipo',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.tipo,
        onChange: handleChange,
        options: [
          {
            value: "DEPOSITO",
            text: "Deposito"
          },
          {
            value: "SAQUE",
            text: "Saque"
          },
          {
            value: "TRANSFERENCIA",
            text: "Transferência"
          },
          {
            value: "RENDIMENTO",
            text: "Rendimento"
          },
          {
            value: "TAXA",
            text: "Taxa"
          },
        ]
      },
      {
        label: 'Saldo anterior',
        type: 'number',
        tag: 'input',
        name: 'saldo_anterior',
        value: formData.saldo_anterior,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Saldo posterior',
        type: 'number',
        tag: 'input',
        name: 'saldo_posterior',
        value: formData.saldo_posterior,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da transação',
        type: 'date',
        tag: 'input',
        name: 'data_transacao',
        value: formData.data_transacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Categoria',
        type: 'text',
        tag: 'input',
        name: 'categoria',
        value: formData.categoria,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Descrição',
        type: 'text',
        tag: 'textarea',
        name: 'descricao',
        value: formData.descricao,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearTransacaoError() }}/>}
      <Form {...formProps} />
    </>
  );
}