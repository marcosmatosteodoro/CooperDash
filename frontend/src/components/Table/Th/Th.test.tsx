import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Th } from './'

describe('Th Component in Table Context', () => {
  const testHeader = 'Test Header';
  const testClassName = 'test-class';

  const renderThInTable = () => {
    return render(
      <table>
        <thead>
          <tr>
            <Th header={testHeader} className={testClassName} />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test cell</td>
          </tr>
        </tbody>
      </table>
    );
  };

  it('renderiza corretamente dentro de uma estrutura de tabela', () => {
    renderThInTable();
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
  });

  it('exibe o texto do cabeçalho correto no contexto da tabela', () => {
    renderThInTable();
    expect(screen.getByText(testHeader)).toBeInTheDocument();
  });

  it('aplica className corretamente dentro da tabela', () => {
    renderThInTable();
    const thElement = screen.getByRole('columnheader');
    expect(thElement).toHaveClass(testClassName);
  });

  it('tem estrutura HTML correta na tabela', () => {
    const { container } = renderThInTable();
    const thElement = container.querySelector('th');
    expect(thElement).toBeInTheDocument();
    expect(thElement?.textContent).toBe(testHeader);
  });
});