export const apiConfig = {
  baseURL: import.meta.env.VITE_BASE_URL_API ?? 'http://localhost:3001/api/v1',
  timeoutMs: 20000,
  get now() {
    return Date.now();
  }
};
