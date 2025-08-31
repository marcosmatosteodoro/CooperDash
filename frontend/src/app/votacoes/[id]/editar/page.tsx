'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchVotacao } from '@/store/slices/votacoesSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useVotacaoForm from '@/hooks/useVotacaoForm';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import type { FormProps } from '@/types/ui'

export default function EditarVotacao() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.votacoes);
  const { setEditLayout } = useLayout();
  const { 
    formData,
    cooperadoOptions,
    assembleiaOptions,
    setFormData,
    handleChange,
    handleSubmitEditVotacao,
    clearVotacaoError 
  } = useVotacaoForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchVotacao(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    setEditLayout({ path: `/votacoes`, label: 'Votações', id: typeof id === 'string' ? id : '', dynamicLabel: 'Detalhes' });
  }, [setEditLayout, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Votação não encontrado" />;

  const formProps: FormProps = {
    onClick: () => router.push('/votacoes'),
    handleSubmit: handleSubmitEditVotacao,
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
        type: 'date',
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
        contentClassName: 'col-12',
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