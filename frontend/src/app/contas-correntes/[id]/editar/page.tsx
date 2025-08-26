'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchContaCorrente } from '@/store/slices/contasCorrentesSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useContaCorrenteForm from '@/hooks/useContaCorrenteForm';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarContaCorrente() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.contasCorrentes);
  const { setLayoutData } = useLayout();
  const { 
    formData,
    CooperadoOptions,
    setFormData,
    handleChange,
    handleSubmitEditContaCorrente,
    clearContaCorrenteError 
  } = useContaCorrenteForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchContaCorrente(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/contas-correntes', label: 'Contas Correntes' }, 
        { path: `/contas-correntes/${id}`, label: current?.numero_conta || 'Detalhes' },
        { path: `/contas-correntes/${id}/editar`, label: 'Edição' }
      ],
      title: 'Editar Conta Corrente',
      icon: 'bi-pencil-square',
      buttons: (
        <Link className="btn btn-outline-secondary" href={`/contas-correntes/${id}`}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/contas-correntes'),
    handleSubmit: handleSubmitEditContaCorrente,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Número da Conta',
        type: 'number',
        tag: 'input',
        name: 'numero_conta',
        value: formData.numero_conta,
        contentClassName: 'col-md-6 col-lg-4',
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
        contentClassName: 'col-md-6',
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