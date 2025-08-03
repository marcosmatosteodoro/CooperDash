export interface Cooperado {
  id: string;
  nome: string;
  tipo_pessoa: TipoPessoa;
  documento: string;
  data: string;
  valor: number;
  telefone: string;
  email: string;
  codigo_pais: string;
}

export type TipoPessoa = 'FISICA' | 'JURIDICA';