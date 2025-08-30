export const endpoints = {
  auth: {
    login: () => '/auth/login',
    refresh: () => '/auth/refresh',
    me: () => '/auth/me',
    register: () => '/auth/register'
  },
  users: {
    root: () => '/users',
    list: () => '/users',
    detail: (id) => `/users/${id}`
  },
  expense: {
    getAlls: (id, date) => `/expenses?id=${id}&date=${date}`,
    add: () => '/expenses',
    update: (id) => `/expenses/${id}`,
    delete: (id) => `/expenses/${id}`
  },
  room: {
    getAlls: (id, isGetAll) => `/rooms?id=${id}&isGetAll=${isGetAll}`,
    updateRangePrice: () => '/rooms/update-range',
    add: () => '/rooms',
    update: (id) => `/rooms/${id}`,
    updateStauts: (id) => `/rooms/status/${id}`,
    delete: (id) => `/rooms/${id}`
  }
  ,
  utilities: {
    root: () => '/utilities',
    list: () => '/utilities',
    detail: (id) => `/utilities/${id}`
  }
  ,
  bills: {
  getBills: () => '/bills',
  getBillById: (id) => `/bills/${id}`,
  daily: () => '/bills/daily',
  monthly: () => '/bills/monthly'
  }
};
