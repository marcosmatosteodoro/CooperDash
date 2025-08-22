export interface Emprestimo {
  id: number;
  cooperado_id: number;
  valor_solicitado: number;
  valor_aprovado?: number;
  parcelas: number;
  taxa_juros: number;
  status: StatusEmprestimo;
  finalidade: string;
  data_solicitacao: Date;
  data_analise?: Date;
  data_liquidacao?: Date;
  observacao?: string;
}

export type StatusEmprestimo = 'ANALISE' | 'APROVADO' | 'REPROVADO' | 'LIQUIDADO' | 'CANCELADO';

export type EmprestimoFilters = {
  searchTerm: string;
};