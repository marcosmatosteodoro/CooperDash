import apiClient from '@/api/apiClient';
import { AxiosResponse } from 'axios';
import { Cooperado } from '@/types/cooperado'; // Assumindo que você tem um tipo Cooperado definido
import { PaginatedResponse, PaginationParams } from '@/types/api'; // Assumindo que você tem um tipo Cooperado definido

interface CooperadosService {
  getAll: (params: PaginationParams) => Promise<AxiosResponse<PaginatedResponse<Cooperado>>>
  getById: (id: string) => Promise<AxiosResponse<Cooperado>>
  create: (data: Omit<Cooperado, 'id'>) => Promise<AxiosResponse<Cooperado>>
  update: (id: string, data: Partial<Cooperado>) => Promise<AxiosResponse<Cooperado>>
  delete: (id: string) => Promise<AxiosResponse<void>>
}

const CooperadosService: CooperadosService = {
  getAll: (params) => apiClient.get(`/cooperados${!params ? '' : '?' + new URLSearchParams(params as Record<string, string>).toString()}`),
  getById: (id) => apiClient.get(`/cooperados/${id}`),
  create: (data) => apiClient.post('/cooperados', data),
  update: (id, data) => apiClient.put(`/cooperados/${id}`, data),
  delete: (id) => apiClient.delete(`/cooperados/${id}`)
};

export default CooperadosService;