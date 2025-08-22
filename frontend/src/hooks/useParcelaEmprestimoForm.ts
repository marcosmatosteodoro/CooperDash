import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { ParcelaEmprestimo } from '@/types/app/parcelaEmprestimo'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createParcelaEmprestimo, updateParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';

const useParcelaEmprestimoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<ParcelaEmprestimo>({} as ParcelaEmprestimo);
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewParcelaEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createParcelaEmprestimo(formData)).unwrap();
      router.push(`/parcelasEmprestimos/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar parcelaEmprestimo:', error);
    }
  };

  const handleSubmitEditParcelaEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateParcelaEmprestimo({ id: formData.id, data: formData })).unwrap();
      router.push(`/parcelasEmprestimos/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar parcelaEmprestimo:', error);
    }
  };

  const clearParcelaEmprestimoError = () => {
    dispatch({ type: 'parcelasEmprestimos/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewParcelaEmprestimo,
    handleSubmitEditParcelaEmprestimo,
    clearParcelaEmprestimoError
  };
};

export default useParcelaEmprestimoForm;