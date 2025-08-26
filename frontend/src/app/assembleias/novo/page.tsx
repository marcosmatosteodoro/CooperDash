'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useFormatters from '@/hooks/useFormatters';
import useAssembleiaForm from '@/hooks/useAssembleiaForm';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoAssembleia() {
  const router = useRouter();
  const { setLayoutData } = useLayout();
  const { formatCep } = useFormatters();
  const { formData, handleChange, handleSubmitNewAssembleia, clearAssembleiaError } = useAssembleiaForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.assembleias);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/assembleias', label: 'Assembleias' }, 
      ],
      title: 'Novo Assembleia',
      icon: 'bi-person-plus',
      buttons: (
        <Link className="btn btn-outline-secondary" href={'/assembleias'}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData]);

  const formProps: FormProps = {
    onClick: () => router.push('/assembleias'),
    handleSubmit: handleSubmitNewAssembleia,
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
        tag: 'input',
        name: 'descricao',
        value: formData.descricao,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Resultado',
        type: 'text',
        tag: 'input',
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