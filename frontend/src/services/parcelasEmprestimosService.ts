import apiClient from '@/api/apiClient';
import type { ApiService } from '@/types/api';
import type { ParcelaEmprestimo } from '@/types/app/parcelaEmprestimo';
import { getUrlParams } from '@/util';

const ParcelasEmprestimosService: ApiService<ParcelaEmprestimo> = {
  getAll: (params) => apiClient.get(`/parcelas-emprestimos${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/parcelas-emprestimos/${id}`),
  create: (data) => apiClient.post('/parcelas-emprestimos', data),
  update: (id, data) => apiClient.put(`/parcelas-emprestimos/${id}`, data),
  delete: (id) => apiClient.delete(`/parcelas-emprestimos/${id}`)
};

export default ParcelasEmprestimosService;