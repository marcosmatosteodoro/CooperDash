import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TbodyContent } from './TbodyContent';
import { ColumnType, Ressource } from '../types';

// Mock do Td
jest.mock('../', () => ({
  Td: ({ column, ressource }: { column: ColumnType, ressource: Ressource }) => (
    <td>{ressource[column.attribute]}</td>
  )
}));

describe('TbodyContent component', () => {
  const columns: ColumnType[] = [
    { attribute: 'name' },
    { attribute: 'email' }
  ];

  const data: Ressource[] = [
    { id: '1', name: 'João', email: 'joao@example.com' },
    { id: '2', name: 'Maria', email: 'maria@example.com' }
  ];

  it('renders a row for each data entry including index column', () => {
    render(<table><tbody><TbodyContent columns={columns} data={data} actions={{}} /></tbody></table>);

    // Verifica se os nomes e e-mails estão na tela
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();

    // Verifica os índices
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the edit button with correct href when edit action is provided', () => {
    const actions = {
      edit: {
        href: (ressource: Ressource) => `/edit/${ressource.id}`
      }
    };

    render(<table><tbody><TbodyContent columns={columns} data={data} actions={actions} /></tbody></table>);

    const links = screen.getAllByRole('link', { name: /editar/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/edit/1');
    expect(links[1]).toHaveAttribute('href', '/edit/2');
  });

  it('renders the delete button and triggers callback on click', () => {
    const mockDelete = jest.fn();

    const actions = {
      delete: {
        onClick: mockDelete
      }
    };

    render(<table><tbody><TbodyContent columns={columns} data={data} actions={actions} /></tbody></table>);

    const buttons = screen.getAllByRole('button', { name: /excluir/i });
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    expect(mockDelete).toHaveBeenCalledWith(data[0]);

    fireEvent.click(buttons[1]);
    expect(mockDelete).toHaveBeenCalledWith(data[1]);
  });
});
