import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { Endereco } from '@/types/app/endereco'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEndereco, updateEndereco } from '@/store/slices/enderecosSlice';

const useEnderecoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Endereco>({} as Endereco);
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewEndereco = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createEndereco(formData)).unwrap();
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
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewEndereco,
    handleSubmitEditEndereco,
    clearEnderecoError
  };
};

export default useEnderecoForm;