export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  timeoutMs: 20000,
  refreshPath: '/auth/refresh',
  get now() {
    return Date.now();
  }
};
