'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useFormatters from '@/hooks/useFormatters';
import useCooperadoForm from '@/hooks/useCooperadoForm';
import { countryCodes } from '@/data/countryCodes';
import { texto } from '@/data/textos';
import {Form, ErrorAlert, LoadingSpinner, NotFoundPage} from '@/components/';
import { FormProps } from '@/components/Form/types'

export default function EditarCooperador() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector((state: RootState) => state.cooperados);
  const { setLayoutData } = useLayout();
  const { formatDocument } = useFormatters();
  const { 
    formData,
    setFormData,
    handleChange,
    handleDocumentChange,
    handleValueChange,
    handleSubmitEditCooperado,
    clearCooperadoError 
  } = useCooperadoForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchCooperado(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }, 
        { path: `/cooperados/${id}`, label: current?.nome || 'Detalhes' },
        { path: `/cooperados/${id}/editar`, label: 'Edição' }
      ],
      title: 'Editar Cooperado',
      icon: 'bi-pencil-square',
      buttons: (
        <Link className="btn btn-outline-secondary" href={`/cooperados/${id}`}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData, current, id]);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current ) return <NotFoundPage message="Cooperado não encontrado" />;
  
  const formProps: FormProps = {
    onClick: () => router.push('/cooperados'),
    handleSubmit: handleSubmitEditCooperado,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: texto[formData.tipo_pessoa].nome,
        type: 'text',
        tag: 'input',
        name: 'nome',
        value: formData.nome,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Tipo',
        type: 'text',
        tag: 'select',
        name: 'tipo_pessoa',
        contentClassName: 'col-md-6',
        onChange: handleChange,
        options: [
          {
            value: "FISICA",
            text: "Pessoa Física"
          },
          {
            value: "JURIDICA",
            text: "Pessoa Jurídica"
          },
        ]
      },
      {
        label: texto[formData.tipo_pessoa].documento,
        type: 'text',
        tag: 'input',
        name: 'documento',
        value: formatDocument(formData.documento, formData.tipo_pessoa),
        contentClassName: 'col-md-6',
        maxLength: formData.tipo_pessoa === 'FISICA' ? 14 : 18,
        placeholder: formData.tipo_pessoa === 'FISICA' ? 'xxx.xxx.xxx-xx' : 'xx.xxx.xxx/xxxx-xx',
        onChange: handleDocumentChange
      },
      {
        label: texto[formData.tipo_pessoa].data,
        type: 'date',
        tag: 'input',
        name: 'data',
        value: formData.data,
        contentClassName: 'col-md-6',
        max: new Date().toISOString().split('T')[0],
        onChange: handleChange
      },
      {
        label: texto[formData.tipo_pessoa].valor,
        type: 'number',
        tag: 'input',
        name: 'valor',
        value: formData.valor,
        contentClassName: 'col-md-6',
        min: "0",
        step: "0.01",
        inputGroup: {
          html: <span className="input-group-text">R$</span>,
        },  
        onChange: handleValueChange
      },
      {
        label: 'Telefone',
        type: 'tel',
        tag: 'input',
        name: 'telefone',
        value: formData.telefone,
        contentClassName: 'col-md-6',
        className: 'w-75',
        placeholder: 'XXXXXXX-XXXX',
        minLength: 8,
        maxLength: 15,
        inputGroup: {
          className: "d-flex flex-nowrap",
          html: (
            <select
              className="form-select w-auto"
              name="codigo_pais"
              value={formData.codigo_pais}
              onChange={handleChange}
            >
              {countryCodes.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          ),
        },  
        onChange: handleChange
      },
      {
        label: 'Email',
        type: 'email',
        tag: 'input',
        name: 'email',
        value: formData.email,
        contentClassName: 'col-12',
        placeholder: 'nome@email.com',
        onChange: handleChange
      },
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearCooperadoError() }}/>} 
      <Form {...formProps} />
    </>
  );
}