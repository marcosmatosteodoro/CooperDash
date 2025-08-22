export interface Transacao {
  id: string;
  contas_corrente_id: string;
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