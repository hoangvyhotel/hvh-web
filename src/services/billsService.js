import { http } from "lib/http/axios";

export const billsRequests = {
  fetchAllBills: () => ({
    url: '/bills',
    method: 'get'
  }),
  fetchBillById: (id) => ({
    url: `/bills/${id}`,
    method: 'get',
  }),
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


export const fetchAllBills = async () => {
  const response = await http(billsRequests.fetchAllBills());
  return response.data.data;
};

export const fetchBillById = async (id) => {
  const response = await http(billsRequests.fetchBillById(id));
  return response.data.data;
};

export const fetchDailyBills = async (payload) => {
  const response = await http(billsRequests.daily(payload));
  return response.data.data;
};

export const fetchMonthlyBills = async (payload) => {
  const response = await http(billsRequests.monthly(payload));
  return response.data.data;
};
