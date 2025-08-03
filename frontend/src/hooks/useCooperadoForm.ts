import React, { useState, useEffect } from 'react';
import { FieldChangeEvent, FormProps } from '@/components/Form/types'
import { Cooperado } from '@/types/cooperado'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createCooperado, updateCooperado, fetchCooperado } from '@/store/slices/cooperadosSlice';
import { ErrorAlert } from '@/components';

const useCooperadoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Cooperado>({
    id: '',
    nome: '',
    tipo_pessoa: 'FISICA',
    documento: '',
    data: '',
    valor: 0,
    codigo_pais: '+55',
    telefone: '',
    email: '',
  });
  
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

  const handleSubmitNewCooperado = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createCooperado(formData)).unwrap();
      router.push(`/cooperados/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar cooperado:', error);
    }
  };

  const handleSubmitEditCooperado = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateCooperado({ id: formData.id, data: formData })).unwrap();
      router.push(`/cooperados/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar cooperado:', error);
    }
  };

  const clearCooperadoError = () => {
    dispatch({ type: 'cooperados/clearError' });
  };

  return {
    formData, 
    setFormData,
    handleChange,
    handleDocumentChange,
    handleValueChange,
    handleSubmitNewCooperado,
    handleSubmitEditCooperado,
    clearCooperadoError
  };
};

export default useCooperadoForm;