// Replace with secure storage in production (e.g., httpOnly cookies + CSRF)
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  get access() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set access(token) {
    if (!token) localStorage.removeItem(ACCESS_TOKEN_KEY);
    else localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set refresh(token) {
    if (!token) localStorage.removeItem(REFRESH_TOKEN_KEY);
    else localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear() {
    this.access = null;
    this.refresh = null;
  },
};