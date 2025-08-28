'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchParcelasEmprestimos, deleteParcelaEmprestimo, } from '@/store/slices/parcelasEmprestimosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { ParcelaEmprestimo, ParcelaEmprestimoFilters } from '@/types/app/parcelaEmprestimo';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function ParcelasEmprestimos() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.parcelasEmprestimos);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<ParcelaEmprestimoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'parcelaEmprestimo',
      deleteAction: (id: string) => deleteParcelaEmprestimo(id), 
    });
  const { formatDate, formatCurrency, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
      dispatch(fetchParcelasEmprestimos(params));
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
        { path: '/parcelas-emprestimos', label: 'Parcelas de emprestimos' }
      ],
      title: 'Lista de Parcelas de emprestimos',
      buttons: (
        <Link className="btn btn-primary" href="/parcelas-emprestimos/novo">
          <i className="bi bi-plus-circle me-2"></i>Nova Parcela de Emprestimo
        </Link>
      )
    }));
  }, [setLayoutData]);


  const tableHeader = [
    "Número da Parcela",
    "Valor da Parcela",
    "Data de Vencimento",
    "Status",
    "Valor Pago",
    "Dias de Atraso",
    "Multa",
    "Juros",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<ParcelaEmprestimo>[] = [
    {
      attribute: 'numero_parcela', 
      className: 'text-start', 
      type: 'link' as const, 
      href: (ressource: ParcelaEmprestimo) => `/parcelas-emprestimos/${ressource.id}`
    },
    {
      attribute: 'valor_parcela',
      formatter: (ressource: ParcelaEmprestimo) => formatCurrency(ressource.valor_parcela)
    },
    {
      attribute: 'data_vencimento',
      formatter: (ressource: ParcelaEmprestimo) => formatDate(ressource.data_vencimento)
    },
    {
      attribute: 'status', 
      formatter: (ressource: ParcelaEmprestimo) => formatTextToCapitalized(ressource.status)
    },
    {
      attribute: 'valor_pago',
      formatter: (ressource: ParcelaEmprestimo) => formatCurrency(ressource.valor_pago)
    },
    {
      attribute: 'dias_atraso', 
    },
    {
      attribute: 'multa', 
      formatter: (ressource: ParcelaEmprestimo) => formatCurrency(ressource.multa)
    },
    {
      attribute: 'juros', 
      formatter: (ressource: ParcelaEmprestimo) => formatCurrency(ressource.juros)
    },
  ]

  const tableActions: ActionsType<ParcelaEmprestimo> = {
    edit: {
      href: (ressource: ParcelaEmprestimo) => `/parcelas-emprestimos/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: ParcelaEmprestimo) => handleDelete(ressource.id)
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
                placeholder="Buscar parcelas..."
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