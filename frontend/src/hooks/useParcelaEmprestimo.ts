import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { ParcelaEmprestimo } from '@/types/app/parcelaEmprestimo'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createParcelaEmprestimo, updateParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';
import { fetchEmprestimos } from '@/store/slices/emprestimosSlice';

const useParcelaEmprestimo = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list } = useSelector((state: RootState) => state.emprestimos);
  const router = useRouter();

  const [formData, setFormData] = useState<ParcelaEmprestimo>({
    id: '',
    numero_parcela: 1,
    valor_parcela: 0,
    emprestimo_id: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    data_pagamento: undefined,
    status: 'PENDENTE',
    dias_atraso: 0,
    valor_pago: 0,
    multa: 0,
    juros: 0
  } as ParcelaEmprestimo);
  const [emprestimoOptions, setEmprestimoOptions] = useState<Option[]>([]);
  
    useEffect(() => {
        dispatch(fetchEmprestimos({ per_page: 999999999 }));
    }, [dispatch]);
  
    useEffect(() => {
      if (list) {
        const options = list.map(item => ({
          value: item.id,
          text: (item.valor_aprovado || item.valor_solicitado).toString()
        }));

        options.unshift({ value: '', text: 'Selecione um empréstimo' });
        setEmprestimoOptions(options);
      }
    }, [list]);

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewParcelaEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createParcelaEmprestimo(formData)).unwrap();
      router.push(`/parcelas-emprestimos/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar parcelaEmprestimo:', error);
    }
  };

  const handleSubmitEditParcelaEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateParcelaEmprestimo({ id: formData.id, data: formData })).unwrap();
      router.push(`/parcelas-emprestimos/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar parcelaEmprestimo:', error);
    }
  };

  const clearParcelaEmprestimoError = () => {
    dispatch({ type: 'parcelasEmprestimos/clearError' });
  };

  return {
    formData,
    emprestimoOptions,
    setFormData,
    handleChange,
    handleSubmitNewParcelaEmprestimo,
    handleSubmitEditParcelaEmprestimo,
    clearParcelaEmprestimoError
  };
};

export default useParcelaEmprestimo;