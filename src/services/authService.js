import { endpoints } from '../lib/http/endpoints';

export const authRequests = {
  login: (dto) => ({ method: 'POST', url: endpoints.auth.login(), data: dto }),
  me: () => ({ method: 'GET', url: endpoints.auth.me() }),
  register: (dto) => ({ method: 'POST', url: endpoints.auth.register(), data: dto })
};
