import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorAlert from '../../components/ErrorAlert';

describe('ErrorAlert', () => {
  it('exibe a mensagem de erro corretamente', () => {
    const message = 'Algo deu errado';
    render(<ErrorAlert message={message} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
