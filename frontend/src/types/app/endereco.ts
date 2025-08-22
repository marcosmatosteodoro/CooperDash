export interface Endereco {
  id: number;
  cooperado_id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: string;
  principal: boolean;
}

export type EnderecoFilters = {
  searchTerm: string;
};