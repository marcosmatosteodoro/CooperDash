import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent, Option } from '@/types/ui/'
import type { Assembleia } from '@/types/app/assembleia'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createAssembleia, fetchAssembleia, fetchAssembleias, updateAssembleia } from '@/store/slices/assembleiasSlice';
import { PaginationParams } from '@/types/api';

const useAssembleia = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const assembleias = useSelector((state: RootState) => state.assembleias);
  const [assembleiaOptions, setAssembleiaOptions] = useState<Option[]>([]);
  const [formData, setFormData] = useState<Assembleia>({
    id: '',
    titulo: '',
    descricao: '',
    data_hora: '',
    tipo: 'ORDINARIA',
    status: 'AGENDADA',
    pauta: '',
    local: '',
    resultado: '',
    quorum_minimo: 0
  } as Assembleia);

  const getFieldsProps = useCallback((): Field[] => {
    return [
      {
        label: 'Título',
        type: 'text',
        tag: 'input',
        name: 'titulo',
        value: formData.titulo,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Tipo',
        type: 'text',
        tag: 'select',
        name: 'tipo',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.tipo,
        onChange: handleChange,
        options: [
          {
            value: "ORDINARIA",
            text: "Ordinária"
          },
          {
            value: "EXTRAORDINARIA",
            text: "Extraordinária"
          },
        ]
      },
      {
        label: 'Status',
        type: 'text',
        tag: 'select',
        name: 'status',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.status,
        onChange: handleChange,
        options: [
          {
            value: "AGENDADA",
            text: "Agendada"
          },
          {
            value: "EM_ANDAMENTO",
            text: "Em Andamento"
          },
          {
            value: "CONCLUIDA",
            text: "Concluída"
          },
          {
            value: "CANCELADA",
            text: "Cancelada"
          },
        ]
      },
      {
        label: 'Quorum Mínimo',
        type: 'text',
        tag: 'input',
        name: 'quorum_minimo',
        value: formData.quorum_minimo,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Pauta',
        type: 'text',
        tag: 'input',
        name: 'pauta',
        value: formData.pauta,
        contentClassName: 'col-12 ',
        onChange: handleChange
      },
      {
        label: 'Local',
        type: 'text',
        tag: 'input',
        name: 'local',
        value: formData.local,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Data e Hora',
        type: 'datetime-local',
        tag: 'input',
        name: 'data_hora',
        value: formData.data_hora,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Descrição',
        type: 'text',
        tag: 'textarea',
        name: 'descricao',
        value: formData.descricao,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Resultado',
        type: 'text',
        tag: 'textarea',
        name: 'resultado',
        value: formData.resultado,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }, [formData]);
  
  const getAssembleia = useCallback((id: string) => {
    dispatch(fetchAssembleia(id as string));
  }, [dispatch]);

  const getAssembleias = useCallback((params: PaginationParams) => {
    dispatch(fetchAssembleias(params));
  }, [dispatch]);

  const getAssembleiaOptions = useCallback(() => {
      dispatch(fetchAssembleias({ per_page: 999999999 }));
    }, [dispatch]);

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

  useEffect(() => {
    if (assembleias.current) {
      setFormData(assembleias.current);
    }
  }, [assembleias, setFormData]);

  useEffect(() => {
    if (assembleias.list) {
      const options = assembleias.list.map(item => ({
        value: item.id,
        text: item.titulo
      }));

      options.unshift({ value: '', text: 'Selecione uma assembleia' });
      setAssembleiaOptions(options);
    }
  }, [assembleias.list]);

  return {
    assembleiaOptions,
    assembleias,
    formData, 
    setFormData,
    handleChange,
    handleSubmitNewAssembleia,
    handleSubmitEditAssembleia,
    clearAssembleiaError,
    getFieldsProps,
    getAssembleia,
    getAssembleias,
    getAssembleiaOptions
  };
};

export default useAssembleia;