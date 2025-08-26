export type InputType = 'text' | 'date' | 'number' | 'tel' | 'email' | 'password' | 'checkbox' | 'radio' | 'datetime-local';
export type InputTag = 'input' | 'select' | 'textarea' | 'checkbox' | 'radio';
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type CheckboxChangeEvent = InputChangeEvent;
export type FieldChangeEvent = InputChangeEvent | SelectChangeEvent | TextareaChangeEvent | CheckboxChangeEvent;

export type InputGroupType = {
  className?: string
  html: React.ReactNode
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}

export type Option = {
  value: string | number;
  text: string // TODO trocar para label
  disabled?: boolean; // TODO implementar
  selected?: boolean;
}

export type BaseField = {
  name: string;
  label: string;
  type: InputType;
  tag: InputTag;
  className?: string;
  contentClassName: string;
  value?: string | number;
  placeholder?: string;
  inputGroup?: InputGroupType;
  onChange: (e: FieldChangeEvent) => void;
};

// Tipos específicos para diferentes tags
export type InputField = BaseField & {
  tag: 'input';
  minLength?: number;
  maxLength?: number;
  max?: string;
  min?: string;
  step?: string;
};

export type SelectField = BaseField & {
  tag: 'select';
  options: Option[];
};


export type TextareaField = BaseField & {
  tag: 'textarea';
  rows?: number;
  cols?: number;
};

export type CheckboxField = BaseField & {
  tag: 'checkbox';
  checked: boolean;
};

// Tipo unificado para Field
export type Field = InputField | SelectField | TextareaField | CheckboxField;

// Tipos genéricos para formulários
export interface FormProps {
  onClick: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldErrors: Record<string, string[]> | null;
  fields: Field[];
}

// Componente de campo genérico
export interface FieldComponentProps {
  field: Field;
  fieldErrors: Record<string, string[]> | null;
}

// Aliases para manter compatibilidade com código existente
export type TexareaFieldProps = FieldComponentProps;
export type InputFieldProps = FieldComponentProps;
export type SelectFieldInterface = FieldComponentProps;
export type CheckboxFieldProps = FieldComponentProps;