import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renderiza o ano atual e o nome corretamente', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);
    
    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} Todos os direitos reservados para`, 'i')
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Marcos Paulo Teodoro/i)).toBeInTheDocument();
  });
});
