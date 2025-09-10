import { http } from 'lib/http/axios';
import { endpoints } from '../lib/http/endpoints';

export const authRequests = {
  login: (dto) => ({ method: 'POST', url: endpoints.auth.login(), data: dto }),
  loginAdmin: (dto) => ({ method: 'POST', url: endpoints.auth.loginAdmin(), data: dto }),
  me: () => ({ method: 'GET', url: endpoints.auth.me() }),
  register: (dto) => ({ method: 'POST', url: endpoints.auth.register(), data: dto })
};

export const changeStaffPassword = async (dto) => {
  try {
    const response = await http.request({
      method: 'POST',
      url: '/auth/change-password', // thêm "/" để chắc chắn
      data: dto,
    });
    return response;
  } catch (error) {
    // Trả lỗi về cho UI xử lý
    throw error.response?.data || error;
  }
};

export const changeManagerPassword = (dto) => {
  const response = http.request({
    method: 'POST',
    url: 'auth/change-admin-password',
    data: dto
  });

  return response;
}
