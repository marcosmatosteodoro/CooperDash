'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchEmprestimo } from '@/store/slices/emprestimosSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useEmprestimo from '@/hooks/useEmprestimo';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarEmprestimo() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.emprestimos);
  const { setEditLayout } = useLayout();
  const { 
    formData,
    CooperadoOptions,
    setFormData,
    handleChange,
    handleSubmitEditEmprestimo,
    clearEmprestimoError 
  } = useEmprestimo();

  useEffect(() => {
    if (id) {
      dispatch(fetchEmprestimo(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setEditLayout({ path: `/emprestimos`, label: 'Empréstimos', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Emprestimo não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/emprestimos'),
    handleSubmit: handleSubmitEditEmprestimo,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Valor solicitado',
        type: 'number',
        tag: 'input',
        name: 'valor_solicitado',
        value: formData.valor_solicitado,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Valor aprovado',
        type: 'number',
        tag: 'input',
        name: 'valor_aprovado',
        value: formData.valor_aprovado,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Parcelas',
        type: 'number',
        tag: 'input',
        name: 'parcelas',
        value: formData.parcelas,
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
            value: "ANALISE",
            text: "Análise"
          },
          {
            value: "APROVADO",
            text: "Aprovado"
          },
          {
            value: "REPROVADO",
            text: "Reprovado"
          },
          {
            value: "LIQUIDADO",
            text: "Liquidado"
          },
          {
            value: "CANCELADO",
            text: "Cancelado"
          },
        ]
      },
      {
        label: 'Taxa de juros',
        type: 'number',
        tag: 'input',
        name: 'taxa_juros',
        value: formData.taxa_juros,
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
      {
        label: 'Data da solicitção',
        type: 'date',
        tag: 'input',
        name: 'data_solicitacao',
        value: formData.data_solicitacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da análise',
        type: 'date',
        tag: 'input',
        name: 'data_analise',
        value: formData.data_analise,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da liquidação',
        type: 'date',
        tag: 'input',
        name: 'data_liquidacao',
        value: formData.data_liquidacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Finalidade',
        type: 'text',
        tag: 'textarea',
        name: 'finalidade',
        value: formData.finalidade,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Observação',
        type: 'text',
        tag: 'textarea',
        name: 'observacao',
        value: formData.observacao,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEmprestimoError() }}/>} 
      <Form {...formProps} />
    </>
  );
}