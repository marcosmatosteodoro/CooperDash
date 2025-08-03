import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('deve renderizar a mensagem padrão', () => {
    render(<NotFoundPage />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Página não encontrada');
  });

  it('deve renderizar uma mensagem personalizada', () => {
    const customMessage = 'Conteúdo não encontrado';
    render(<NotFoundPage message={customMessage} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(customMessage);
  });

  it('deve renderizar o link para a página inicial', () => {
    render(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /voltar para a página inicial/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('deve renderizar o ícone 404', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toContainElement(screen.getByTestId('icon-404'));
  });
});
