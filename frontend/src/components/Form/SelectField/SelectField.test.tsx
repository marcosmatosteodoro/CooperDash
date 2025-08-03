import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectField } from './SelectField';
import { SelectField as SelectFieldType } from '../types';

describe('SelectField Component', () => {
  const mockOptions = [
    { value: '1', text: 'Option 1' },
    { value: '2', text: 'Option 2' },
    { value: '3', text: 'Option 3', disabled: true },
  ];

  const mockField: SelectFieldType = {
    tag: 'select',
    name: 'test-select',
    type: 'text',
    label: 'Test Select',
    contentClassName: 'col-md-6',
    options: mockOptions,
    onChange: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      field: mockField,
      fieldErrors: null,
      ...props,
    };
    return render(<SelectField {...defaultProps} />);
  };

  it('should render select with options', () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('name', 'test-select');
    expect(select).toHaveClass('form-control');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('1');
    expect(options[0]).toHaveTextContent('Option 1');
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

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '2');
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should apply additional className', () => {
    renderComponent({
      field: {
        ...mockField,
        className: 'custom-class',
      },
    });

    expect(screen.getByRole('combobox')).toHaveClass('form-control custom-class');
  });

  it('should render with selected value', () => {
    renderComponent({
      field: {
        ...mockField,
        value: '2',
      },
    });

    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('should log error when invalid tag is provided', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderComponent({
      field: {
        ...mockField,
        tag: 'input' as string, // Forçando tipo errado para testar
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith('invalid type');
    consoleSpy.mockRestore();
  });

  it('should handle empty options array', () => {
    renderComponent({
      field: {
        ...mockField,
        options: [],
      },
    });

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});