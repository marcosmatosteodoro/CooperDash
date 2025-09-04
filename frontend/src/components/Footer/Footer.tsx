import React from 'react';
import packageJson from '@/../package.json';

export const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="p-4 mt-auto">
      <div className="container mx-auto row">
        <p className="copyright text-secondary col text-center text-lg-start">
          © {currentYear} Todos os direitos reservados para <strong>Marcos Paulo Teodoro</strong>
        </p>
        <p className="copyright text-secondary col-12 col-lg-3 text-center text-lg-end">
          v{packageJson.version}
        </p>
      </div>
    </footer>
  );
};