'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useVotacaoForm from '@/hooks/useVotacaoForm';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoVotacao() {
  const router = useRouter();
  const { setLayoutData } = useLayout();
  const { formData, cooperadoOptions, assembleiaOptions, handleChange, handleSubmitNewVotacao, clearVotacaoError } = useVotacaoForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.votacoes);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/votacoes', label: 'Votações' }, 
      ],
      title: 'Novo Votação',
      icon: 'bi-person-plus',
      buttons: (
        <Link className="btn btn-outline-secondary" href={'/votacoes'}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData]);

  const formProps: FormProps = {
    onClick: () => router.push('/votacoes'),
    handleSubmit: handleSubmitNewVotacao,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Assembleia',
        type: 'text',
        tag: 'select',
        name: 'assembleia_id',
        contentClassName: 'col-md-6',
        value: formData.assembleia_id,
        onChange: handleChange,
        options: assembleiaOptions
      },
      {
        label: 'Cooperado',
        type: 'text',
        tag: 'select',
        name: 'cooperado_id',
        contentClassName: 'col-md-6',
        value: formData.cooperado_id,
        onChange: handleChange,
        options: cooperadoOptions
      },
      {
        label: 'Data da votação',
        type: 'text',
        tag: 'input',
        name: 'data_voto',
        value: formData.data_voto,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Voto',
        type: 'text',
        tag: 'select',
        name: 'voto',
        contentClassName: 'col-md-6',
        value: formData.voto,
        onChange: handleChange,
        options: [
          {
            value: "FAVOR",
            text: "Favor"
          },
          {
            value: "CONTRA",
            text: "Contra"
          },
          {
            value: "ABSTENCAO",
            text: "Abstenção"
          },
        ]
      },
      {
        label: 'Justificativa',
        type: 'text',
        tag: 'textarea',
        name: 'justificativa',
        value: formData.justificativa,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearVotacaoError() }}/>}
      <Form {...formProps} />
    </>
  );
}