import { endpoints } from '../lib/http/endpoints.js';
export const bookingRequests = {
  getRooms: (id) => ({
    method: 'GET',
    url: endpoints.booking.getRooms(id)
  }),
  addBooking: (dto) => ({
    method: 'POST',
    url: endpoints.booking.addBooking(),
    data: dto
  }),
  addSurcharge: (dto) => ({
    method: 'POST',
    url: endpoints.booking.addSurcharge(),
    data: dto
  }),
  addNote: (id, dto) => ({
    method: 'POST',
    url: endpoints.booking.addNote(id),
    data: dto
  }),
  addUtility: (dto) => ({
    method: 'POST',
    url: endpoints.booking.addUtility(),
    data: dto
  }),
  removeUtility: (dto) => ({
    method: 'DELETE',
    url: endpoints.booking.removeUtility(),
    data: dto
  }),
  removeBooking: (id) => ({
    method: 'DELETE',
    url: endpoints.booking.removeBooking(id)
  }),
  getBooking: (id) => ({
    method: 'GET',
    url: endpoints.booking.getBooking(id)
  })
};
