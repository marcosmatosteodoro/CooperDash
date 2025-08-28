import React, { useEffect, useState } from 'react';
import type { FieldChangeEvent, Option } from '@/types/ui/'
import type { Endereco } from '@/types/app/endereco'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation'; 
import { createEndereco, updateEndereco } from '@/store/slices/enderecosSlice';
import { fetchCooperados } from '@/store/slices/cooperadosSlice';

const useEnderecoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list } = useSelector((state: RootState) => state.cooperados);
  const router = useRouter();

  const [formData, setFormData] = useState<Endereco>({
    id: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    tipo: 'RESIDENCIAL',
    principal: false,
    cooperado_id: ''
  });
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

  const handleCheckboxChange = (e: FieldChangeEvent) => {
    const { name } = e.target;
    let checked = false;
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === 'checkbox'
    ) {
      checked = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmitNewEndereco = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        cep: formData.cep.replaceAll('.', '').replaceAll('-', ''),
      }
      const action = await dispatch(createEndereco(data)).unwrap();
      router.push(`/enderecos/${action.id}`);
    } catch (error) {
      console.error('Erro ao salvar endereco:', error);
    }
  };

  const handleSubmitEditEndereco = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(!formData.id){
        throw new Error("Id not found");
      }

      await dispatch(updateEndereco({ id: formData.id, data: formData })).unwrap();
      router.push(`/enderecos/${formData.id}`);
    } catch (error) {
      console.error('Erro ao editar endereco:', error);
    }
  };

  const clearEnderecoError = () => {
    dispatch({ type: 'enderecos/clearError' });
  };

  return {
    formData,
    CooperadoOptions,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleSubmitNewEndereco,
    handleSubmitEditEndereco,
    clearEnderecoError
  };
};

export default useEnderecoForm;