import apiClient from '@/api/apiClient';
import type { ApiService } from '@/types/api';
import type { Assembleia } from '@/types/app/assembleia';
import { getUrlParams } from '@/util';

const AssembleiasService: ApiService<Assembleia> = {
  getAll: (params) => apiClient.get(`/assembleias${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/assembleias/${id}`),
  create: (data) => apiClient.post('/assembleias', data),
  update: (id, data) => apiClient.put(`/assembleias/${id}`, data),
  delete: (id) => apiClient.delete(`/assembleias/${id}`)
};

export default AssembleiasService;