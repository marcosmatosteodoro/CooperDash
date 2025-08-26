import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { ContaCorrente } from '@/types/app/contaCorrente'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createContaCorrente, updateContaCorrente } from '@/store/slices/contasCorrentesSlice';
import { fetchCooperados } from '@/store/slices/cooperadosSlice';

const useContaCorrenteForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list } = useSelector((state: RootState) => state.cooperados);
  const router = useRouter();

  const [formData, setFormData] = useState<ContaCorrente>({} as ContaCorrente);
  
  const [CooperadoOptions, setCooperadoOptions] = useState<Option[]>([]);
  
    useEffect(() => {
        dispatch(fetchCooperados({ per_page: 999999999 }));
    }, [dispatch]);
  
    useEffect(() => {
      if (list) {
        const options = list.map(item => ({
          value: item.id,
          text: item.nome
        }));
  
        options.unshift({ value: '', text: 'Selecione um cooperado' });
        setCooperadoOptions(options);
      }
    }, [list]);

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
    CooperadoOptions,
    setFormData,
    handleChange,
    handleSubmitNewContaCorrente,
    handleSubmitEditContaCorrente,
    clearContaCorrenteError
  };
};

export default useContaCorrenteForm;