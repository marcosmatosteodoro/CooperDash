'use client'

import { useEffect, useState } from 'react';
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
  const { setListLayout } = useLayout();
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
    setListLayout({ path: '/emprestimos', label: 'Empréstimos', buttonName: 'Lista de Empréstimos' });
  }, [setListLayout]);


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
    <Table 
      params={params}
      headers={tableHeader}
      columns={tableColumns}
      data={list}
      pagination={pagination}
      actions={tableActions}
      notFoundMessage='Nenhum empréstimo encontrado'
      placeholderFilter='Buscar empréstimos...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      paginationClickHandler={paginationClickHandler}
    />
  );
}