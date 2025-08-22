import type { AxiosResponse } from "axios"
import type { PaginatedResponse, PaginationParams } from "./pagination"

export interface ApiService<T> {
  getAll: (params: PaginationParams) => Promise<AxiosResponse<PaginatedResponse<T>>>
  getById: (id: string) => Promise<AxiosResponse<T>>
  create: (data: Omit<T, 'id'>) => Promise<AxiosResponse<T>>
  update: (id: string, data: Partial<T>) => Promise<AxiosResponse<T>>
  delete: (id: string) => Promise<AxiosResponse<void>>
}