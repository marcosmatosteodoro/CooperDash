'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux';
import { useLayout } from '@/providers/LayoutProvider'
import useFormatters from '@/hooks/useFormatters';
import useEnderecoForm from '@/hooks/useEnderecoForm';
import { RootState } from '@/store';
import { Form, ErrorAlert } from '@/components'
import type { FormProps } from '@/types/ui'

export default function NovoEndereco() {
  const router = useRouter();
  
  const { setLayoutData } = useLayout();
  const { formatCep } = useFormatters();
  const { formData, CooperadoOptions, handleChange, handleCheckboxChange, handleSubmitNewEndereco, clearEnderecoError } = useEnderecoForm();
  const { error, fieldErrors } = useSelector((state: RootState) => state.enderecos);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/enderecos', label: 'Endereços' }, 
      ],
      title: 'Novo Endereço',
      icon: 'bi-person-plus',
      buttons: (
        <Link className="btn btn-outline-secondary" href={'/enderecos'}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData]);

  const formProps: FormProps = {
    onClick: () => router.push('/enderecos'),
    handleSubmit: handleSubmitNewEndereco,
    fieldErrors: fieldErrors,
    fields: [
      {
        label: 'Logradouro',
        type: 'text',
        tag: 'input',
        name: 'logradouro',
        value: formData.logradouro,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Tipo',
        type: 'text',
        tag: 'select',
        name: 'tipo',
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange,
        options: [
          {
            value: "RESIDENCIAL",
            text: "Residencial"
          },
          {
            value: "COMERCIAL",
            text: "Comercial"
          },
          {
            value: "COBRANCA",
            text: "Cobrança"
          },
        ]
      },
      {
        label: 'CEP',
        type: 'text',
        tag: 'input',
        name: 'cep',
        value: formatCep(formData.cep),
        contentClassName: 'col-md-6 col-lg-4',
        maxLength: 9,
        placeholder: 'xxxxx-xxx',
        onChange: handleChange
      },
      {
        label: 'Estado',
        type: 'text',
        tag: 'input',
        name: 'estado',
        value: formData.estado,
        contentClassName: 'col-md-6 col-lg-4',
        maxLength: 2,
        placeholder: 'SP',
        onChange: handleChange
      },
      {
        label: 'Bairro',
        type: 'text',
        tag: 'input',
        name: 'bairro',
        value: formData.bairro,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Cidade',
        type: 'text',
        tag: 'input',
        name: 'cidade',
        value: formData.cidade,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Número',
        type: 'text',
        tag: 'input',
        name: 'numero',
        value: formData.numero,
        contentClassName: 'col-md-6 col-lg-4',
        maxLength: 10,
        placeholder: 'S/N',
        onChange: handleChange
      },
      {
        label: 'Complemento',
        type: 'text',
        tag: 'input',
        name: 'complemento',
        value: formData.complemento,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Cooperado',
        type: 'text',
        tag: 'select',
        name: 'cooperado_id',
        contentClassName: 'col-md-6',
        onChange: handleChange,
        options: CooperadoOptions
      },
      {
        label: 'Endereço Principal',
        type: 'checkbox',
        tag: 'checkbox',
        name: 'principal',
        checked: formData.principal,
        contentClassName: 'col-12',
        onChange: handleCheckboxChange
      }
    ]
  }

  return (
    <>
      {error && <ErrorAlert message={error} onClick={() => { clearEnderecoError() }}/>}
      <Form {...formProps} />
    </>
  );
}