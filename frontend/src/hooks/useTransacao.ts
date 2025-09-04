import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { Transacao } from '@/types/app/transacao'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createTransacao, fetchTransacao, fetchTransacoes, updateTransacao } from '@/store/slices/transacoesSlice';
import useContaCorrente from './useContaCorrente';
import { PaginationParams } from '@/types/api';

const useTransacao = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const transacoes = useSelector((state: RootState) => state.transacoes);
  const { contaCorrenteOptions, getContasCorrentesOptions } = useContaCorrente();
  const [formData, setFormData] = useState<Transacao>({
    id: '',
    contas_corrente_id: '',
    valor: 0,
    tipo: 'DEPOSITO',
    saldo_anterior: 0,
    saldo_posterior: 0,
    data_transacao: '',
    categoria: '',
    descricao: ''
  });
  
  const getFieldsProps = useCallback((): Field[] => {
    if(!contaCorrenteOptions || contaCorrenteOptions.length == 0) {
      getContasCorrentesOptions()
    }

    return [
      {
        label: 'Conta Corrente',
        type: 'text',
        tag: 'select',
        name: 'contas_corrente_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.contas_corrente_id,
        onChange: handleChange,
        options: contaCorrenteOptions
      },
      {
        label: 'Valor',
        type: 'number',
        tag: 'input',
        name: 'valor',
        value: formData.valor,
        contentClassName: 'col-md-6 col-lg-4',
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
            value: "DEPOSITO",
            text: "Deposito"
          },
          {
            value: "SAQUE",
            text: "Saque"
          },
          {
            value: "TRANSFERENCIA",
            text: "Transferência"
          },
          {
            value: "RENDIMENTO",
            text: "Rendimento"
          },
          {
            value: "TAXA",
            text: "Taxa"
          },
        ]
      },
      {
        label: 'Saldo anterior',
        type: 'number',
        tag: 'input',
        name: 'saldo_anterior',
        value: formData.saldo_anterior,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Saldo posterior',
        type: 'number',
        tag: 'input',
        name: 'saldo_posterior',
        value: formData.saldo_posterior,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da transação',
        type: 'date',
        tag: 'input',
        name: 'data_transacao',
        value: formData.data_transacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Categoria',
        type: 'text',
        tag: 'input',
        name: 'categoria',
        value: formData.categoria,
        contentClassName: 'col-12',
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
    ]
  }, [formData, contaCorrenteOptions]);

  const getTransacao = useCallback((id: string) => {
    dispatch(fetchTransacao(id as string));
  }, [dispatch]);

  const getTransacoes = useCallback((params: PaginationParams) => {
    dispatch(fetchTransacoes(params));
  }, [dispatch]);
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewTransacao = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createTransacao(formData)).unwrap();
      router.push(`/transacoes/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar transacao:', error);
    }
  };

  const handleSubmitEditTransacao = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateTransacao({ id: formData.id, data: formData })).unwrap();
      router.push(`/transacoes/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar transacao:', error);
    }
  };

  const clearTransacaoError = () => {
    dispatch({ type: 'transacoes/clearError' });
  };

  useEffect(() => {
    if (transacoes.current) {
      setFormData(transacoes.current);
    }
  }, [transacoes, setFormData]);

  return {
    transacoes,
    formData,
    setFormData,
    handleChange,
    handleSubmitNewTransacao,
    handleSubmitEditTransacao,
    clearTransacaoError,
    getFieldsProps,
    getTransacao,
    getTransacoes
  };
};

export default useTransacao;