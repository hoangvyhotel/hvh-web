import { endpoints } from '../lib/http/endpoints';
import { toQuery } from '../lib/http/utils';

const DEFAULT_HOTEL_ID = '60d5ecb54b24c2001f6479a1';

export const utilitiesRequests = {
  list: (params = {}) => {
    const p = { hotelId: DEFAULT_HOTEL_ID, ...params };
    return { method: 'GET', url: endpoints.utilities.list() + toQuery(p) };
  },
  get: (id) => ({ method: 'GET', url: endpoints.utilities.detail(id) }),
  create: (dto = {}) => ({ method: 'POST', url: endpoints.utilities.root(), data: { hotelId: DEFAULT_HOTEL_ID, ...dto } }),
  update: (id, dto = {}) => ({ method: 'PUT', url: endpoints.utilities.detail(id), data: { hotelId: DEFAULT_HOTEL_ID, ...dto } }),
  remove: (id) => ({ method: 'DELETE', url: endpoints.utilities.detail(id) })
};
