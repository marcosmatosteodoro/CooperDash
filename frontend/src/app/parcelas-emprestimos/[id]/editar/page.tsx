'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useParcelaEmprestimo from '@/hooks/useParcelaEmprestimo';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarParcelaEmprestimo() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.parcelasEmprestimos);
  const { setEditLayout } = useLayout();
  const { 
    formData,
    emprestimoOptions,
    setFormData,
    handleChange,
    handleSubmitEditParcelaEmprestimo,
    clearParcelaEmprestimoError
  } = useParcelaEmprestimo();

  useEffect(() => {
    if (id) {
      dispatch(fetchParcelaEmprestimo(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setEditLayout({ path: `/parcelas-emprestimos`, label: 'Parcelas de Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/parcelas-emprestimos'),
    handleSubmit: handleSubmitEditParcelaEmprestimo,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Número da parcela',
        type: 'number',
        tag: 'input',
        name: 'numero_parcela',
        value: formData.numero_parcela,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Valor da parcela',
        type: 'number',
        tag: 'input',
        name: 'valor_parcela',
        value: formData.valor_parcela,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Emprestimo',
        type: 'text',
        tag: 'select',
        name: 'emprestimo_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.emprestimo_id,
        onChange: handleChange,
        options: emprestimoOptions
      },
      {
        label: 'Data de Vencimento',
        type: 'date',
        tag: 'input',
        name: 'data_vencimento',
        value: formData.data_vencimento,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data de Pagamento',
        type: 'date',
        tag: 'input',
        name: 'data_pagamento',
        value: formData.data_pagamento,
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
            value: "PENDENTE",
            text: "Pendente"
          },
          {
            value: "PAGO",
            text: "Pago"
          },
          {
            value: "ATRASADO",
            text: "Atrasado"
          },
          {
            value: "CANCELADO",
            text: "Cancelado"
          },
        ]
      },
      {
        label: 'Dias de atraso',
        type: 'number',
        tag: 'input',
        name: 'dias_atraso',
        value: formData.dias_atraso,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Valor pago',
        type: 'number',
        tag: 'input',
        name: 'valor_pago',
        value: formData.valor_pago,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Multa',
        type: 'number',
        tag: 'input',
        name: 'multa',
        value: formData.multa,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Júros',
        type: 'number',
        tag: 'input',
        name: 'juros',
        value: formData.juros,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearParcelaEmprestimoError() }}/>} 
      <Form {...formProps} />
    </>
  );
}