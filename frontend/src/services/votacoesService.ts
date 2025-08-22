import apiClient from '@/api/apiClient';
import type { ApiService } from '@/types/api';
import type { Votacao } from '@/types/app/votacao';
import { getUrlParams } from '@/util';

const VotacoesService: ApiService<Votacao> = {
  getAll: (params) => apiClient.get(`/votacoes${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/votacoes/${id}`),
  create: (data) => apiClient.post('/votacoes', data),
  update: (id, data) => apiClient.put(`/votacoes/${id}`, data),
  delete: (id) => apiClient.delete(`/votacoes/${id}`)
};

export default VotacoesService;