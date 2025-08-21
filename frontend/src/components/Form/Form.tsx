import React from "react";
import {InputField, SelectField} from "./"
import type { FormProps, Field } from '@/types/ui'

export const Form: React.FC<FormProps> = ({ onClick, handleSubmit, fieldErrors, fields }) => {
  const fieldComponent = (field: Field) => {
    const component = {
      input: <InputField field={field} fieldErrors={fieldErrors}  />,
      select: <SelectField field={field} fieldErrors={fieldErrors}  />,
      textarea: <textarea id={field.name}  />
    }

    return component[field.tag] 
  }

  return (
    <form onSubmit={handleSubmit} data-testid="form">
      <div className="row g-3">
        { fields.map((field) => (
          <div key={field.name} className={field.contentClassName}>
            <label htmlFor={field.name} className="form-label">
              {field.label}
            </label>

            { field.inputGroup ? 
              <div 
                className={`input-group ${field.inputGroup.className}`} 
                data-testid="input-group"
                >
                  {field.inputGroup.html}
                  {fieldComponent(field) }
              </div>
              :
              fieldComponent(field) 
            }

            <div className="invalid-feedback">
              { fieldErrors?.[field.name]?.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </div>
        )) }

        {/* Botões */}
        <div className="col-12 d-flex justify-content-end gap-2 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onClick}
          >
            <i className="bi bi-x-lg me-2"></i>Cancelar
          </button>

          <button type="submit" className="btn btn-primary">
            <i className="bi bi-check-lg me-2"></i>Salvar
          </button>
        </div>

      </div>
    </form>
  );
}