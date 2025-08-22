import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { Emprestimo } from '@/types/app/emprestimo'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEmprestimo, updateEmprestimo } from '@/store/slices/emprestimosSlice';

const useEmprestimoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Emprestimo>({} as Emprestimo);
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createEmprestimo(formData)).unwrap();
      router.push(`/emprestimos/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar emprestimo:', error);
    }
  };

  const handleSubmitEditEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateEmprestimo({ id: formData.id, data: formData })).unwrap();
      router.push(`/emprestimos/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar emprestimo:', error);
    }
  };

  const clearEmprestimoError = () => {
    dispatch({ type: 'emprestimos/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewEmprestimo,
    handleSubmitEditEmprestimo,
    clearEmprestimoError
  };
};

export default useEmprestimoForm;