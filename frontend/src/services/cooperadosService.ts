import apiClient from '@/api/apiClient';
import { Cooperado } from '@/types/app/cooperado';
import type { ApiService } from '@/types/api';
import { getUrlParams } from '@/util';

const CooperadosService: ApiService<Cooperado> = {
  getAll: (params) => apiClient.get(`/cooperados${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/cooperados/${id}`),
  create: (data) => apiClient.post('/cooperados', data),
  update: (id, data) => apiClient.put(`/cooperados/${id}`, data),
  delete: (id) => apiClient.delete(`/cooperados/${id}`)
};

export default CooperadosService;