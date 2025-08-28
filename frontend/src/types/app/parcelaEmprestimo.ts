export interface ParcelaEmprestimo {
  id: string;
  emprestimo_id: string;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: ParcelaEmprestimoStatus;
  valor_pago: number;
  dias_atraso: number;
  multa: number;
  juros: number;
}

export type ParcelaEmprestimoStatus = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';

export type ParcelaEmprestimoFilters = {
  searchTerm: string;
};