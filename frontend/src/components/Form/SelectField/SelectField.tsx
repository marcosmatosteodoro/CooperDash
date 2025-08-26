import React from "react";
import type { SelectFieldInterface } from '@/types/ui';

export const SelectField: React.FC<SelectFieldInterface> = ({field, fieldErrors}) => {
  if (field.tag !== 'select') {
    console.error('invalid type');
    return <></>
  }

  const {name, className, options, value, onChange} = field;
  const finalClassName = [
    'form-control',
    className,
    fieldErrors?.[name] ? 'is-invalid' : ''
  ].filter(Boolean).join(' ');

  const isSelected = (optionValue: string | number) => {
    return value === optionValue
  };


  return (
    <select
      data-testid="form-select-field"
      id={field.name} 
      className={finalClassName}
      name={name}
      value={value}
      onChange={onChange}
    >
      { options?.map(({value, text}) => (
        <option key={value} value={value} selected={isSelected(value)}>
          {text}
        </option>
      )) }
    </select>
  )
}