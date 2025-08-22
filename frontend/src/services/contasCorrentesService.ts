import apiClient from '@/api/apiClient';
import type { ApiService } from '@/types/api';
import type { ContaCorrente } from '@/types/app/contaCorrente';
import { getUrlParams } from '@/util';

const ContasCorrentesService: ApiService<ContaCorrente> = {
  getAll: (params) => apiClient.get(`/contas-correntes${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/contas-correntes/${id}`),
  create: (data) => apiClient.post('/contas-correntes', data),
  update: (id, data) => apiClient.put(`/contas-correntes/${id}`, data),
  delete: (id) => apiClient.delete(`/contas-correntes/${id}`)
};

export default ContasCorrentesService;