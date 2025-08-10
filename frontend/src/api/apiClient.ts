import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'https://dashboard-wqhc.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;