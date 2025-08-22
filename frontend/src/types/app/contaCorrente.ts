export interface ContaCorrente {
  id: string;
  cooperado_id: string;
  numero_conta: string;
  saldo: number;
  limite_credito: number;
  status: ContaCorrenteStatus;
  data_abertura: Date;
  data_encerramento?: Date;
}

export type ContaCorrenteStatus = 'ATIVA' | 'BLOQUEADA' | 'CANCELADA';

export type ContaCorrenteFilters = {
  searchTerm: string;
};