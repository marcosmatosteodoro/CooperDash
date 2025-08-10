'use client'

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchCooperados, deleteCooperado, } from '@/store/slices/cooperadosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { texto } from '@/data/textos';
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert, TableInterface } from '@/components'
import { Cooperado, TipoPessoa } from '@/types/cooperado';

type FilterType = 'TODOS' | TipoPessoa;

export default function Cooperadores() {
  const dispatch: AppDispatch = useDispatch();
  const { list, status, error } = useSelector((state: RootState) => state.cooperados);
  const { setLayoutData } = useLayout();
  const [filter, setFilter] = useState<FilterType>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const handleDelete = useDeleteWithConfirmation({
      entityName: 'cooperado',
      deleteAction: (id: string) => deleteCooperado(id), 
    });
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCooperados());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }
      ],
      title: 'Lista de Cooperados',
      buttons: (
        <Link className="btn btn-primary" href="/cooperados/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Cooperado
        </Link>
      )
    }));
  }, [setLayoutData]);


  useEffect(() => {
    const header = filter === 'TODOS' 
      ? ['Nome', 'Tipo', 'Documento', 'Data', 'Valor', 'Telefone', 'Email']
      : [
          texto[filter].nome,
          'Tipo',
          texto[filter].documento,
          texto[filter].data,
          texto[filter].valor,
          'Telefone',
          'Email',
        ];
    setTableHeader(header);
  }, [filter]);
  
  // Filtrar e buscar cooperados
  const filteredList = useMemo(() => {
    return list.filter((cooperado: Cooperado) => {
      const typeMatch = 
        filter === 'TODOS' || 
        (filter === 'FISICA' && cooperado.tipo_pessoa === 'FISICA') || 
        (filter === 'JURIDICA' && cooperado.tipo_pessoa === 'JURIDICA');
      
      const searchMatch = searchTerm === '' || 
        Object.values(cooperado).some(
          value => value && 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return typeMatch && searchMatch;
    });
  }, [list, filter, searchTerm]);
  
  const tableProps: TableInterface<Cooperado> = {
    headers: tableHeader,
    columns: [
      {
        attribute: 'nome', 
        className: 'text-start', 
        type: 'link' as const, 
        href: (ressource: Cooperado) => `/cooperados/${ressource.id}`
      },
      {
        attribute: 'tipo_pessoa', 
        formatter: (ressource: Cooperado) => 
          ressource.tipo_pessoa === 'FISICA' ? 'Física' : 'Jurídica'
      },
      {
        attribute: 'documento', 
        formatter: (ressource: Cooperado) => 
          formatDocument(ressource.documento, ressource.tipo_pessoa)
      },
      {
        attribute: 'data', 
        formatter: (ressource: Cooperado) => formatDate(ressource.data)
      },
      {
        attribute: 'valor', 
        formatter: (ressource: Cooperado) => formatCurrency(ressource.valor)
      },
      {
        attribute: 'telefone', 
        formatter: (ressource: Cooperado) => 
          `${ressource.codigo_pais} ${ressource.telefone}`
      },
      {
        attribute: 'email', 
        className: 'text-truncate', 
        style: { maxWidth: '150px' }, 
        type: 'link' as const, 
        href: (ressource: Cooperado) => `mailto:${ressource.email}`
      },
    ],
    data: filteredList,
    actions: {
      edit: {
        href: (ressource: Cooperado) => `/cooperados/${ressource.id}/editar`,
      },
      delete: {
        onClick: (ressource: Cooperado) => handleDelete(ressource.id)
      },
    },
    notFoundMessage: 'Nenhum cooperado encontrado',
    searchTerm: !!searchTerm,
    filterCleaner: () => setSearchTerm('')
  }

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      {/* Filtros e Busca */}
      <section className="mb-4">
        <div className="row align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar cooperados..."
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {(['TODOS', 'FISICA', 'JURIDICA'] as FilterType[]).map((filterType) => (
                <div key={filterType} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter"
                    id={`filter-${filterType.toLowerCase()}`}
                    checked={filter === filterType}
                    onChange={() => setFilter(filterType)}
                  />
                  <label className="form-check-label" htmlFor={`filter-${filterType.toLowerCase()}`}>
                    {filterType === 'TODOS' ? 'Todos' : filterType === 'FISICA' ? 'Físicas' : 'Jurídicas'}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabela */}
      <Table {...tableProps} />
    </>
  );
}