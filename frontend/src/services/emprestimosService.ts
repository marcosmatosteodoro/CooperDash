import apiClient from '@/api/apiClient';
import type { Emprestimo } from '@/types/app/emprestimo';
import type { ApiService } from '@/types/api';
import { getUrlParams } from '@/util';

const EmprestimosService: ApiService<Emprestimo> = {
  getAll: (params) => apiClient.get(`/emprestimos${getUrlParams(params)}`),
  getById: (id) => apiClient.get(`/emprestimos/${id}`),
  create: (data) => apiClient.post('/emprestimos', data),
  update: (id, data) => apiClient.put(`/emprestimos/${id}`, data),
  delete: (id) => apiClient.delete(`/emprestimos/${id}`)
};

export default EmprestimosService;