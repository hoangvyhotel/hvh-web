export const endpoints = {
  // auth endpoints removed
  users: {
    root: () => '/users',
    list: () => '/users',
    detail: (id) => `/users/${id}`
  }
  ,
  utilities: {
    root: () => '/utilities',
    list: () => '/utilities',
    detail: (id) => `/utilities/${id}`
  }
};
