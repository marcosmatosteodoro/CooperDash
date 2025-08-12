import { PaginatedResponse } from "@/types/api"

export type Ressource = { id: string } & Record<string, string>;
export type Data = Ressource[];

// Tipos básicos
export type LinkAction<T> = (value: T) => string;
export type DeleteAction<T> = (value: T) => void;
export type Headers = string[];
export type FilterCleaner = () => void;
export type SearchTerm = boolean;
export type NotFoundMessage = string;

// Interface principal com tipo genérico
export interface TableInterface<T> {
  headers: Headers;
  columns: ColumnType<T>[];
  data: T[];
  pagination: PaginatedResponse<T>;
  actions: ActionsType<T>;
  notFoundMessage: NotFoundMessage;
  searchTerm: SearchTerm;
  filterCleaner: FilterCleaner;
  paginationClickHandler: (link: string | null) => void;
}

export interface PaginationInterface extends Omit<PaginatedResponse<Ressource>, 'data'> {
  paginationClickHandler: (link: string | null) => void;
} 
// Interfaces auxiliares
export interface TheadInterface {
  headers: Headers;
  actions: boolean;
}

export interface TbodyContentInterface<T> {
  columns: ColumnType<T>[];
  data: T[];
  actions: ActionsType<T>;
  increase: number;
}

export interface TbodyEmptyInterface {
  notFoundMessage: NotFoundMessage;
  searchTerm: SearchTerm;
  filterCleaner: FilterCleaner;
}

export interface ThInterface {
  header: string;
  className?: string;
}

export interface TdContentInterface<T> {
  ressource: T;
  columns: ColumnType<T>[];
  index: number;
  actions: ActionsType<T>;
}

export interface TdInterface<T> {
  ressource: T;
  column: ColumnType<T>;
}

// Tipos para colunas e ações
export type ColumnType<T> = {
  className?: string;
  type?: 'text' | 'link';
  formatter?: (ressource: T) => string;
  href?: LinkAction<T>;
  style?: React.CSSProperties;
  attribute: keyof T;
};

export type ActionsType<T> = {
  edit?: EditButtonType<T>;
  delete?: DeleteButtonType<T>;
};

export type DeleteButtonType<T> = {
  onClick: DeleteAction<T>;
};

export type EditButtonType<T> = {
  href: LinkAction<T>;
};