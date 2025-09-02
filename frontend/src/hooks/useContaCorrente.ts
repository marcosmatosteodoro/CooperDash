import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { ContaCorrente } from '@/types/app/contaCorrente'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createContaCorrente, fetchContaCorrente, fetchContasCorrentes, updateContaCorrente } from '@/store/slices/contasCorrentesSlice';
import { PaginationParams } from '@/types/api';
import useCooperado from './useCooperado';

const useContaCorrente = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { cooperadoOptions, getCooperadoOptions } = useCooperado();
  const contasCorrentes = useSelector((state: RootState) => state.contasCorrentes);
  const [formData, setFormData] = useState<ContaCorrente>({
    id: '',
    cooperado_id: '',
    numero_conta: '',
    saldo: 0,
    limite_credito: 0,
    status: 'ATIVA',
    data_abertura: '',
    data_encerramento: '',
  } as ContaCorrente);
  
  const getFieldsProps = useCallback((): Field[] => {
    if(!cooperadoOptions || cooperadoOptions.length == 0) {
      getCooperadoOptions()
    }

    return [
      {
        label: 'Número da Conta',
        type: 'number',
        tag: 'input',
        name: 'numero_conta',
        value: formData.numero_conta,
        contentClassName: 'col-12',
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
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.cooperado_id,
        onChange: handleChange,
        options: cooperadoOptions
      },
    ]
  }, [formData, cooperadoOptions, getCooperadoOptions]);

  const getContaCorrente = useCallback((id: string) => {
    dispatch(fetchContaCorrente(id as string));
  }, [dispatch]);

  const getContasCorrentes = useCallback((params: PaginationParams) => {
    dispatch(fetchContasCorrentes(params));
  }, [dispatch]);

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewContaCorrente = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createContaCorrente(formData)).unwrap();
      router.push(`/contas-correntes/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar contaCorrente:', error);
    }
  };

  const handleSubmitEditContaCorrente = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateContaCorrente({ id: formData.id, data: formData })).unwrap();
      router.push(`/contas-correntes/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar contaCorrente:', error);
    }
  };

  const clearContaCorrenteError = () => {
    dispatch({ type: 'contas-correntes/clearError' });
  };

  useEffect(() => {
    if (contasCorrentes.current) {
      setFormData(contasCorrentes.current);
    }
  }, [contasCorrentes, setFormData]);

  return {
    contasCorrentes,
    formData,
    setFormData,
    handleChange,
    handleSubmitNewContaCorrente,
    handleSubmitEditContaCorrente,
    clearContaCorrenteError,
    getContaCorrente,
    getContasCorrentes,
    getFieldsProps
  };
};

export default useContaCorrente;