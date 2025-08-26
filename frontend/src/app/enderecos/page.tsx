'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchEnderecos, deleteEndereco, } from '@/store/slices/enderecosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Endereco, EnderecoFilters, EnderecoTipo } from '@/types/app/endereco';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function Enderecos() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.enderecos);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<EnderecoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'endereco',
      deleteAction: (id: string) => deleteEndereco(id), 
    });
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
      dispatch(fetchEnderecos(params));
  }, [dispatch, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;

    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/enderecos', label: 'Endereços' }
      ],
      title: 'Lista de Endereços',
      buttons: (
        <Link className="btn btn-primary" href="/enderecos/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Endereço
        </Link>
      )
    }));
  }, [setLayoutData]);


  const tableHeader = [
    "Logradouro",
    "CEP",
    "Número",
    "Bairro",
    "Cidade",
    "Estado",
    "Tipo",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<Endereco>[] = [
    {
      attribute: 'logradouro', 
      className: 'text-start', 
      type: 'link' as const, 
      href: (ressource: Endereco) => `/enderecos/${ressource.id}`
    },
    {
      attribute: 'cep', 
    },
    {
      attribute: 'numero', 
    },
    {
      attribute: 'bairro', 
    },
    {
      attribute: 'cidade', 
    },
    {
      attribute: 'estado', 
    },
    {
      attribute: 'tipo', 
      formatter: (ressource: Endereco) => {
        const tipos: Record<EnderecoTipo, string> = {
          RESIDENCIAL: 'Residencial',
          COMERCIAL: 'Comercial',
          COBRANCA: 'Cobrança',
        }
        return tipos[ressource.tipo] || 'Desconhecido';
      }
    },
  ]

  const tableActions: ActionsType<Endereco> = {
    edit: {
      href: (ressource: Endereco) => `/enderecos/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Endereco) => handleDelete(ressource.id)
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
                placeholder="Buscar enderecos..."
                autoFocus
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
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
        notFoundMessage='Nenhum endereço encontrado'
        searchTerm={!!filters.searchTerm}
        filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
        paginationClickHandler={paginationClickHandler}
      />
    </>
  );
}