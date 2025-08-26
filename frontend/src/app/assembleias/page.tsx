'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function Assembleias() {
  const dispatch: AppDispatch = useDispatch();
  const { list, pagination, status, error } = useSelector((state: RootState) => state.assembleias);
  const { setLayoutData } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined, tipo_pessoa: undefined });
  const [filters, setFilters] = useState<AssembleiaFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'assembleia',
      deleteAction: (id: string) => deleteAssembleia(id), 
    });
  const { formatDateTime } = useFormatters();

  useEffect(() => {
      dispatch(fetchAssembleias(params));
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
        { path: '/assembleias', label: 'Assembleias' }
      ],
      title: 'Lista de Assembleias',
      buttons: (
        <Link className="btn btn-primary" href="/assembleias/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Assembleia
        </Link>
      )
    }));
  }, [setLayoutData]);

  const tableHeader = [
    "Título",
    "Tipo",
    "Status",
    "Pauta",
    "Quorum Mínimo",
    "Data e Hora",
  ]

  
  const paginationClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  }

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
                placeholder="Buscar assembleias..."
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