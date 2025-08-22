import apiClient from '@/api/apiClient';
import { Cooperado } from '@/types/app/cooperado';
import type { PaginationParams, ApiService } from '@/types/api';

const getParams = (params: PaginationParams): string => {
  if(!params) {
    return ''
  }

  params = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );

  return '?' + new URLSearchParams(params as Record<string, string>).toString()
}

const CooperadosService: ApiService<Cooperado> = {
  getAll: (params) => apiClient.get(`/cooperados${getParams(params)}`),
  getById: (id) => apiClient.get(`/cooperados/${id}`),
  create: (data) => apiClient.post('/cooperados', data),
  update: (id, data) => apiClient.put(`/cooperados/${id}`, data),
  delete: (id) => apiClient.delete(`/cooperados/${id}`)
};

export default CooperadosService;