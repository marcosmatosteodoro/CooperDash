import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TbodyEmpty } from './TbodyEmpty';

describe('TbodyEmpty component', () => {
  it('renders notFoundMessage', () => {
    render(<TbodyEmpty notFoundMessage="Nada encontrado" isSearchTerm={false} filterCleaner={() => {}} />);
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument();
  });

  it('does not render the clear button when isSearchTerm is false', () => {
    render(<TbodyEmpty notFoundMessage="Nada encontrado" isSearchTerm={false} filterCleaner={() => {}} />);
    const button = screen.queryByRole('button', { name: /limpar busca/i });
    expect(button).not.toBeInTheDocument();
  });

  it('renders and triggers filterCleaner when isSearchTerm is true', () => {
    const mockFilterCleaner = jest.fn();

    render(<TbodyEmpty notFoundMessage="Nada encontrado" isSearchTerm={true} filterCleaner={mockFilterCleaner} />);
    
    const button = screen.getByRole('button', { name: /limpar busca/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockFilterCleaner).toHaveBeenCalledTimes(1);
  });
});
