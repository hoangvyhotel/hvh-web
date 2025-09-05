import RoomItem from '../../../components/items/RoomItem';
import Header from '../../../layouts/HotelManagementLayout/Header';
import RoomModal from '../../../components/modals/RoomModal';
import { useEffect, useState } from 'react';
import { House } from 'lucide-react';
import { fetchRoomsByHotelId, addRoom, updateRoom, updateStatusRoom } from 'services/roomService';
import { useHotelState } from 'hooks/useAuth';

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  const { hotelId } = useHotelState();

  const fetchRooms = async () => {
    try {
      console.log('Fetching rooms...');
      const roomData = await fetchRoomsByHotelId(hotelId);
      console.log('Room data fetched:', roomData);
      if (roomData) {
        setRooms(roomData);
      }
    } catch (error) {
      throw new Error('Failed to fetch rooms', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (roomData) => {
    try {
      console.log('Saving room data:', roomData);
      if (selectedRoom) {
        // Update existing room
        const updatedRoom = await updateRoom(selectedRoom.id, roomData);
        setRooms(rooms.map((room) => (room.id === selectedRoom.id ? updatedRoom.data : room)));
        console.log('Room updated successfully:', updatedRoom);
      } else {
        // Add new room
        const newRoom = await addRoom(roomData);
        setRooms([...rooms, newRoom.data]);
        console.log('Room added successfully:', newRoom);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving room:', error);
      // TODO: Add error handling/notification
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      console.log('Deleting room with ID:', roomId);
      const response = await updateStatusRoom(roomId, false); // Soft delete by updating status
      console.log('Room deleted (status updated) successfully:', response);
      // Reload data after successful status update
      await fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      // TODO: Add error handling/notification
    }
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      console.log('Updating room status:', roomId, newStatus);
      const response = await updateStatusRoom(roomId, newStatus);
      console.log('Room status updated successfully:', response);
      // Reload data after successful status update
      await fetchRooms();
    } catch (error) {
      console.error('Error updating room status:', error);
      // TODO: Add error handling/notification
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="border-b border-gray-300 mb-8" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Danh sách phòng" icon={<House className="w-6 h-6 text-gray-600 mr-2" />} />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div></div>
          <button className="px-4 py-2 bg-green-600 rounded text-white hover:bg-gray-500 transition-colors" onClick={handleAddRoom}>
            Thêm phòng
          </button>
        </div>

        <div className="mt-4">
          {/* Header Table */}
          <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
            <div className="col-span-1">Phòng</div>
            <div className="col-span-1">Tầng</div>
            <div className="col-span-5">Giá</div>
            <div className="col-span-2">Tình trạng</div>
            <div className="col-span-3 text-center">Actions</div>
          </div>

          {/* Room List */}
          <div className="bg-white">
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <RoomItem
                  key={room.id}
                  room={room}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                  onUpdateStatus={handleUpdateStatus}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">Không có dữ liệu</div>
            )}
          </div>

          {/* Add Button positioned at bottom right */}
        </div>

        {/* Room Modal */}
        <RoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          room={selectedRoom}
          onSave={handleSaveRoom}
          onKeyDown={handleEscapeKey}
        />
      </div>
    </>
  );
};

export default RoomManagement;
