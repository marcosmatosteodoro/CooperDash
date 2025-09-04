import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { Votacao } from '@/types/app/votacao'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createVotacao, fetchVotacao, fetchVotacoes, updateVotacao } from '@/store/slices/votacoesSlice';
import useCooperado from './useCooperado';
import useAssembleia from './useAssembleia';
import { PaginationParams } from '@/types/api';

const useVotacao = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const votacoes = useSelector((state: RootState) => state.votacoes);
  const { cooperadoOptions, getCooperadoOptions } = useCooperado();
  const { assembleiaOptions, getAssembleiaOptions } = useAssembleia();
  const [formData, setFormData] = useState<Votacao>({
    id: '',
    assembleia_id: '',
    cooperado_id: '',
    voto: 'FAVOR',
    data_voto: '',
    justificativa: ''
  } as Votacao);

  const getFieldsProps = useCallback((): Field[] => {
    if(!cooperadoOptions || cooperadoOptions.length == 0) {
      getCooperadoOptions()
    }
    if(!assembleiaOptions || assembleiaOptions.length == 0) {
      getAssembleiaOptions()
    }

    return [
      {
        label: 'Assembleia',
        type: 'text',
        tag: 'select',
        name: 'assembleia_id',
        contentClassName: 'col-md-6',
        value: formData.assembleia_id,
        onChange: handleChange,
        options: assembleiaOptions
      },
      {
        label: 'Cooperado',
        type: 'text',
        tag: 'select',
        name: 'cooperado_id',
        contentClassName: 'col-md-6',
        value: formData.cooperado_id,
        onChange: handleChange,
        options: cooperadoOptions
      },
      {
        label: 'Data da votação',
        type: 'date',
        tag: 'input',
        name: 'data_voto',
        value: formData.data_voto,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Voto',
        type: 'text',
        tag: 'select',
        name: 'voto',
        contentClassName: 'col-md-6',
        value: formData.voto,
        onChange: handleChange,
        options: [
          {
            value: "FAVOR",
            text: "Favor"
          },
          {
            value: "CONTRA",
            text: "Contra"
          },
          {
            value: "ABSTENCAO",
            text: "Abstenção"
          },
        ]
      },
      {
        label: 'Justificativa',
        type: 'text',
        tag: 'textarea',
        name: 'justificativa',
        value: formData.justificativa,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }, [formData, cooperadoOptions, assembleiaOptions, getCooperadoOptions, getAssembleiaOptions]);

  const getVotacao = useCallback((id: string) => {
    dispatch(fetchVotacao(id as string));
  }, [dispatch]);

  const getVotacoes = useCallback((params: PaginationParams) => {
    dispatch(fetchVotacoes(params));
  }, [dispatch]);
  
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

  useEffect(() => {
    if (votacoes.current) {
      setFormData(votacoes.current);
    }
  }, [votacoes, setFormData]);

  return {
    votacoes,
    formData,
    setFormData,
    handleChange,
    handleDocumentChange,
    handleValueChange,
    handleSubmitNewVotacao,
    handleSubmitEditVotacao,
    clearVotacaoError,
    getFieldsProps,
    getVotacao,
    getVotacoes
  };
};

export default useVotacao;