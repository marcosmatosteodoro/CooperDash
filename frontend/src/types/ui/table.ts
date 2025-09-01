import { PaginatedResponse, PaginationParams } from "@/types/api"
import { ChangeEvent, JSX } from "react";

export type Ressource = { id: string } & Record<string, string>;
export type Data = Ressource[];

// Tipos básicos
export type LinkAction<T> = (value: T) => string;
export type DeleteAction<T> = (value: T) => void;
export type Headers = string[];
export type FilterCleaner = () => void;
export type SearchTerm = string;
export type NotFoundMessage = string;
export type PlaceholderFilter = string;
export type OtherFilters = JSX.Element;
export type ParamsCleaner = (e: ChangeEvent<HTMLSelectElement>) => void;
export type Filter = (e: ChangeEvent<HTMLInputElement>) => void;

// Interface principal com tipo genérico
export interface FilterProps {
  params: PaginationParams;
  placeholderFilter: PlaceholderFilter;
  searchTerm: SearchTerm;
  children?: OtherFilters;
  paramsCleaner: ParamsCleaner;
  filter: Filter;
}
export interface TableInterface<T> {
  params: PaginationParams;
  headers: Headers;
  columns: ColumnType<T>[];
  data: T[];
  pagination: PaginatedResponse<T>;
  actions: ActionsType<T>;
  notFoundMessage: NotFoundMessage;
  placeholderFilter: PlaceholderFilter;
  searchTerm: SearchTerm;
  otherFilters?: OtherFilters;
  filter: Filter;
  paramsCleaner: ParamsCleaner;
  filterCleaner: FilterCleaner;
  setParams: (params: PaginationParams) => void;
}

export interface PaginationInterface extends Omit<PaginatedResponse<Ressource>, 'data'> {
  params: PaginationParams;
  setParams: (params: PaginationParams) => void;
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
  isSearchTerm: boolean;
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