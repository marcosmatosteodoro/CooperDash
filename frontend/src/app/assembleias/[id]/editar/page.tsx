'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchAssembleia } from '@/store/slices/assembleiasSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useAssembleiaForm from '@/hooks/useAssembleiaForm';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarCooperador() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.assembleias);
  const { setEditLayout } = useLayout();
  const { 
    formData,
    setFormData,
    handleChange,
    handleSubmitEditAssembleia,
    clearAssembleiaError 
  } = useAssembleiaForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchAssembleia(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setEditLayout({ path: `/assembleias`, label: 'Assembleias', id: typeof id === 'string' ? id : '', dynamicLabel: current?.titulo || 'Assembleia' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Endereço não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/assembleias'),
    handleSubmit: handleSubmitEditAssembleia,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Título',
        type: 'text',
        tag: 'input',
        name: 'titulo',
        value: formData.titulo,
        contentClassName: 'col-12',
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
            value: "ORDINARIA",
            text: "Ordinária"
          },
          {
            value: "EXTRAORDINARIA",
            text: "Extraordinária"
          },
        ]
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
            value: "AGENDADA",
            text: "Agendada"
          },
          {
            value: "EM_ANDAMENTO",
            text: "Em Andamento"
          },
          {
            value: "CONCLUIDA",
            text: "Concluída"
          },
          {
            value: "CANCELADA",
            text: "Cancelada"
          },
        ]
      },
      {
        label: 'Quorum Mínimo',
        type: 'text',
        tag: 'input',
        name: 'quorum_minimo',
        value: formData.quorum_minimo,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Pauta',
        type: 'text',
        tag: 'input',
        name: 'pauta',
        value: formData.pauta,
        contentClassName: 'col-12 ',
        onChange: handleChange
      },
      {
        label: 'Local',
        type: 'text',
        tag: 'input',
        name: 'local',
        value: formData.local,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Data e Hora',
        type: 'datetime-local',
        tag: 'input',
        name: 'data_hora',
        value: formData.data_hora,
        contentClassName: 'col-md-6',
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
      {
        label: 'Resultado',
        type: 'text',
        tag: 'textarea',
        name: 'resultado',
        value: formData.resultado,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearAssembleiaError() }}/>} 
      <Form {...formProps} />
    </>
  );
}