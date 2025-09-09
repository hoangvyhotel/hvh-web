import { http } from "lib/http/axios";

export const billsRequests = {
  fetchAllBills: (hotelId) => ({
    url: `/bills/${hotelId}`,
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


export const fetchAllBills = async (hotelId) => {
  const response = await http(billsRequests.fetchAllBills(hotelId));
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

export const createBill = async (roomId) => {
  if (!roomId) throw new Error('Room ID is required to create a bill');
  const response = await http({
    url: `/bills/${roomId}`,
    method: 'post',
  });
  return response.data.data;
}
