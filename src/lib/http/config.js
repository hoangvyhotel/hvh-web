export const apiConfig = {
  baseURL: 'http://localhost:3001/api/v1',
  timeoutMs: 20000,
  refreshPath: '/auth/refresh',
  get now() {
    return Date.now();
  }
};
