import React from "react";
import type { CheckboxFieldProps } from '@/types/ui';

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ field, fieldErrors }) => {
  if (field.tag !== 'checkbox') {
    console.error('invalid type');
    return <></>
  }

  const { label, checked, onChange } = field;

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={label}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={label}>
        {label}
      </label>
    </div>
  );
};