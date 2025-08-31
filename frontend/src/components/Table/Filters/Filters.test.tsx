import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filters } from './Filters';
import { FilterProps } from '@/types/ui';

// Mock das props
const mockProps: FilterProps = {
  params: {
    per_page: 10,
    page: 1,
  },
  paramsCleaner: jest.fn(),
  placeholderFilter: 'Buscar...',
  searchTerm: '',
  filter: jest.fn(),
};

describe('Filters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with basic props', () => {
    render(<Filters {...mockProps} />);
    
    // Verifica se o componente foi renderizado
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    
    // Verifica se o select de itens por página está renderizado
    expect(screen.getByTestId('per-page-select')).toBeInTheDocument();
    
    // Verifica se o input de busca está renderizado
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    
    // Verifica se o placeholder está correto
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  test('displays correct per_page value in select', () => {
    render(<Filters {...mockProps} />);
    
    const selectElement = screen.getByTestId('per-page-select') as HTMLSelectElement;
    expect(selectElement.value).toBe('10');
  });

  test('calls paramsCleaner when per_page select is changed', () => {
    render(<Filters {...mockProps} />);
    
    const selectElement = screen.getByTestId('per-page-select');
    fireEvent.change(selectElement, { target: { value: '20' } });
    
    expect(mockProps.paramsCleaner).toHaveBeenCalledTimes(1);
  });

  test('displays correct search term in input', () => {
    const propsWithSearchTerm = {
      ...mockProps,
      searchTerm: 'test search',
    };
    
    render(<Filters {...propsWithSearchTerm} />);
    
    const inputElement = screen.getByTestId('search-input') as HTMLInputElement;
    expect(inputElement.value).toBe('test search');
  });

  test('calls filter function when search input is changed', () => {
    render(<Filters {...mockProps} />);
    
    const inputElement = screen.getByTestId('search-input');
    fireEvent.change(inputElement, { target: { value: 'new search' } });
    
    expect(mockProps.filter).toHaveBeenCalledTimes(1);
  });

  test('renders all options in per_page select', () => {
    render(<Filters {...mockProps} />);
    
    const selectElement = screen.getByTestId('per-page-select');
    const options = selectElement.querySelectorAll('option');
    
    expect(options).toHaveLength(5);
    expect(options[0].value).toBe('5');
    expect(options[1].value).toBe('10');
    expect(options[2].value).toBe('20');
    expect(options[3].value).toBe('50');
    expect(options[4].value).toBe('100');
  });

  test('renders children correctly', () => {
    const { getByText } = render(
      <Filters {...mockProps}>
        <div>Child Component</div>
      </Filters>
    );
    
    expect(getByText('Child Component')).toBeInTheDocument();
  });

  test('has correct accessibility attributes', () => {
    render(<Filters {...mockProps} />);
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('placeholder', 'Buscar...');
    
    // Verifica se o elemento está focado (mais semântico)
    expect(searchInput).toHaveFocus();
    
    const searchIcon = screen.getByText('por página');
    expect(searchIcon).toBeInTheDocument();
  });

    test('applies correct CSS classes', () => {
    render(<Filters {...mockProps} />);
    
    const filtersDiv = screen.getByTestId('filters');
    expect(filtersDiv).toHaveClass('row', 'align-items-center', 'g-3');
    
    const selectElement = screen.getByTestId('per-page-select');
    expect(selectElement).toHaveClass('form-select');
    
    const inputElement = screen.getByTestId('search-input');
    expect(inputElement).toHaveClass('form-control');
  });
});