import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TbodyContent } from './TbodyContent';
import { ColumnType, Ressource } from '../types';

// Mock do Td para simplificar
jest.mock('../', () => ({
  Td: ({ column, ressource }: { column: ColumnType<Ressource>, ressource: Ressource }) => (
    <td>{ressource[column.attribute]}</td>
  )
}));

describe('TbodyContent component', () => {
  const columns: ColumnType<Ressource>[] = [
    { attribute: 'name' },
    { attribute: 'email' }
  ];

  const data: Ressource[] = [
    { id: '1', name: 'João', email: 'joao@example.com' },
    { id: '2', name: 'Maria', email: 'maria@example.com' }
  ];

  it('renders a row for each data entry including index column with increase', () => {
    render(
      <table>
        <tbody>
          <TbodyContent 
            columns={columns} 
            data={data} 
            actions={{}} 
            increase={5} // aqui definimos o increase
          />
        </tbody>
      </table>
    );

    // Verifica se os nomes e e-mails estão na tela
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();

    // Verifica os índices com o increase aplicado
    expect(screen.getByText('6')).toBeInTheDocument(); // 5 + 0 + 1
    expect(screen.getByText('7')).toBeInTheDocument(); // 5 + 1 + 1
  });

  it('renders the edit button with correct href when edit action is provided', () => {
    const actions = {
      edit: {
        href: (ressource: Ressource) => `/edit/${ressource.id}`
      }
    };

    render(
      <table>
        <tbody>
          <TbodyContent 
            columns={columns} 
            data={data} 
            actions={actions} 
            increase={0}
          />
        </tbody>
      </table>
    );

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

    render(
      <table>
        <tbody>
          <TbodyContent 
            columns={columns} 
            data={data} 
            actions={actions} 
            increase={0}
          />
        </tbody>
      </table>
    );

    const buttons = screen.getAllByRole('button', { name: /excluir/i });
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    expect(mockDelete).toHaveBeenCalledWith(data[0]);

    fireEvent.click(buttons[1]);
    expect(mockDelete).toHaveBeenCalledWith(data[1]);
  });
});
