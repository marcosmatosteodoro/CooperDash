'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchTransacoes, deleteTransacao, } from '@/store/slices/transacoesSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Transacao, TransacaoFilters } from '@/types/app/transacao';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function Transacoes() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.transacoes);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<TransacaoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'transacao',
      deleteAction: (id: string) => deleteTransacao(id), 
    });
  const { formatCurrency, formatTextToCapitalized, formatDate } = useFormatters();

  useEffect(() => {
      dispatch(fetchTransacoes(params));
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
        { path: '/transacoes', label: 'Transações' }
      ],
      title: 'Lista de Transações',
      buttons: (
        <Link className="btn btn-primary" href="/transacoes/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Transação
        </Link>
      )
    }));
  }, [setLayoutData]);


  const tableHeader = [
    "Valor",
    "Tipo",
    "Saldo Anterior",
    "Saldo Posterior",
    "Data da Transação",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<Transacao>[] = [
    {
      attribute: 'valor', 
      className: 'text-start', 
      type: 'link', 
      formatter: (ressource: Transacao) => formatCurrency(ressource.valor),
      href: (ressource: Transacao) => `/transacoes/${ressource.id}`
    },
    {
      attribute: 'tipo',
      formatter: (ressource: Transacao) => formatTextToCapitalized(ressource.tipo)
    },
    {
      attribute: 'saldo_anterior',
      formatter: (ressource: Transacao) => formatCurrency(ressource.saldo_anterior)
    },
    {
      attribute: 'saldo_posterior',
      formatter: (ressource: Transacao) => formatCurrency(ressource.saldo_posterior)
    },
    {
      attribute: 'data_transacao',
      formatter: (ressource: Transacao) => formatDate(ressource.data_transacao)
    },
  ]

  const tableActions: ActionsType<Transacao> = {
    edit: {
      href: (ressource: Transacao) => `/transacoes/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Transacao) => handleDelete(ressource.id)
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
                placeholder="Buscar transacoes..."
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