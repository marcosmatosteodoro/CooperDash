export interface Assembleia {
  id: string;
  titulo: string;
  descricao: string;
  data_hora: string;
  tipo: TipoAssembleia;
  status: StatusAssembleia;
  pauta: string;
  local: string;
  resultado?: string;
  quorum_minimo: number;
}

export type TipoAssembleia = 'ORDINARIA' | 'EXTRAORDINARIA';

export type StatusAssembleia = 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export type AssembleiaFilters = {
  searchTerm: string;
};
