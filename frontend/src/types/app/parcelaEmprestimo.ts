export interface ParcelaEmprestimo {
  id: number;
  emprestimo_id: number;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: Date;
  data_pagamento?: Date;
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