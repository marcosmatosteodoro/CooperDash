'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, } from '@/store';
import { fetchAssembleias, deleteAssembleia, } from '@/store/slices/assembleiasSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Assembleia, AssembleiaFilters, StatusAssembleia } from '@/types/app/assembleia';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';
import useAssembleiaForm from '@/hooks/useAssembleiaForm';

export default function Assembleias() {
  const dispatch: AppDispatch = useDispatch();
  const { assembleias, getAssembleias } = useAssembleiaForm();
  const { list, pagination, status, error } = assembleias;
  const { setListLayout } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<AssembleiaFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'assembleia',
      deleteAction: (id: string) => deleteAssembleia(id), 
    });
  const { formatDateTime } = useFormatters();

  
  useEffect(() => {
    getAssembleias(params);
  }, [getAssembleias, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;
    
    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);
  
  useEffect(() => {
    setListLayout({ path: '/assembleias', label: 'Assembleias', buttonName: 'Lista de Assembleias' });
  }, [setListLayout]);

  const tableHeader = [
    "Título",
    "Tipo",
    "Status",
    "Pauta",
    "Quorum Mínimo",
    "Data e Hora",
  ]

  const tableColumns: ColumnType<Assembleia>[] = [
    {
      attribute: 'titulo', 
      className: 'text-start', 
      type: 'link' as const, 
      href: (ressource: Assembleia) => `/assembleias/${ressource.id}`
    },
    {
      attribute: 'tipo',
      formatter: (ressource: Assembleia) => ressource.tipo === 'ORDINARIA' ? 'Ordinária' : 'Extraordinária'
    },
    {
      attribute: 'status', 
      formatter: (ressource: Assembleia) => {
        const tipos: Record<StatusAssembleia, string> = {
          AGENDADA: 'Agendada',
          EM_ANDAMENTO: 'Em Andamento',
          CONCLUIDA: 'Concluída',
          CANCELADA: 'Cancelada',
        }
        return tipos[ressource.status] || 'Desconhecido';
      }
    },
    {
      attribute: 'pauta', 
    },
    {
      attribute: 'quorum_minimo', 
    },
    {
      attribute: 'data_hora', 
      formatter: (ressource: Assembleia) => formatDateTime(ressource.data_hora)
    },
  ]

  const tableActions: ActionsType<Assembleia> = {
    edit: {
      href: (ressource: Assembleia) => `/assembleias/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Assembleia) => handleDelete(ressource.id)
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
      notFoundMessage='Nenhum endereço encontrado'
      placeholderFilter='Buscar assembleias...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      setParams={setParams}
    />
  );
}