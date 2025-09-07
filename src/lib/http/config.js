export const apiConfig = {
  baseURL: import.meta.env.REACT_APP_API_BASE_URL  || "http://localhost:3001/api/v1",
  get now() {
    return Date.now();
  }
};
