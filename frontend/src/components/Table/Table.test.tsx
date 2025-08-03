import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from './Table';
import { ColumnType, Ressource } from './types';

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
  TbodyContent: ({ data }: { data: Ressource[] }) => (
    <>
      {data.map((d, i) => 
        <tr key={i} data-testid="tbody-content">
          <td>
            {d.name}
          </td>
        </tr>
      )}
    </>
  ),
  TbodyEmpty: ({ notFoundMessage }: { notFoundMessage: string }) => (
    <tr data-testid="tbody-empty">
      <td>
        {notFoundMessage}
      </td>
    </tr>
  )
}));

describe('Table component', () => {
  const columns: ColumnType[] = [{ attribute: 'name' }];
  const headers = ['Nome'];
  const mockFilterCleaner = jest.fn();

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
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.getByTestId('tbody-content')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-empty')).not.toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
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
      />
    );

    expect(screen.getByTestId('thead')).toBeInTheDocument();
    expect(screen.queryByTestId('tbody-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('tbody-empty')).toBeInTheDocument();
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument();
  });
});
