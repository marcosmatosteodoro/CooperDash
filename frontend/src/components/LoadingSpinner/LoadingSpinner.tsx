export const LoadingSpinner: React.FC = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Carregando...</span>
    </div>
    <span className="ms-3">Carregando dados...</span>
  </div>
);