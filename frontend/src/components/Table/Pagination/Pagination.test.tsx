import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import type { PaginationInterface } from "@/types/ui";

describe('Pagination component', () => {
  const mockSetParams = jest.fn();

  const defaultParams = {
    page: 1,
    per_page: 10,
    search: '',
    sort: 'id',
    order: 'asc'
  };

  const defaultProps: PaginationInterface = {
    links: [
      { url: null, label: '&laquo; Previous', active: false },
      { url: 'http://localhost?page=1', label: '1', active: true },
      { url: 'http://localhost?page=2', label: '2', active: false },
      { url: 'http://localhost?page=3', label: '3', active: false },
      { url: null, label: 'Next &raquo;', active: false },
    ],
    current_page: 1,
    last_page: 3,
    total: 30,
    first_page_url: 'http://localhost?page=1',
    last_page_url: 'http://localhost?page=3',
    next_page_url: 'http://localhost?page=2',
    from: 1,
    path: 'http://localhost',
    per_page: 10,
    prev_page_url: null,
    to: 10,
    params: defaultParams,
    setParams: mockSetParams
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os links de paginação corretamente', () => {
    render(<Pagination {...defaultProps} />);
    
    // Deve renderizar 5 itens (prev, 1, 2, 3, next)
    expect(screen.getAllByRole('button')).toHaveLength(5);
    
    // Deve mostrar texto de paginação
    expect(
      screen.getByText(/Showing 1 to 3 of 30 Entries/i)
    ).toBeInTheDocument();
  });

  it('chama setParams ao clicar em um link válido', () => {
    render(<Pagination {...defaultProps} />);
    
    const linkPage2 = screen.getByRole('button', { name: '2' });
    fireEvent.click(linkPage2);
    
    expect(mockSetParams).toHaveBeenCalledTimes(1);
    expect(mockSetParams).toHaveBeenCalledWith({
      ...defaultParams,
      page: 2
    });
  });

  it('não chama setParams ao clicar em link desabilitado', () => {
    render(<Pagination {...defaultProps} />);
    
    const disabledButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(disabledButton);
    
    expect(mockSetParams).not.toHaveBeenCalled();
  });

  it('lida corretamente com URL de paginação', () => {
    const propsWithComplexUrl = {
      ...defaultProps,
      links: [
        { url: 'http://localhost?page=2&search=test&sort=name', label: '2', active: false }
      ]
    };

    render(<Pagination {...propsWithComplexUrl} />);
    
    const linkPage2 = screen.getByRole('button', { name: '2' });
    fireEvent.click(linkPage2);
    
    expect(mockSetParams).toHaveBeenCalledWith({
      ...defaultParams,
      page: 2
    });
  });

  it('mostra texto de paginação corretamente para última página', () => {
    const lastPageProps = {
      ...defaultProps,
      current_page: 3,
      last_page: 3,
      from: 21,
      to: 30
    };

    render(<Pagination {...lastPageProps} />);
    
    expect(
      screen.getByText(/Showing 3 to 3 of 30 Entries/i)
    ).toBeInTheDocument();
  });

  it('renderiza links desabilitados corretamente', () => {
    render(<Pagination {...defaultProps} />);
    
    const listItems = screen.getAllByRole('listitem');
    const previousListItem = listItems[0];
    const nextListItem = listItems[4];
    
    // A classe disabled deve estar no <li> pai, não no botão
    expect(previousListItem).toHaveClass('disabled');
    expect(nextListItem).toHaveClass('disabled');
  });

  it('renderiza link ativo corretamente', () => {
    render(<Pagination {...defaultProps} />);
    
    const listItems = screen.getAllByRole('listitem');
    const activeListItem = listItems[1]; // Segundo item (página 1)
    
    expect(activeListItem).toHaveClass('active');
  });

  it('não chama onClickHandler para links sem URL', () => {
    render(<Pagination {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    const buttonsWithoutUrl = buttons.filter(button => 
      button.innerHTML.includes('&laquo;') || button.innerHTML.includes('&raquo;')
    );
    
    buttonsWithoutUrl.forEach(button => {
      fireEvent.click(button);
    });
    
    expect(mockSetParams).not.toHaveBeenCalled();
  });
});