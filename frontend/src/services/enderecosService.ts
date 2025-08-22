import apiClient from '@/api/apiClient';
import type { Endereco } from '@/types/app/endereco';
import type { ApiService } from '@/types/api';
import { getUrlParams } from '@/util';

const EnderecosService: ApiService<Endereco> = {
  getAll: (params) => apiClient.get(`/enderecos${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/enderecos/${id}`),
  create: (data) => apiClient.post('/enderecos', data),
  update: (id, data) => apiClient.put(`/enderecos/${id}`, data),
  delete: (id) => apiClient.delete(`/enderecos/${id}`)
};

export default EnderecosService;