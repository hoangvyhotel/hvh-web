export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1',
  timeoutMs: 20000,
  get now() {
    return Date.now();
  }
};
