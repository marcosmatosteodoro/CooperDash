// Pagination.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { PaginationInterface } from '../types';

describe('Pagination component', () => {
  const mockHandler = jest.fn();

  const defaultProps: PaginationInterface = {
    links: [
      { url: null, label: '&laquo; Previous', active: false },
      { url: 'http://localhost?page=1', label: '1', active: true },
      { url: 'http://localhost?page=2', label: '2', active: false },
      { url: null, label: 'Next &raquo;', active: false },
    ],
    current_page: 1,
    last_page: 2,
    total: 20,
    first_page_url: 'http://localhost?page=1',
    last_page_url: 'http://localhost?page=2',
    next_page_url: 'http://localhost?page=2',
    from: 1,
    path: 'http://localhost',
    per_page: 10,
    prev_page_url: null,
    to: 2,
    paginationClickHandler: mockHandler,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os links de paginação corretamente', () => {
    render(<Pagination {...defaultProps} />);
    
    // Deve renderizar 4 itens (prev, 1, 2, next)
    expect(screen.getAllByRole('button')).toHaveLength(4);
    
    // Deve mostrar texto de paginação
    expect(
      screen.getByText(/Showing 1 to 2 of 20 Entries/i)
    ).toBeInTheDocument();
  });

  it('chama o handler ao clicar em um link válido', () => {
    render(<Pagination {...defaultProps} />);
    
    const linkPage2 = screen.getByRole('button', { name: '2' });
    fireEvent.click(linkPage2);
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith('http://localhost?page=2');
  });

  it('não chama o handler ao clicar em link desabilitado', () => {
    render(<Pagination {...defaultProps} />);
    
    const disabledButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(disabledButton);
    
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
