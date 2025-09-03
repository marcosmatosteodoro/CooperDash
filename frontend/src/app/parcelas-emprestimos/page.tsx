'use client'

import { useEffect, useState } from 'react';
import { deleteParcelaEmprestimo, } from '@/store/slices/parcelasEmprestimosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { ParcelaEmprestimo, ParcelaEmprestimoFilters } from '@/types/app/parcelaEmprestimo';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';
import useParcelaEmprestimo from '@/hooks/useParcelaEmprestimo';

export default function ParcelasEmprestimos() {
  const { parcelasEmprestimos, getParcelasEmprestimos } = useParcelaEmprestimo();
  const { list, pagination, status, error } = parcelasEmprestimos;
  const { setListLayout } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<ParcelaEmprestimoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'parcelaEmprestimo',
      deleteAction: (id: string) => deleteParcelaEmprestimo(id), 
    });
  const { formatDate, formatCurrency, formatTextToCapitalized } = useFormatters();

  useEffect(() => {
      getParcelasEmprestimos(params);
  }, [getParcelasEmprestimos, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;

    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);

  useEffect(() => {
    setListLayout({ path: '/parcelas-emprestimos', label: 'Parcelas de Empréstimos', buttonName: 'Lista de Parcelas de Empréstimos' });
  }, [setListLayout]);

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
    <Table
      params={params}
      headers={tableHeader}
      columns={tableColumns}
      data={list}
      pagination={pagination}
      actions={tableActions}
      notFoundMessage='Nenhuma parcela encontrada'
      placeholderFilter='Buscar parcelas de empréstimos...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      setParams={setParams}
    />
  );
}