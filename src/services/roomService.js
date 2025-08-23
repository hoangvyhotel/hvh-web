import { http } from 'lib/http/axios.js';
import { endpoints } from '../lib/http/endpoints.js';

export const roomRequests = {
  fetchRoomsByHotelId: (hotelId) => ({
    method: 'GET',
    url: endpoints.room.getRoomsByHotelId(hotelId),
  }),
  getAll: (id, isGetAll) => ({
    method: 'GET',
    url: endpoints.room.getAlls(id, isGetAll),
  }),
  updateRangePrice: (dto) => ({
    method: 'PATCH',
    url: endpoints.room.updateRangePrice(),
    data: dto,
  }),
  addRoom: (roomData) => ({
    method: 'POST',
    url: endpoints.room.add(),
    data: roomData
  }),
  updateRoom: (roomId, roomData) => ({
    method: 'PUT',
    url: endpoints.room.update(roomId),
    data: roomData
  }),
  updateStatusRoom: (roomId, status) => ({
    method: 'PATCH',
    url: endpoints.room.updateStauts(roomId),
    data: { status }
  }),
  deleteRoom: (roomId) => ({
    method: 'DELETE',
    url: endpoints.room.delete(roomId)
  })
};

export const fetchRoomsByHotelId = async (hotelId) => {
  const response = await http(roomRequests.fetchRoomsByHotelId(hotelId));
  return response.data.data;
};

export const addRoom = async (roomData) => {
  const response = await http(roomRequests.addRoom(roomData));
  return response.data;
};

export const updateRoom = async (roomId, roomData) => {
  const response = await http(roomRequests.updateRoom(roomId, roomData));
  return response.data;
};

export const updateStatusRoom = async (roomId, status) => {
  const response = await http(roomRequests.updateStatusRoom(roomId, status));
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await http(roomRequests.deleteRoom(roomId));
  return response.data;
};
