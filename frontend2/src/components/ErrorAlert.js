import React from 'react';

const ErrorAlert = ({ message }) =>  (
  <div className="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Erro:</strong> {message}
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
);

export default ErrorAlert;