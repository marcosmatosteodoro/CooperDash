import React, { useCallback, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { Endereco } from '@/types/app/endereco'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEndereco, fetchEndereco, fetchEnderecos, updateEndereco } from '@/store/slices/enderecosSlice';
import useCooperado from './useCooperado';
import { PaginationParams } from '@/types/api';
import useFormatters from './useFormatters';

const useEndereco = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { cooperadoOptions, getCooperadoOptions } = useCooperado();
  const { formatCep } = useFormatters();
  const enderecos = useSelector((state: RootState) => state.enderecos);
  const [formData, setFormData] = useState<Endereco>({
    id: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    tipo: 'RESIDENCIAL',
    principal: false,
    cooperado_id: ''
  });

  const getFieldsProps = useCallback((): Field[] => {
    if(!cooperadoOptions || cooperadoOptions.length == 0) {
      getCooperadoOptions()
    }

    return [
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
        value: formData.tipo,
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
        value: formData.cooperado_id,
        onChange: handleChange,
        options: cooperadoOptions
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
  }, [formData, cooperadoOptions, getCooperadoOptions, formatCep]);

  const getEndereco = useCallback((id: string) => {
    dispatch(fetchEndereco(id as string));
  }, [dispatch]);

  const getEnderecos = useCallback((params: PaginationParams) => {
    dispatch(fetchEnderecos(params));
  }, [dispatch]);

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: FieldChangeEvent) => {
    const { name } = e.target;
    let checked = false;
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === 'checkbox'
    ) {
      checked = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmitNewEndereco = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        cep: formData.cep.replaceAll('.', '').replaceAll('-', ''),
      }
      const action = await dispatch(createEndereco(data)).unwrap();
      router.push(`/enderecos/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar endereco:', error);
    }
  };

  const handleSubmitEditEndereco = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateEndereco({ id: formData.id, data: formData })).unwrap();
      router.push(`/enderecos/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar endereco:', error);
    }
  };

  const clearEnderecoError = () => {
    dispatch({ type: 'enderecos/clearError' });
  };

  return {
    enderecos,
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleSubmitNewEndereco,
    handleSubmitEditEndereco,
    clearEnderecoError,
    getFieldsProps,
    getEndereco,
    getEnderecos
  };
};

export default useEndereco;