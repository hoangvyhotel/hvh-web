export const endpoints = {
  // auth endpoints removed
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
    updateRangePrice: () => '/rooms/update-range'
  }
  ,
  utilities: {
    root: () => '/utilities',
    list: () => '/utilities',
    detail: (id) => `/utilities/${id}`
  }
  ,
  bills: {
  daily: () => '/bills/daily',
  monthly: () => '/bills/monthly'
  }
};
