import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('exibe o spinner e o texto de carregamento corretamente', () => {
    render(<LoadingSpinner />);

    // Verifica se o elemento com role="status" (spinner) está presente
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();

    // Verifica se o texto acessível "Carregando..." está presente (visually-hidden)
    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    // Verifica se o texto visível "Carregando dados..." está presente
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
  });
});
