import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputField';
import type { InputField as InputFieldType } from '@/types/ui';

describe('InputField Component', () => {
  const mockField: InputFieldType = {
    tag: 'input',
    type: 'text',
    name: 'username',
    label: 'Username',
    contentClassName: 'col-md-6',
    onChange: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      field: mockField,
      fieldErrors: null,
      ...props,
    };
    return render(<InputField {...defaultProps} />);
  };

  it('should render input with correct attributes', async () => {
    renderComponent();
    
    const input = await screen.findByTestId('form-input-field');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveClass('form-control');
  });

  it('should show error state when fieldErrors exist', async () => {
    renderComponent({
      fieldErrors: {
        username: ['Invalid username'],
      },
    });

    const input = await screen.findByTestId('form-input-field');
    expect(input).toHaveClass('is-invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle onChange events', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    renderComponent({
      field: {
        ...mockField,
        onChange: mockOnChange,
      },
    });

    const input = await screen.findByTestId('form-input-field');
    await user.type(input, 'test');
    
    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });

  it('should apply additional className', async () => {
    renderComponent({
      field: {
        ...mockField,
        className: 'custom-class',
      },
    });

    const input = await screen.findByTestId('form-input-field');
    expect(input).toHaveClass('form-control custom-class');
  });

  it('should render with all input attributes', async () => {
    renderComponent({
      field: {
        ...mockField,
        minLength: 3,
        maxLength: 20,
        placeholder: 'Enter username',
        value: 'testuser',
      },
    });

    const input = await screen.findByTestId('form-input-field');
    expect(input).toHaveAttribute('minLength', '3');
    expect(input).toHaveAttribute('maxLength', '20');
    expect(input).toHaveAttribute('placeholder', 'Enter username');
    expect(input).toHaveValue('testuser');
  });

  it('should log error when invalid tag is provided', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderComponent({
      field: {
        ...mockField,
        tag: 'select' as string, // Forçando tipo errado para testar
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith('invalid type');
    consoleSpy.mockRestore();
  });

  it('should render number input with min/max/step attributes', async () => {
    renderComponent({
      field: {
        ...mockField,
        type: 'number',
        min: '0',
        max: '100',
        step: '5',
      },
    });

    const input = await screen.findByTestId('form-input-field');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '5');
  });

  it('should render password input', async () => {
    renderComponent({
      field: {
        ...mockField,
        type: 'password',
      },
    });

    const input = await screen.findByTestId('form-input-field');
    expect(input).toHaveAttribute('type', 'password');
  });
});