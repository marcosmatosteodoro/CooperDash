'use client'

import { useEffect, useState } from 'react';
import { deleteEndereco, } from '@/store/slices/enderecosSlice';
import useFormatters from '@/hooks/useFormatters';
import { useDeleteWithConfirmation } from '@/hooks/useDeleteWithConfirmation'
import { useLayout } from '@/providers/LayoutProvider'
import { Table, LoadingSpinner, ErrorAlert } from '@/components'
import type { Endereco, EnderecoFilters, EnderecoTipo } from '@/types/app/endereco';
import type { PaginationParams } from '@/types/api';
import type { ColumnType, ActionsType } from '@/types/ui';
import useEndereco from '@/hooks/useEndereco';

export default function Enderecos() {
  const { enderecos, getEnderecos } = useEndereco();
  const { list, pagination, status, error } = enderecos;
  const { setListLayout } = useLayout();
  const [params, setParams] = useState<PaginationParams>({ per_page: 20, page: 1, q: undefined });
  const [filters, setFilters] = useState<EnderecoFilters>({ searchTerm: '' });
  const { handleDelete } = useDeleteWithConfirmation({
      entityName: 'endereco',
      deleteAction: (id: string) => deleteEndereco(id), 
    });
  const { formatCep } = useFormatters();

  useEffect(() => {
    getEnderecos(params);
  }, [getEnderecos, params]);

  useEffect(() => {
    const q = filters.searchTerm.length > 0 ? filters.searchTerm : undefined;

    setParams(prev => ({ ...prev, page: 1, q }));
  }, [filters.searchTerm]);

  useEffect(() => {
    setListLayout({ path: '/enderecos', label: 'Endereços', buttonName: 'Lista de Endereços' });
  }, [setListLayout]);

  const tableHeader = [
    "Logradouro",
    "CEP",
    "Número",
    "Bairro",
    "Cidade",
    "Estado",
    "Tipo",
  ]

  const tableColumns: ColumnType<Endereco>[] = [
    {
      attribute: 'logradouro', 
      className: 'text-start', 
      type: 'link' as const, 
      href: (ressource: Endereco) => `/enderecos/${ressource.id}`
    },
    {
      attribute: 'cep',
      formatter: (ressource: Endereco) => formatCep(ressource.cep)
    },
    {
      attribute: 'numero', 
    },
    {
      attribute: 'bairro', 
    },
    {
      attribute: 'cidade', 
    },
    {
      attribute: 'estado', 
    },
    {
      attribute: 'tipo', 
      formatter: (ressource: Endereco) => {
        const tipos: Record<EnderecoTipo, string> = {
          RESIDENCIAL: 'Residencial',
          COMERCIAL: 'Comercial',
          COBRANCA: 'Cobrança',
        }
        return tipos[ressource.tipo] || 'Desconhecido';
      }
    },
  ]

  const tableActions: ActionsType<Endereco> = {
    edit: {
      href: (ressource: Endereco) => `/enderecos/${ressource.id}/editar`,
    },
    delete: {
      onClick: (ressource: Endereco) => handleDelete(ressource.id)
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
      placeholderFilter='Buscar endereços...'
      searchTerm={filters.searchTerm}
      paramsCleaner={(e) => setParams({ ...params, per_page: parseInt(e.target.value), page: 1 })}
      filter={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      filterCleaner={() => setFilters({ ...filters, searchTerm: '' })}
      setParams={setParams}
    />
  );
}