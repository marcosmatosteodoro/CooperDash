export interface ContaCorrente {
  id: string;
  cooperado_id: string;
  numero_conta: string;
  saldo: number;
  limite_credito: number;
  status: ContaCorrenteStatus;
  data_abertura: string;
  data_encerramento?: string;
}

export type ContaCorrenteStatus = 'ATIVA' | 'BLOQUEADA' | 'CANCELADA';

export type ContaCorrenteFilters = {
  searchTerm: string;
};