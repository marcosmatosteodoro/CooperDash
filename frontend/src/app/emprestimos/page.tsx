'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchEmprestimos, deleteEmprestimo, } from '@/store/slices/emprestimosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Emprestimo, EmprestimoFilters } from '@/types/app/emprestimo';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function Emprestimos() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.emprestimos);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<EmprestimoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'emprestimo',
      deleteAction: (id: string) => deleteEmprestimo(id), 
    });
  const { formatCurrency, formatDate } = useFormatters();

  useEffect(() => {
      dispatch(fetchEmprestimos(params));
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
        { path: '/emprestimos', label: 'Emprestimos' }
      ],
      title: 'Lista de Emprestimos',
      icon: '',
      buttons: (
        <Link className="btn btn-primary" href="/emprestimos/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Emprestimo
        </Link>
      )
    }));
  }, [setLayoutData]);


  const tableHeader = [
    "Valor solicitado",
    "Parcelas",
    "Taxa de juros",
    "Status",
    "Data de solicitaçao",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<Emprestimo>[] = [
    {
      attribute: 'valor_solicitado', 
      type: 'link' as const, 
      href: (ressource: Emprestimo) => `/emprestimos/${ressource.id}`,
      formatter: (ressource: Emprestimo) => formatCurrency(ressource.valor_solicitado)
    },
    {
      attribute: 'parcelas',
    },
    {
      attribute: 'taxa_juros', 
    },
    {
      attribute: 'status', 
      formatter: (ressource: Emprestimo) => {
        const status = {
          ANALISE: 'Análise',
          APROVADO: 'Aprovado',
          REPROVADO: 'Reprovado',
          LIQUIDADO: 'Líquidado',
          CANCELADO: 'Cancelado',
        }

        return status[ressource.status]
      }
    },
    {
      attribute: 'data_solicitacao', 
      formatter: (ressource: Emprestimo) => formatDate(ressource.data_solicitacao)
    },
  ]

  const tableActions: ActionsType<Emprestimo> = {
    edit: {
      href: (ressource: Emprestimo) => `/emprestimos/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Emprestimo) => handleDelete(ressource.id)
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
                placeholder="Buscar emprestimos..."
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