import React, { useCallback, useEffect, useState } from 'react';
import type { Field, FieldChangeEvent } from '@/types/ui/'
import type { ParcelaEmprestimo } from '@/types/app/parcelaEmprestimo'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createParcelaEmprestimo, fetchParcelaEmprestimo, fetchParcelasEmprestimos, updateParcelaEmprestimo } from '@/store/slices/parcelasEmprestimosSlice';
import useEmprestimo from './useEmprestimo';
import { PaginationParams } from '@/types/api';

const useParcelaEmprestimo = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const parcelasEmprestimos = useSelector((state: RootState) => state.parcelasEmprestimos);
  const { emprestimoOptions, getEmprestimoOptions } = useEmprestimo();
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
  
  const getFieldsProps = useCallback((): Field[] => {
    if(!emprestimoOptions || emprestimoOptions.length == 0) {
      getEmprestimoOptions()
    }

    return [
      {
        label: 'Número da parcela',
        type: 'number',
        tag: 'input',
        name: 'numero_parcela',
        value: formData.numero_parcela,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Valor da parcela',
        type: 'number',
        tag: 'input',
        name: 'valor_parcela',
        value: formData.valor_parcela,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Emprestimo',
        type: 'text',
        tag: 'select',
        name: 'emprestimo_id',
        contentClassName: 'col-md-6 col-lg-4',
        value: formData.emprestimo_id,
        onChange: handleChange,
        options: emprestimoOptions
      },
      {
        label: 'Data de Vencimento',
        type: 'date',
        tag: 'input',
        name: 'data_vencimento',
        value: formData.data_vencimento,
        contentClassName: 'col-md-6 col-lg-4',
        onChange: handleChange
      },
      {
        label: 'Data de Pagamento',
        type: 'date',
        tag: 'input',
        name: 'data_pagamento',
        value: formData.data_pagamento,
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
            value: "PENDENTE",
            text: "Pendente"
          },
          {
            value: "PAGO",
            text: "Pago"
          },
          {
            value: "ATRASADO",
            text: "Atrasado"
          },
          {
            value: "CANCELADO",
            text: "Cancelado"
          },
        ]
      },
      {
        label: 'Dias de atraso',
        type: 'number',
        tag: 'input',
        name: 'dias_atraso',
        value: formData.dias_atraso,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Valor pago',
        type: 'number',
        tag: 'input',
        name: 'valor_pago',
        value: formData.valor_pago,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Multa',
        type: 'number',
        tag: 'input',
        name: 'multa',
        value: formData.multa,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
      {
        label: 'Júros',
        type: 'number',
        tag: 'input',
        name: 'juros',
        value: formData.juros,
        contentClassName: 'col-md-6',
        onChange: handleChange
      },
    ]
  }, [formData, emprestimoOptions, getEmprestimoOptions]);

  const getParcelaEmprestimo = useCallback((id: string) => {
    dispatch(fetchParcelaEmprestimo(id as string));
  }, [dispatch]);

  const getParcelasEmprestimos = useCallback((params: PaginationParams) => {
    dispatch(fetchParcelasEmprestimos(params));
  }, [dispatch]);

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

  useEffect(() => {
    if (parcelasEmprestimos.current) {
      setFormData(parcelasEmprestimos.current);
    }
  }, [parcelasEmprestimos, setFormData]);

  return {
    parcelasEmprestimos,
    formData,
    setFormData,
    handleChange,
    handleSubmitNewParcelaEmprestimo,
    handleSubmitEditParcelaEmprestimo,
    clearParcelaEmprestimoError,
    getParcelaEmprestimo,
    getParcelasEmprestimos,
    getFieldsProps
  };
};

export default useParcelaEmprestimo;