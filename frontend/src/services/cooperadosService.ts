import apiClient from '@/api/apiClient';
import { AxiosResponse } from 'axios';
import { Cooperado } from '@/types/cooperado'; // Assumindo que você tem um tipo Cooperado definido

interface CooperadosService {
  getAll: () => Promise<AxiosResponse<Cooperado[]>>
  getById: (id: string) => Promise<AxiosResponse<Cooperado>>
  create: (data: Omit<Cooperado, 'id'>) => Promise<AxiosResponse<Cooperado>>
  update: (id: string, data: Partial<Cooperado>) => Promise<AxiosResponse<Cooperado>>
  delete: (id: string) => Promise<AxiosResponse<void>>
}

const CooperadosService: CooperadosService = {
  getAll: () => apiClient.get('/cooperados'),
  getById: (id) => apiClient.get(`/cooperados/${id}`),
  create: (data) => apiClient.post('/cooperados', data),
  update: (id, data) => apiClient.put(`/cooperados/${id}`, data),
  delete: (id) => apiClient.delete(`/cooperados/${id}`)
};

export default CooperadosService;