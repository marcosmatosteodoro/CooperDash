import React from "react";
import type { TexareaFieldProps } from '@/types/ui';

export const TexareaField: React.FC<TexareaFieldProps> = ({ field, fieldErrors }) => {
  if (field.tag !== 'textarea') {
    console.error('invalid type');
    return <></>
  }

  const {name, className, placeholder, value, onChange} = field;

  const finalClassName = [
    'form-control',
    className,
    fieldErrors?.[name] ? 'is-invalid' : ''
  ].filter(Boolean).join(' ');

  return (
    <textarea
      data-testid="form-textarea-field"
      id={field.name}
      className={finalClassName}
      name={name}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      style={{ resize: 'vertical', minHeight: '100px' }}
      aria-invalid={!!fieldErrors?.[field.name]}
      aria-describedby={fieldErrors?.[field.name] ? `${name}-error` : undefined}
    />
  );
};