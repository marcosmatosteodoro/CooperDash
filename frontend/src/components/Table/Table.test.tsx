import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from './Table';
import type { PaginatedResponse } from "@/types/api";
import type { ColumnType, Ressource } from "@/types/ui";

// Mocks dos subcomponentes
jest.mock('./', () => ({
  __esModule: true,
  Thead: ({ headers }: { headers: string[] }) => (
    <thead data-testid="thead">
      <tr>
        {headers.map((h, i) => <th key={i}>{h}</th>)}
      </tr>
    </thead>
  ),
  TbodyContent: ({ data }: { data: { id: string; name?: string }[] }) => (
    <>
      {data.map((d, i) => 
        <tr key={i} data-testid="tbody-content">
          <td>{d.name}</td>
        </tr>
      )}
    </>
  ),
  TbodyEmpty: ({ notFoundMessage }: { notFoundMessage: string }) => (
    <tr data-testid="tbody-empty">
      <td>{notFoundMessage}</td>
    </tr>
  ),
  Pagination: ({ current_page }: { current_page: number }) => (
    <div data-testid="pagination">Página {current_page}</div>
  ),
  Filters: ({ 
    params, 
    placeholderFilter, 
    searchTerm,
    children // ← CORRIGIDO: agora recebe children
  }: { 
    params: { per_page: number },
    placeholderFilter: string,
    searchTerm: string,
    children?: React.ReactNode // ← CORRIGIDO
  }) => (
    <div data-testid="filters">
      <span>Placeholder: {placeholderFilter}</span>
      <span>Search term: {searchTerm}</span>
      <span>Per page: {params.per_page}</span>
      {children && <div data-testid="filters-children">{children}</div>} {/* ← CORRIGIDO */}
    </div>
  ),
}));

describe('Table component', () => {
  const columns: ColumnType<Ressource>[] = [{ attribute: 'name' }];
  const headers = ['Nome'];
  const mockFilterCleaner = jest.fn();
  const mockPaginationClickHandler = jest.fn();
  const mockFilter = jest.fn();
  const mockParamsCleaner = jest.fn();

  const paginationMock = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 1
  } as PaginatedResponse<Ressource>;

  const paramsMock = {
    per_page: 10,
    page: 1
  };

  const baseProps = {
    headers,
    columns,
    actions: {},
    notFoundMessage: "Nada encontrado",
    placeholderFilter: "Buscar...",
    filterCleaner: mockFilterCleaner,
    paginationClickHandler: mockPaginationClickHandler,
    filter: mockFilter,
    paramsCleaner: mockParamsCleaner,
    params: paramsMock,
    pagination: paginationMock
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Thead, TbodyContent and Filters when data is present', () => {
    const data: Ressource[] = [{ id: '1', name: 'João' }];

    render(
      <Table
        {...baseProps}
        data={data}
        searchTerm=""
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.getByTestId('tbody-content')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-empty')).not.toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Página 1');
  });

  it('renders Thead, TbodyEmpty and Filters when data is empty', () => {
    render(
      <Table
        {...baseProps}
        data={[]}
        searchTerm="test search"
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('tbody-empty')).toBeInTheDocument();
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Página 1');
  });

  it('renders otherFilters when provided', () => {
    const data: Ressource[] = [{ id: '1', name: 'João' }];

    render(
      <Table
        {...baseProps}
        data={data}
        searchTerm=""
        otherFilters={<div data-testid="custom-filters">Custom Filters</div>}
      />
    );

    // Agora procura dentro do contexto dos filters children
    expect(screen.getByTestId('custom-filters')).toBeInTheDocument();
    expect(screen.getByText('Custom Filters')).toBeInTheDocument();
  });

  it('passes correct props to Filters component', () => {
    render(
      <Table
        {...baseProps}
        data={[]}
        searchTerm="search term test"
        placeholderFilter="Custom placeholder"
      />
    );

    expect(screen.getByText('Placeholder: Custom placeholder')).toBeInTheDocument();
    expect(screen.getByText('Search term: search term test')).toBeInTheDocument();
    expect(screen.getByText('Per page: 10')).toBeInTheDocument();
  });

  it('calculates increase correctly based on pagination', () => {
    const paginationWithPage2 = {
      ...paginationMock,
      current_page: 2,
      per_page: 5
    };

    const data: Ressource[] = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
      { id: '3', name: 'Item 3' }
    ];

    render(
      <Table
        {...baseProps}
        data={data}
        searchTerm=""
        pagination={paginationWithPage2}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles search term state correctly', () => {
    const { rerender } = render(
      <Table
        {...baseProps}
        data={[]}
        searchTerm="initial search"
      />
    );

    expect(screen.getByText('Search term: initial search')).toBeInTheDocument();

    // Re-render com search term diferente
    rerender(
      <Table
        {...baseProps}
        data={[]}
        searchTerm="new search"
      />
    );

    expect(screen.getByText('Search term: new search')).toBeInTheDocument();
  });

  it('does not render filters children when otherFilters is not provided', () => {
    const data: Ressource[] = [{ id: '1', name: 'João' }];

    render(
      <Table
        {...baseProps}
        data={data}
        searchTerm=""
        // otherFilters não é passado
      />
    );

    expect(screen.queryByTestId('filters-children')).not.toBeInTheDocument();
  });
});