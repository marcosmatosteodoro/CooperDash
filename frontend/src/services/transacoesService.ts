import apiClient from '@/api/apiClient';
import type { ApiService } from '@/types/api';
import type { Transacao } from '@/types/app/transacao';
import { getUrlParams } from '@/util';

const TransacoesService: ApiService<Transacao> = {
  getAll: (params) => apiClient.get(`/transacoes${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/transacoes/${id}`),
  create: (data) => apiClient.post('/transacoes', data),
  update: (id, data) => apiClient.put(`/transacoes/${id}`, data),
  delete: (id) => apiClient.delete(`/transacoes/${id}`)
};

export default TransacoesService;