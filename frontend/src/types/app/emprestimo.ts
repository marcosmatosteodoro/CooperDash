export interface Emprestimo {
  id: string;
  cooperado_id: string;
  valor_solicitado: number;
  valor_aprovado?: number;
  parcelas: number;
  taxa_juros: number;
  status: StatusEmprestimo;
  finalidade: string;
  data_solicitacao: string;
  data_analise?: string;
  data_liquidacao?: string;
  observacao?: string;
}

export type StatusEmprestimo = 'ANALISE' | 'APROVADO' | 'REPROVADO' | 'LIQUIDADO' | 'CANCELADO';

export type EmprestimoFilters = {
  searchTerm: string;
};