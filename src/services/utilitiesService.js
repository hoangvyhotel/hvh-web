import { endpoints } from '../lib/http/endpoints';
import { toQuery } from '../lib/http/utils';

export const utilitiesRequests = {
  list: (id) => {
    const p = { hotelId: id ?? DEFAULT_HOTEL_ID };
    return { method: 'GET', url: endpoints.utilities.list() + toQuery(p) };
  },
  get: (id) => ({ method: 'GET', url: endpoints.utilities.detail(id) }),
  create: (dto = {}) => ({ method: 'POST', url: endpoints.utilities.root(), data: { ...dto } }),
  update: (id, dto = {}) => ({ method: 'PUT', url: endpoints.utilities.detail(id), data: { ...dto } }),
  remove: (id) => ({ method: 'DELETE', url: endpoints.utilities.detail(id) })
};
