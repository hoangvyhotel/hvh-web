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
};
async function fetchExpenses(id) {
  try {
    const res = await http({
      method: 'GET',
      url: endpoints.expense.getAlls(id)
    });
    return res.data;
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
    throw err;
  }
}


