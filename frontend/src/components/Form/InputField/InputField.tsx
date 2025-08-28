import React from "react";
import type { InputFieldProps } from '@/types/ui';

export const InputField: React.FC<InputFieldProps> = ({ field, fieldErrors }) => {
  if (field.tag !== 'input') {
    console.error('invalid type');
    return <></>
  }

  const {type, name, className, minLength, maxLength, max, min, step, placeholder, value, onChange} = field;

  const finalClassName = [
    'form-control',
    className,
    fieldErrors?.[name] ? 'is-invalid' : ''
  ].filter(Boolean).join(' ');

  return (
    <input
      data-testid="form-input-field"
      id={field.name}
      type={type}
      className={finalClassName}
      name={name}
      minLength={minLength}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      aria-invalid={!!fieldErrors?.[field.name]}
      aria-describedby={fieldErrors?.[field.name] ? `${name}-error` : undefined}
    />
  );
};