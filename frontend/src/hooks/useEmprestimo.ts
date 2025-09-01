import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { Emprestimo } from '@/types/app/emprestimo'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEmprestimo, updateEmprestimo } from '@/store/slices/emprestimosSlice';
import { fetchCooperados } from '@/store/slices/cooperadosSlice';

const useEmprestimo = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list } = useSelector((state: RootState) => state.cooperados);
  const router = useRouter();

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
    CooperadoOptions,
    setFormData,
    handleChange,
    handleSubmitNewEmprestimo,
    handleSubmitEditEmprestimo,
    clearEmprestimoError
  };
};

export default useEmprestimo;