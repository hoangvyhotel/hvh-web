import axios from "axios";
import { apiConfig } from "./config";
import { tokenStorage } from "./storage";

let isRefreshing = false;
let pendingQueue = [];

function flushQueue(token, error) {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  pendingQueue = [];
}

export const http = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  withCredentials: true, // if using cookies/CSRF
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.access;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status ?? 0;

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        const newToken = await new Promise((resolve, reject) => pendingQueue.push({ resolve, reject }));
        if (newToken && original.headers) original.headers["Authorization"] = `Bearer ${newToken}`;
        original._retry = true;
        return http(original);
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.refresh;
        if (!refreshToken) throw error;
        const { data } = await axios.post(
          apiConfig.baseURL + apiConfig.refreshPath,
          { refreshToken },
          { withCredentials: true }
        );
        const newAccess = data?.accessToken;
        if (!newAccess) throw error;
        tokenStorage.access = newAccess;
        flushQueue(newAccess);
        if (original.headers) original.headers["Authorization"] = `Bearer ${newAccess}`;
        return http(original);
      } catch (e) {
        tokenStorage.clear();
        flushQueue(null, e);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);