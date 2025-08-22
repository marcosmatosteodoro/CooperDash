import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { ContaCorrente } from '@/types/app/contaCorrente'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createContaCorrente, updateContaCorrente } from '@/store/slices/contasCorrentesSlice';

const useContaCorrenteForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<ContaCorrente>({} as ContaCorrente);
  
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
      router.push(`/contasCorrentes/${action.id}`);
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
      router.push(`/contasCorrentes/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar contaCorrente:', error);
    }
  };

  const clearContaCorrenteError = () => {
    dispatch({ type: 'contasCorrentes/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewContaCorrente,
    handleSubmitEditContaCorrente,
    clearContaCorrenteError
  };
};

export default useContaCorrenteForm;