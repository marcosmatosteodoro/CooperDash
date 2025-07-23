import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/Footer';

describe('Footer', () => {
  it('exibe o ano atual e o texto corretamente', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByText(`© ${currentYear} Todos os direitos reservados para`)).toBeInTheDocument();
    expect(screen.getByText(/Marcos Paulo Teodoro/)).toBeInTheDocument();
  });
});
