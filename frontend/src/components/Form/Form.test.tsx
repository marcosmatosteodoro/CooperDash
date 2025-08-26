import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from './Form';
import type { Field } from '@/types/ui';

describe('Form component', () => {
  const mockOnClick = jest.fn();
  const mockHandleSubmit = jest.fn((e) => e.preventDefault());
  const mockOnChange = jest.fn();

  const baseFields: Field[] = [
    {
      name: 'nome',
      label: 'Nome',
      tag: 'input',
      type: 'text',
      value: '',
      placeholder: 'Digite seu nome',
      className: '',
      contentClassName: 'col-md-6',
      onChange: mockOnChange,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      tag: 'select',
      type: 'text',
      value: '',
      options: [
        { value: '', text: 'Selecione' },
        { value: '1', text: 'Opção 1' },
      ],
      className: '',
      contentClassName: 'col-md-6',
      onChange: mockOnChange,
    }
  ];

  it('renders fields and buttons', () => {
    render(
      <Form
        fields={baseFields}
        fieldErrors={null}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('calls onClick when "Cancelar" is clicked', () => {
    render(
      <Form
        fields={baseFields}
        fieldErrors={null}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('calls handleSubmit when "Salvar" is clicked', () => {
    render(
      <Form
        fields={baseFields}
        fieldErrors={null}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    fireEvent.submit(screen.getByTestId('form'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays validation errors', () => {
    const errors = {
      nome: ['Nome é obrigatório'],
      tipo: ['Tipo inválido']
    };

    render(
      <Form
        fields={baseFields}
        fieldErrors={errors}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Tipo inválido')).toBeInTheDocument();
  });

  it('renders input group if provided', () => {
    const inputGroupField: Field = {
      ...baseFields[0],
      inputGroup: {
        className: 'prepend-icon',
        html: <span className="input-group-text">@</span>,
      }
    };

    render(
      <Form
        fields={[inputGroupField]}
        fieldErrors={null}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByTestId('input-group')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
  });

  it('renders a checkbox field', () => {
    const checkboxField: Field = {
      name: 'aceito',
      label: 'Aceito os termos',
      tag: 'checkbox',
      type: 'checkbox',
      checked: false,
      className: '',
      contentClassName: 'col-md-12',
      onChange: mockOnChange,
    };

    render(
      <Form
        fields={[checkboxField]}
        fieldErrors={null}
        onClick={mockOnClick}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Aceito os termos')).toBeInTheDocument();
  });

});
