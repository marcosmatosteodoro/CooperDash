export interface Transacao {
  id: number;
  contas_corrente_id: number;
  tipo: TransacaoTipo;
  valor: number;
  saldo_anterior: number;
  saldo_posterior: number;
  descricao: string;
  categoria: string;
  data_transacao: Date;
}

export type TransacaoTipo = 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'RENDIMENTO' | 'TAXA';

export type TransacaoFilters = {
  searchTerm: string;
};