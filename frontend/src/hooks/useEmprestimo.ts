import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent, Option } from '@/types/ui/'
import type { Emprestimo } from '@/types/app/emprestimo'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEmprestimo, fetchEmprestimo, fetchEmprestimos, updateEmprestimo } from '@/store/slices/emprestimosSlice';
import useCooperado from './useCooperado';
import { PaginationParams } from '@/types/api';

const useEmprestimo = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const emprestimos = useSelector((state: RootState) => state.emprestimos);
  const { cooperadoOptions, getCooperadoOptions } = useCooperado();
  const [emprestimoOptions, setEmprestimoOptions] = useState<Option[]>([]);
  const [formData, setFormData] = useState<Emprestimo>({
    id: '',
    cooperado_id: '',
    valor_solicitado: 0,
    valor_aprovado: 0,
    parcelas: 1,
    taxa_juros: 0,
    status: 'ANALISE',
    finalidade: '',
    data_solicitacao: '',
    data_analise: '',
    data_liquidacao: '',
    observacao: ''
  } as Emprestimo);
  
  const getFieldsProps = useCallback((): Field[] => {
    if(!cooperadoOptions || cooperadoOptions.length == 0) {
      getCooperadoOptions()
    }

    return [
      {
        label: 'Valor solicitado',
        type: 'number',
        tag: 'input',
        name: 'valor_solicitado',
        value: formData.valor_solicitado,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Valor aprovado',
        type: 'number',
        tag: 'input',
        name: 'valor_aprovado',
        value: formData.valor_aprovado,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Parcelas',
        type: 'number',
        tag: 'input',
        name: 'parcelas',
        value: formData.parcelas,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
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
            value: "ANALISE",
            text: "Análise"
          },
          {
            value: "APROVADO",
            text: "Aprovado"
          },
          {
            value: "REPROVADO",
            text: "Reprovado"
          },
          {
            value: "LIQUIDADO",
            text: "Liquidado"
          },
          {
            value: "CANCELADO",
            text: "Cancelado"
          },
        ]
      },
      {
        label: 'Taxa de juros',
        type: 'number',
        tag: 'input',
        name: 'taxa_juros',
        value: formData.taxa_juros,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Cooperado',
        type: 'text',
        tag: 'select',
        name: 'cooperado_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.cooperado_id,
        onChange: handleChange,
        options: cooperadoOptions
      },
      {
        label: 'Data da solicitção',
        type: 'date',
        tag: 'input',
        name: 'data_solicitacao',
        value: formData.data_solicitacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da análise',
        type: 'date',
        tag: 'input',
        name: 'data_analise',
        value: formData.data_analise,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data da liquidação',
        type: 'date',
        tag: 'input',
        name: 'data_liquidacao',
        value: formData.data_liquidacao,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Finalidade',
        type: 'text',
        tag: 'textarea',
        name: 'finalidade',
        value: formData.finalidade,
        contentClassName: 'col-12',
        onChange: handleChange
      },
      {
        label: 'Observação',
        type: 'text',
        tag: 'textarea',
        name: 'observacao',
        value: formData.observacao,
        contentClassName: 'col-12',
        onChange: handleChange
      },
    ]
  }, [formData, cooperadoOptions, getCooperadoOptions]);

  const getEmprestimo = useCallback((id: string) => {
    dispatch(fetchEmprestimo(id as string));
  }, [dispatch]);

  const getEmprestimos = useCallback((params: PaginationParams) => {
    dispatch(fetchEmprestimos(params));
  }, [dispatch]);

  const getEmprestimoOptions = useCallback(() => {
    dispatch(fetchEmprestimos({ per_page: 999999999 }));
  }, [dispatch]);

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

  useEffect(() => {
    if (emprestimos.current) {
      setFormData(emprestimos.current);
    }
  }, [emprestimos, setFormData]);

  useEffect(() => {
    if (emprestimos.list) {
      const options = emprestimos.list.map(item => ({
        value: item.id,
        text: (item.valor_aprovado || item.valor_solicitado).toString()
      }));

      options.unshift({ value: '', text: 'Selecione um cooperado' });
      setEmprestimoOptions(options);
    }
  }, [emprestimos.list]);

  return {
    emprestimoOptions,
    emprestimos,
    formData,
    setFormData,
    handleChange,
    handleSubmitNewEmprestimo,
    handleSubmitEditEmprestimo,
    clearEmprestimoError,
    getEmprestimo,
    getEmprestimos,
    getFieldsProps,
    getEmprestimoOptions
  };
};

export default useEmprestimo;