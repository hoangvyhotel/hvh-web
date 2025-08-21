export const endpoints = {
  auth: {
    login: () => '/auth/login',
    refresh: () => '/auth/refresh',
    me: () => '/auth/me'
  },
  users: {
    root: () => '/users',
    list: () => '/users',
    detail: (id) => `/users/${id}`
  }
};
