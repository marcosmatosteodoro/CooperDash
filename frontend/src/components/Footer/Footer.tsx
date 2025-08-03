import React from 'react';

export const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="p-4 mt-auto">
      <div className="container mx-auto">
        <p className="copyright text-secondary">
          © {currentYear} Todos os direitos reservados para <strong>Marcos Paulo Teodoro</strong>
        </p>
      </div>
    </footer>
  );
};