export const billsRequests = {
  daily: (payload) => ({
    url: '/bills/daily',
    method: 'post',
    params: payload,
    data: payload
  })
  ,
  monthly: (payload) => ({
    url: '/bills/monthly',
    method: 'post',
    params: payload,
    data: payload
  })
};
