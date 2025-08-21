import type { ErrorAlertInterface } from "@/types/ui/errorAlert";

export const ErrorAlert: React.FC<ErrorAlertInterface> = ({ message, onClick }) =>  (
  <div className="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Erro:</strong> {message}
    <button type="button" className="btn-close" onClick={onClick} data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
);