'use client'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { createCooperado, updateCooperado, fetchCooperado } from '@/store/slices/cooperadosSlice';
import { useLayout } from '@/providers/LayoutProvider'
import useFormatters from '@/hooks/useFormatters';
import { countryCodes } from '@/data/countryCodes';
import LoadingSpinner from '@/components/LoadingSpinner';
import NotFoundPage from '@/components/NotFoundPage';
import { texto } from '@/data/texts';

export default function NovoCooperador() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { current, status, error, fieldErrors } = useSelector(state => state.cooperados);
  const { setLayoutData } = useLayout();
  const { formatDocument } = useFormatters();
  
  const isEdit = false;
  const [formData, setFormData] = useState({
    nome: '',
    tipo_pessoa: 'FISICA',
    documento: '',
    data: '',
    valor: '',
    codigo_pais: '+55',
    telefone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchCooperado(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current) {
      setFormData(current);
    }
  }, [isEdit, current]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }, 
        ...(isEdit ? [
          { path: `/cooperados/${id}`, label: current?.nome || 'Detalhes' },
          { path: `/cooperados/${id}/editar`, label: 'Edição' }
        ] : [])
      ],
      title: isEdit ? 'Editar Cooperado' : 'Novo Cooperado',
      icon: isEdit ? 'bi-pencil-square' : 'bi-person-plus',
      buttons: (
        <Link className="btn btn-outline-secondary" href={isEdit ? `/cooperados/${id}` : '/cooperados'}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, [setLayoutData, current, id, isEdit]);

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validação de CPF/CNPJ
    if (formData.tipo_pessoa === 'FISICA' && !validateCPF(formData.documento)) {
      newErrors.documento = 'CPF inválido';
    } else if (formData.tipo_pessoa === 'JURIDICA' && !validateCNPJ(formData.documento)) {
      newErrors.documento = 'CNPJ inválido';
    }

    // Validação de data
    if (formData.data && new Date(formData.data) > today) {
      newErrors.data = 'Data não pode ser maior que hoje';
    }

    // Validação de valor
    if (formData.valor < 0) {
      newErrors.valor = 'Valor não pode ser negativo';
    }

    // Validação de telefone
    if (formData.telefone && (formData.telefone.length < 8 || formData.telefone.length > 15)) {
      newErrors.telefone = 'Telefone deve ter entre 8 e 15 dígitos';
    }

    // Validação de email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCPF = (cpf) => {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos e não é uma sequência repetida
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };

  const validateCNPJ = (cnpj) => {
    if (!cnpj) return false;
    cnpj = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos e não é uma sequência repetida
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validação dos dígitos verificadores
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    // TODO Garantir que o valor tenha duas casas decimais
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEdit) {
        await dispatch(updateCooperado({ id, data: formData })).unwrap();
        router.push(`/cooperados/${id}`);
      } else {
        const action = await dispatch(createCooperado(formData)).unwrap();
        router.push(`/cooperados/${action.id}`);
      }
    } catch (error) {
    }
  };

  // if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (isEdit && !current ) return <NotFoundPage message="Cooperado não encontrado" />;
  
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Nome */}
            <div className="col-md-6">
              <label className="form-label">{texto[formData.tipo_pessoa].nome}</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">
                {[...(fieldErrors?.nome || []), ...(errors.nome ? [errors.nome] : [])].map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>

            {/* Tipo Pessoa */}
            <div className="col-md-6">
              <label className="form-label">Tipo</label>
              <select
                className={`form-control ${fieldErrors?.nome ? 'is-invalid' : ''}`}
                name="tipo_pessoa"
                value={formData.tipo_pessoa}
                onChange={handleChange}
                required
              >
                <option value="FISICA">Pessoa Física</option>
                <option value="JURIDICA">Pessoa Jurídica</option>
              </select>
            </div>

            {/* Documento */}
            <div className="col-md-6">
              <label className="form-label">
                {texto[formData.tipo_pessoa].documento}
              </label>
              <input
                type="text"
                className={`form-control ${(errors.documento ||  fieldErrors?.documento) ? 'is-invalid' : ''}`}
                name="documento"
                value={formatDocument(formData.documento, formData.tipo_pessoa)}
                onChange={handleDocumentChange}
                required
                maxLength={formData.tipo_pessoa === 'FISICA' ? 14 : 18}
                placeholder={formData.tipo_pessoa === 'FISICA' ? 'xxx.xxx.xxx-xx' : 'xx.xxx.xxx/xxxx-xx'}
              />
              <div className="invalid-feedback">
                {[...(fieldErrors?.documento || []), ...(errors.documento ? [errors.documento] : [])].map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>

            {/* Data */}
            <div className="col-md-6">
              <label className="form-label">{texto[formData.tipo_pessoa].data}</label>
              <input
                type="date"
                className={`form-control ${(errors.data || fieldErrors?.data) ? 'is-invalid' : ''}`}
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              <div className="invalid-feedback">
                {[...(fieldErrors?.data || []), ...(errors.data ? [errors.data] : [])].map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>

            {/* Valor */}
            <div className="col-md-6">
              <label className="form-label">{texto[formData.tipo_pessoa].valor}</label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  type="number"
                  className={`form-control ${(errors.valor || fieldErrors?.valor) ? 'is-invalid' : ''}`}
                  name="valor"
                  value={formData.valor}
                  onChange={handleValueChange}
                  required
                  min="0"
                  step="0.01"
                />
                <div className="invalid-feedback">
                  {[...(fieldErrors?.valor || []), ...(errors.valor ? [errors.valor] : [])].map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Telefone */}
            <div className="col-md-6">
              <label className="form-label">Telefone</label>
              <div className="input-group d-flex flex-nowrap">
                <select
                  className="form-select w-auto"
                  name="codigo_pais"
                  value={formData.codigo_pais}
                  onChange={handleChange}
                  required
                >
                  {countryCodes.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  className={`form-control w-75 ${(errors.telefone || fieldErrors?.telefone || fieldErrors?.codigo_pais) ? 'is-invalid' : ''}`}
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder='XXXXXXX-XXXX'
                  required
                  minLength="8"
                  maxLength="15"
                />
                <div className="invalid-feedback">
                  {[...(fieldErrors?.telefone || []), ...(fieldErrors?.codigo_pais || []), ...(errors.telefone ? [errors.telefone] : [])].map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${(errors.email || fieldErrors?.telefone) ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                placeholder="nome@email.com"
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                {[...(fieldErrors?.email || []), ...(errors.email ? [errors.email] : [])].map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => navigate(isEdit ? `/cooperados/${id}` : '/cooperados')}
              >
                <i className="bi bi-x-lg me-2"></i>Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-lg me-2"></i>Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}