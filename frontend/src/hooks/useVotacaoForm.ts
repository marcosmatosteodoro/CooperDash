import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { Votacao } from '@/types/app/votacao'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createVotacao, updateVotacao } from '@/store/slices/votacoesSlice';
import { fetchCooperados } from '@/store/slices/cooperadosSlice';
import { fetchAssembleias } from '@/store/slices/assembleiasSlice';

const useVotacaoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list: cooperado } = useSelector((state: RootState) => state.cooperados);
  const { list: assembleia } = useSelector((state: RootState) => state.assembleias);
  const router = useRouter();

  const [formData, setFormData] = useState<Votacao>({} as Votacao);
  const [cooperadoOptions, setCooperadoOptions] = useState<Option[]>([]);
  const [assembleiaOptions, setAssembleiaOptions] = useState<Option[]>([]);

    useEffect(() => {
      dispatch(fetchCooperados({ per_page: 999999999 }));
      dispatch(fetchAssembleias({ per_page: 999999999 }));
    }, [dispatch]);
  
    useEffect(() => {
      if (cooperado) {
        const options = cooperado.map(item => ({
          value: item.id,
          text: item.nome
        }));
  
        options.unshift({ value: '', text: 'Selecione um cooperado' });
        setCooperadoOptions(options);
      }
    }, [cooperado]);
    
    useEffect(() => {
      if (assembleia) {
        const options = assembleia.map(item => ({
          value: item.id,
          text: item.titulo
        }));

        options.unshift({ value: '', text: 'Selecione uma assembleia' });
        setAssembleiaOptions(options);
      }
    }, [assembleia]);

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
    cooperadoOptions,
    assembleiaOptions,
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