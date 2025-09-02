'use client'

import { useEffect, useState } from 'react';
import { deleteContaCorrente, } from '@/store/slices/contasCorrentesSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { ContaCorrente, ContaCorrenteFilters } from '@/types/app/contaCorrente';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';
import useContaCorrente from '@/hooks/useContaCorrente';

export default function ContasCorrentes() {
  const { contasCorrentes, getContasCorrentes } = useContaCorrente();
  const { list, pagination, status, error } = contasCorrentes;
  const { setListLayout } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<ContaCorrenteFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'contaCorrente',
      deleteAction: (id: string) => deleteContaCorrente(id), 
    });
  const { formatTextToCapitalized, formatDate } = useFormatters();

  useEffect(() => {
    getContasCorrentes(params);
  }, [getContasCorrentes, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;

    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);

  useEffect(() => {
    setListLayout({ path: '/contas-correntes', label: 'Contas Correntes', buttonName: 'Lista de Contas' });
  }, [setListLayout]);


  const tableHeader = [
    "Número da conta",
    "Status",
    "Data de abertura",
    "Data de encerramento",
  ]

  const tableColumns: ColumnType<ContaCorrente>[] = [
    {
      attribute: 'numero_conta',
      className: 'text-start',
      type: 'link' as const,
      href: (ressource: ContaCorrente) => `/contas-correntes/${ressource.id}`
    },
    {
      attribute: 'status',
      formatter: (ressource: ContaCorrente) => formatTextToCapitalized(ressource.status)
    },
    {
      attribute: 'data_abertura',
      formatter: (ressource: ContaCorrente) => formatDate(ressource.data_abertura)
    },
    {
      attribute: 'data_encerramento',
      formatter: (ressource: ContaCorrente) => ressource.data_encerramento ? formatDate(ressource.data_encerramento) : 'Não encerrada'
    },
  ]

  const tableActions: ActionsType<ContaCorrente> = {
    edit: {
      href: (ressource: ContaCorrente) => `/contas-correntes/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: ContaCorrente) => handleDelete(ressource.id)
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
      notFoundMessage='Nenhuma conta encontrada'
      placeholderFilter='Buscar contas...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      setParams={setParams}
    />
  );
}