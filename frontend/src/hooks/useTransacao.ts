import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { Transacao } from '@/types/app/transacao'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createTransacao, updateTransacao } from '@/store/slices/transacoesSlice';
import { fetchContasCorrentes } from '@/store/slices/contasCorrentesSlice';

const useTransacao = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list } = useSelector((state: RootState) => state.contasCorrentes);
  const router = useRouter();

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
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [contaCorrenteOptions, setContaCorrenteOptions] = useState<Option[]>([]);
  
    useEffect(() => {
        dispatch(fetchContasCorrentes({ per_page: 999999999 }));
    }, [dispatch]);
  
    useEffect(() => {
      if (list) {
        const options = list.map(item => ({
          value: item.id,
          text: item.numero_conta
        }));

        options.unshift({ value: '', text: 'Selecione uma conta' });
        setContaCorrenteOptions(options);
      }
    }, [list]);

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

  return {
    formData,
    contaCorrenteOptions,
    setFormData,
    handleChange,
    handleSubmitNewTransacao,
    handleSubmitEditTransacao,
    clearTransacaoError
  };
};

export default useTransacao;