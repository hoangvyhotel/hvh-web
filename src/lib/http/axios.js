import axios from 'axios';
import { apiConfig } from './config';

export const http = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  withCredentials: true // if using cookies/CSRF
});
http.interceptors.request.use((config) => config);
http.interceptors.response.use((res) => res, (error) => Promise.reject(error));
