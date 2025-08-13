import apiClient from '@/api/apiClient';
import { AxiosResponse } from 'axios';
import { Cooperado } from '@/types/cooperado';
import { PaginatedResponse, PaginationParams } from '@/types/api';

interface CooperadosService {
  getAll: (params: PaginationParams) => Promise<AxiosResponse<PaginatedResponse<Cooperado>>>
  getById: (id: string) => Promise<AxiosResponse<Cooperado>>
  create: (data: Omit<Cooperado, 'id'>) => Promise<AxiosResponse<Cooperado>>
  update: (id: string, data: Partial<Cooperado>) => Promise<AxiosResponse<Cooperado>>
  delete: (id: string) => Promise<AxiosResponse<void>>
}

const getParams = (params: PaginationParams): string => {
  if(!params) {
    return ''
  }

  params = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );

  return '?' + new URLSearchParams(params as Record<string, string>).toString()
}

const CooperadosService: CooperadosService = {
  getAll: (params) => apiClient.get(`/cooperados${getParams(params)}`),
  getById: (id) => apiClient.get(`/cooperados/${id}`),
  create: (data) => apiClient.post('/cooperados', data),
  update: (id, data) => apiClient.put(`/cooperados/${id}`, data),
  delete: (id) => apiClient.delete(`/cooperados/${id}`)
};

export default CooperadosService;