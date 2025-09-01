import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { Cooperado } from '@/types/app/cooperado'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createCooperado, fetchCooperado, fetchCooperados, updateCooperado } from '@/store/slices/cooperadosSlice';
import { texto } from '@/data/textos';
import useFormatters from '@/hooks/useFormatters';
import { countryCodes } from '@/data/countryCodes';
import { RootState } from '@/store';
import { PaginationParams } from '@/types/api';

const useCooperado = () => {
  const dispatch: AppDispatch = useDispatch();
  const { formatDocument } = useFormatters();
  const router = useRouter();

  const cooperados = useSelector((state: RootState) => state.cooperados);

  const [formData, setFormData] = useState<Cooperado>({
    id: '',
    nome: '',
    tipo_pessoa: 'FISICA',
    documento: '',
    data: '',
    valor: 0,
    codigo_pais: '+55',
    telefone: '',
    email: '',
  });

  const getFieldsProps = useCallback((): Field[] => {
    return [
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
          html: React.createElement('span', { className: 'input-group-text' }, 'R$'),
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
          html: React.createElement(
            'select',
            {
              className: 'form-select w-auto',
              name: 'codigo_pais',
              value: formData.codigo_pais,
              onChange: handleChange,
            },
            countryCodes.map((country) =>
              React.createElement(
                'option',
                { key: country.value, value: country.value },
                country.label
              )
            )
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
  }, [formData, formatDocument]);

  const getCooperado = useCallback((id: string) => {
    dispatch(fetchCooperado(id as string));
  }, [dispatch]);

  const getCooperados = useCallback((params: PaginationParams) => {
    dispatch(fetchCooperados(params));
  }, [dispatch]);

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleValueChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmitNewCooperado = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createCooperado(formData)).unwrap();
      router.push(`/cooperados/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar cooperado:', error);
    }
  };

  const handleSubmitEditCooperado = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateCooperado({ id: formData.id, data: formData })).unwrap();
      router.push(`/cooperados/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar cooperado:', error);
    }
  };

  const clearCooperadoError = () => {
    dispatch({ type: 'cooperados/clearError' });
  };

  useEffect(() => {
    if (cooperados.current) {
      setFormData(cooperados.current);
    }
  }, [cooperados, setFormData]);

  return {
    cooperados,
    formData,
    setFormData,
    handleChange,
    handleDocumentChange,
    handleValueChange,
    handleSubmitNewCooperado,
    handleSubmitEditCooperado,
    clearCooperadoError,
    getFieldsProps,
    getCooperado,
    getCooperados
  };
};

export default useCooperado;