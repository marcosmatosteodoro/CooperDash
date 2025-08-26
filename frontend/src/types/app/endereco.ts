export interface Endereco {
  id: string;
  cooperado_id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: EnderecoTipo;
  principal: boolean;
}

export type EnderecoTipo = 'RESIDENCIAL' | 'COMERCIAL' | 'COBRANCA';

export type EnderecoFilters = {
  searchTerm: string;
};