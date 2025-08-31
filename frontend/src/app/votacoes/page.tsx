'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchVotacoes, deleteVotacao, } from '@/store/slices/votacoesSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Votacao, VotacaoFilters } from '@/types/app/votacao';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';

export default function Votacoes() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.votacoes);
  const { setListLayout } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<VotacaoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'votacao',
      deleteAction: (id: string) => deleteVotacao(id), 
    });
  const { formatDate } = useFormatters();

  useEffect(() => {
      dispatch(fetchVotacoes(params));
  }, [dispatch, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;

    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);

  useEffect(() => {
    setListLayout({ path: '/votacoes', label: 'Votações', buttonName: 'Lista de Votações' });
  }, [setListLayout]);


  const tableHeader = [
    "ID do Cooperado",
    "Voto",
    "Data do Voto",
    "ID da Assembleia",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

  const tableColumns: ColumnType<Votacao>[] = [
    {
      attribute: 'cooperado_id', 
      className: 'text-start', 
      type: 'link' as const, 
      href: (ressource: Votacao) => `/votacoes/${ressource.id}`
    },
    {
      attribute: 'voto',
    },
    {
      attribute: 'data_voto', 
      formatter: (ressource: Votacao) => formatDate(ressource.data_voto)
    },
    {
      attribute: 'assembleia_id',
    },
  ]

  const tableActions: ActionsType<Votacao> = {
    edit: {
      href: (ressource: Votacao) => `/votacoes/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Votacao) => handleDelete(ressource.id)
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
      notFoundMessage='Nenhuma votação encontrada'
      placeholderFilter='Buscar votações...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      paginationClickHandler={paginationClickHandler}
      />
  );
}