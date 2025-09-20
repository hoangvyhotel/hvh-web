import { http } from "lib/http/axios";

export const billsRequests = {
  fetchAllBills: (hotelId, date) => ({
    url: `/bills/${hotelId}/${date}`,
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
  }),
  updateBill: (id, dto) => ({
    url: `/bills/${id}`,
    method: 'put',
    data: dto
  })
};


export const fetchAllBills = async (hotelId, date) => {
  const response = await http(billsRequests.fetchAllBills(hotelId, date));
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
export const updateBill = async (id, dto) => {
  const response = await http(billsRequests.updateBill(id, dto));
  return response.data.data;
}
