export interface Votacao {
  id: number;
  assembleia_id: number;
  cooperado_id: number;
  voto: VotacaoVoto;
  data_voto: Date;
  justificativa?: string;
}

export type VotacaoVoto = 'FAVOR' | 'CONTRA' | 'ABSTENCAO';

export type VotacaoFilters = {
  searchTerm: string;
};