'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useFormatters from '@/hooks/useFormatters';
import useCooperadoForm from '@/hooks/useCooperadoForm';
import { countryCodes } from '@/data/countryCodes';
import { texto } from '@/data/textos';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoCooperador() {
  const router = useRouter();
  const { setNewLayout } = useLayout();
  const { formatDocument } = useFormatters();
  const { formData, handleChange, handleDocumentChange, handleValueChange, handleSubmitNewCooperado, clearCooperadoError } = useCooperadoForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.cooperados);

  useEffect(() => {
    setNewLayout({ path: '/cooperados', label: 'Cooperados', title: 'Novo Cooperado' });
  }, [setNewLayout]);

  const formProps: FormProps = {
    onClick: () => router.push('/cooperados'),
    handleSubmit: handleSubmitNewCooperado,
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