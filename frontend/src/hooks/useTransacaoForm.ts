import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { Transacao } from '@/types/app/transacao'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createTransacao, updateTransacao } from '@/store/slices/transacoesSlice';

const useTransacaoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Transacao>({} as Transacao);
  
  const handleValueChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
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

  return {
    formData, 
    setFormData,
    handleValueChange,
    handleSubmitNewTransacao,
    handleSubmitEditTransacao,
    clearTransacaoError
  };
};

export default useTransacaoForm;