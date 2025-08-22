import React, { useState } from 'react';
import type { FieldChangeEvent } from '@/types/ui/'
import type { Assembleia } from '@/types/app/assembleia'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createAssembleia, updateAssembleia } from '@/store/slices/assembleiasSlice';

const useAssembleiaForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Assembleia>({} as Assembleia);
  
  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewAssembleia = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createAssembleia(formData)).unwrap();
      router.push(`/assembleias/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar assembleia:', error);
    }
  };

  const handleSubmitEditAssembleia = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateAssembleia({ id: formData.id, data: formData })).unwrap();
      router.push(`/assembleias/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar assembleia:', error);
    }
  };

  const clearAssembleiaError = () => {
    dispatch({ type: 'assembleias/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewAssembleia,
    handleSubmitEditAssembleia,
    clearAssembleiaError
  };
};

export default useAssembleiaForm;