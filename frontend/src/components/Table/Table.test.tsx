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
}));

describe('Table component', () => {
  const columns: ColumnType<Ressource>[] = [{ attribute: 'name' }];
  const headers = ['Nome'];
  const mockFilterCleaner = jest.fn();
  const mockPaginationClickHandler = jest.fn();

  const paginationMock = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 1
  } as PaginatedResponse<Ressource>;

  it('renders Thead and TbodyContent when data is present', () => {
    const data: Ressource[] = [{ id: '1', name: 'João' }];

    render(
      <Table
        headers={headers}
        columns={columns}
        data={data}
        actions={{}}
        notFoundMessage="Nada encontrado"
        searchTerm={false}
        filterCleaner={mockFilterCleaner}
        pagination={paginationMock}
        paginationClickHandler={mockPaginationClickHandler}
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.getByTestId('tbody-content')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-empty')).not.toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Página 1');
  });

  it('renders Thead and TbodyEmpty when data is empty', () => {
    render(
      <Table
        headers={headers}
        columns={columns}
        data={[]} // vazio
        actions={{}}
        notFoundMessage="Nada encontrado"
        searchTerm={true}
        filterCleaner={mockFilterCleaner}
        pagination={paginationMock}
        paginationClickHandler={mockPaginationClickHandler}
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('tbody-empty')).toBeInTheDocument();
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toHaveTextContent('Página 1');
  });
});
