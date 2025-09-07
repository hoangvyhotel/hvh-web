export const apiConfig = {
  baseURL: import.meta.env.BASE_URL_API  || "http://localhost:3001/api/v1",
  get now() {
    return Date.now();
  }
};
