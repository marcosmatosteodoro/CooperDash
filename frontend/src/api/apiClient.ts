import axios, { AxiosInstance } from 'axios';

const apiUrl =
  typeof window === 'undefined'
    ? 'http://nginx/api' // SSR (rodando no container)
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;