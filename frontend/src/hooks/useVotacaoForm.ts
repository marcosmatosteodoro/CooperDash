import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { Votacao } from '@/types/app/votacao'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createVotacao, updateVotacao } from '@/store/slices/votacoesSlice';

const useVotacaoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Votacao>({} as Votacao);
  
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

  const handleSubmitNewVotacao = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createVotacao(formData)).unwrap();
      router.push(`/votacoes/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar votacao:', error);
    }
  };

  const handleSubmitEditVotacao = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateVotacao({ id: formData.id, data: formData })).unwrap();
      router.push(`/votacoes/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar votacao:', error);
    }
  };

  const clearVotacaoError = () => {
    dispatch({ type: 'votacoes/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleDocumentChange,
    handleValueChange,
    handleSubmitNewVotacao,
    handleSubmitEditVotacao,
    clearVotacaoError
  };
};

export default useVotacaoForm;