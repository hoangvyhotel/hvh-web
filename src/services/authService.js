import { http } from 'lib/http/axios';
import { endpoints } from '../lib/http/endpoints';

export const authRequests = {
  login: (dto) => ({ method: 'POST', url: endpoints.auth.login(), data: dto }),
  loginAdmin: (dto) => ({ method: 'POST', url: endpoints.auth.loginAdmin(), data: dto }),
  me: () => ({ method: 'GET', url: endpoints.auth.me() }),
  register: (dto) => ({ method: 'POST', url: endpoints.auth.register(), data: dto })
};

export const changeStaffPassword = (dto) => {
  const response = http.request({
    method: 'POST',
    url: 'auth/change-password',
    data: dto
  });

  return response;
}
