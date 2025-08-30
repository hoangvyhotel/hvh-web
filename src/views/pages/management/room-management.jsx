import RoomItem from '../../../components/items/RoomItem';
import Header from '../../../layouts/HotelManagementLayout/Header';
import RoomModal from '../../../components/modals/RoomModal';
import { useEffect, useState } from 'react';
import { House } from 'lucide-react';
import { fetchRoomsByHotelId, addRoom, updateRoom, updateStatusRoom } from 'services/roomService';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    console.log('Fetching rooms...');
    const roomData = await fetchRoomsByHotelId('68a6b81c9924e1f3880ce291', 'true');
    if (roomData) {
      setRooms(roomData);
      toast.success(`Đã tải dữ liệu phòng thành công!`);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditRoom = (room) => {
    console.log(`Room đã chọn để edit:`, room);
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleCreateRoom = async (roomData) => {
    try {
      console.log('Creating new room:', roomData);
      const newRoom = await addRoom(roomData);
      setRooms([...rooms, newRoom.data]);
      toast.success(`Thêm phòng mới thành công!`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleUpdateRoom = async (roomData) => {
    try {
      const updatedRoom = await updateRoom(roomData.id, roomData);
      setRooms(rooms.map((room) => (room.id === roomData.id ? updatedRoom.data : room)));
      toast.success(`Cập nhật phòng ${updatedRoom.data.name} thành công!`);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      await updateStatusRoom(roomId, newStatus);
      setRooms(rooms.map((room) => (room.id === roomId ? { ...room, status: newStatus } : room)));
      toast.success(`Cập nhật trạng thái phòng thành công!`);
    } catch (error) {
      console.error('Error updating room status:', error);
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
            <div className="col-span-1 flex justify-center">Tầng</div>
            <div className="col-span-5 flex justify-center">Giá</div>
            <div className="col-span-2 flex justify-center">Tình trạng</div>
            <div className="col-span-3 text-center">Actions</div>
          </div>

          {/* Room List */}
          <div className="bg-white">
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <RoomItem key={room.id} room={room} onEdit={handleEditRoom} onUpdateStatus={handleUpdateStatus} index={index} />
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
          onCreate={handleCreateRoom}
          onUpdate={handleUpdateRoom}
        />
      </div>
    </>
  );
};

export default RoomManagement;
