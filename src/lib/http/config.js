export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hvh-api-production.up.railway.app/api/v1",
  get now() {
    return Date.now();
  }
};
