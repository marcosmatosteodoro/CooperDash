import axios, { AxiosInstance } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://nginx/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;