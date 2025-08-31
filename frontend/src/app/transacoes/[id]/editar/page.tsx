'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTransacao } from '@/store/slices/transacoesSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useTransacaoForm from '@/hooks/useTransacaoForm';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarTransacao() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.transacoes);
  const { setEditLayout } = useLayout();
  const { 
    formData,
    contaCorrenteOptions,
    setFormData,
    handleChange,
    handleSubmitEditTransacao,
    clearTransacaoError 
  } = useTransacaoForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchTransacao(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setEditLayout({ path: `/transacoes`, label: 'Transações', id: typeof id === 'string' ? id : '', dynamicLabel: current?.valor.toString() || 'Transação' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Transação não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/transacoes'),
    handleSubmit: handleSubmitEditTransacao,
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