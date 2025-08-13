'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchCooperados, deleteCooperado, } from '@/store/slices/cooperadosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { texto } from '@/data/textos';
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert, ColumnType, ActionsType } from '@/components'
import { Cooperado, CooperadoFilters, TipoPessoaOptions } from '@/types/cooperado';
import { PaginationParams } from '@/types/api';

export default function Cooperadores() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.cooperados);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<CooperadoFilters>({ searchTerm: '', tipoPessoa: 'TODOS' });
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'cooperado',
      deleteAction: (id: string) => deleteCooperado(id), 
    });
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
      dispatch(fetchCooperados(params));
  }, [dispatch, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;
    const tipoPessoa = filters.tipoPessoa !== 'TODOS' ? filters.tipoPessoa : undefined;

    setParams(prev => ({ ...prev, page: 1, q, tipo_pessoa: tipoPessoa }));
  }, [filters.searchTerm, filters.tipoPessoa]);

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
    const header = filters.tipoPessoa === 'TODOS' 
      ? ['Nome', 'Tipo', 'Documento', 'Data', 'Valor', 'Telefone', 'Email']
      : [
          texto[filters.tipoPessoa].nome,
          'Tipo',
          texto[filters.tipoPessoa].documento,
          texto[filters.tipoPessoa].data,
          texto[filters.tipoPessoa].valor,
          'Telefone',
          'Email',
        ];
    setTableHeader(header);
  }, [filters.tipoPessoa]);
  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<Cooperado>[] = [
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
  ]

  const tableActions: ActionsType<Cooperado> = {
    edit: {
      href: (ressource: Cooperado) => `/cooperados/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Cooperado) => handleDelete(ressource.id)
    },
  }

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      {/* Filtros e Busca */}
      <section className="mb-4">
        <div className="row align-items-center g-3">
          <div className="col-xl-3 col-md-4">
            <div className="input-group">
              {/* select de 5 10 20 50 100 */}
              <select 
                className="form-select" 
                value={params.per_page} 
                onChange={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
              >
                {[5, 10, 20, 50, 100].map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span className="input-group-text">por página</span>
            </div>
          </div>

          <div className="col-xl-9 col-md-8 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar cooperados..."
                autoFocus
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {(['TODOS', 'FISICA', 'JURIDICA'] as TipoPessoaOptions[]).map((filterType) => (
                <div key={filterType} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter"
                    id={`filter-${filterType.toLowerCase()}`}
                    checked={filters.tipoPessoa === filterType}
                    onChange={() => setFilters({ ...filters, tipoPessoa: filterType })}
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
      <Table 
        headers={tableHeader}
        columns={tableColumns}
        data={list}
        pagination={pagination}
        actions={tableActions}
        notFoundMessage='Nenhum cooperado encontrado'
        searchTerm={!!filters.searchTerm}
        filterCleaner={() => setFilters({ ...filters, searchTerm: '', tipoPessoa: 'TODOS' })}
        paginationClickHandler={paginationClickHandler}
      />
    </>
  );
}