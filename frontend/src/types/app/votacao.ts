export interface Votacao {
  id: string;
  assembleia_id: string;
  cooperado_id: string;
  voto: VotacaoVoto;
  data_voto: Date;
  justificativa?: string;
}

export type VotacaoVoto = 'FAVOR' | 'CONTRA' | 'ABSTENCAO';

export type VotacaoFilters = {
  searchTerm: string;
};