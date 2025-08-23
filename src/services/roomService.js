import { endpoints } from '../lib/http/endpoints.js';
export const roomRequests = {
  getAll: (id, isGetAll) => ({
    method: 'GET',
    url: endpoints.room.getAlls(id, isGetAll),
  }),
  updateRangePrice: (dto) => ({
    method: 'PATCH',
    url: endpoints.room.updateRangePrice(),
    data: dto,
  })
}