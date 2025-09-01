'use client'

import type { Cooperado, CooperadoFilters, TipoPessoaOptions } from '@/types/app/cooperado';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';
import { useEffect, useState } from 'react';
import { useLayout } from '@/providers/LayoutProvider'
import { deleteCooperado, } from '@/store/slices/cooperadosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import useCooperado from '@/hooks/useCooperado';
import { texto } from '@/data/textos';
import { Table, LoadingSpinner, ErrorAlert } from '@/components'

export default function Cooperadores() {
  const { setListLayout } = useLayout();
  const { cooperados, getCooperados } = useCooperado();
  const { list, pagination, status, error } = cooperados;
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<CooperadoFilters>({ searchTerm: '', tipoPessoa: 'TODOS' });
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const { formatDocument, formatDate, formatCurrency } = useFormatters();
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'cooperado',
      deleteAction: (id: string) => deleteCooperado(id), 
    });

  useEffect(() => {
    getCooperados(params);
  }, [getCooperados, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;
    const tipoPessoa = filters.tipoPessoa !== 'TODOS' ? filters.tipoPessoa : undefined;

    setParams(prev => ({ ...prev, page: 1, q, tipo_pessoa: tipoPessoa }));
  }, [filters.searchTerm, filters.tipoPessoa]);

  useEffect(() => {
    setListLayout({ path: '/cooperados', label: 'Cooperados', buttonName: 'Novo Cooperado' });
  }, [setListLayout]);


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

  const otherFilters = (
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
  );

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Table
      headers={tableHeader}
      columns={tableColumns}
      data={list}
      pagination={pagination}
      actions={tableActions}
      otherFilters={otherFilters}
      notFoundMessage='Nenhum cooperado encontrado'
      placeholderFilter='Buscar cooperados...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '', tipoPessoa: 'TODOS' })}
      params={params}
      setParams={setParams}
    />
  );
}