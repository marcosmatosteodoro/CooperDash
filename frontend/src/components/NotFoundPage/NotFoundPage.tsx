import React from 'react';
import Link from 'next/link';

interface NotFoundPageProps {
  message?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ message = 'Página não encontrada' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <h1 className="display-1 text-danger">
          <i data-testid="icon-404" className="bi bi-exclamation-octagon"></i> 404
        </h1>
        <h2 className="mb-4">{message}</h2>
        <Link href="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2"></i>Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
