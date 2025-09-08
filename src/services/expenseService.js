import { endpoints } from '../lib/http/endpoints.js';
import { http } from "../lib/http/axios.js";
export const expenseRequests = {
  getAll: (id, date) => ({
    method: 'GET',
    url: endpoints.expense.getAlls(id, date),
  }),

  add: (dto) => ({
    method: 'POST',
    url: endpoints.expense.add(),
    data: dto,
  }),

  update: (id, dto) => ({
    method: 'PUT',
    url: endpoints.expense.update(id),
    data: dto,
  }),

  delete: (id) => ({
    method: 'DELETE',
    url: endpoints.expense.delete(id),
  }),
  monthly: (payload) => ({
  method: 'POST',
  url: '/expenses/monthly',
  params: payload,
  data: payload
  })
};

export const fetchMonthlyExpenses = async (payload) => {
  try {
  const res = await http(expenseRequests.monthly(payload));
  return res.data.data;
  } catch (err) {
    console.error('Lỗi khi gọi API monthly expenses:', err);
    throw err;
  }
};


