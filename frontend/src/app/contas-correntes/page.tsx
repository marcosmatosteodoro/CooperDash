'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchContasCorrentes, deleteContaCorrente, } from '@/store/slices/contasCorrentesSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { ContaCorrente, ContaCorrenteFilters } from '@/types/app/contaCorrente';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function ContasCorrentes() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.contasCorrentes);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<ContaCorrenteFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'contaCorrente',
      deleteAction: (id: string) => deleteContaCorrente(id), 
    });
  const { formatTextToCapitalized, formatDate } = useFormatters();

  useEffect(() => {
      dispatch(fetchContasCorrentes(params));
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
        { path: '/contas-correntes', label: 'Contas Correntes' }
      ],
      title: 'Lista de Contas Correntes',
      icon: '',
      buttons: (
        <Link className="btn btn-primary" href="/contas-correntes/novo">
          <i className="bi bi-plus-circle me-2"></i>Nova Conta Corrente
        </Link>
      )
    }));
  }, [setLayoutData]);


  const tableHeader = [
    "Número da conta",
    "Status",
    "Data de abertura",
    "Data de encerramento",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

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
      paginationClickHandler={paginationClickHandler}
    />
  );
}