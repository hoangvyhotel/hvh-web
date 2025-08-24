import RoomItem from '../../../components/items/RoomItem';
import AddButton from '../../../layouts/HotelManagementLayout/AddButton';
import Header from '../../../layouts/HotelManagementLayout/Header';
import RoomModal from '../../../components/modals/RoomModal';
import { useState } from 'react';
import { House } from 'lucide-react';

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([
    {
      id: '001',
      floor: 0,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'maintenance', // bảo trì
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '101',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'operating', // đang hoạt động
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '102',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 180000,
      dailyPrice: 300000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '103',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 350000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '201',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 350000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '202',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 180000,
      dailyPrice: 300000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '203',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'maintenance',
      actions: ['UPDATE', 'DELETE']
    }
  ]);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleSaveRoom = (roomData) => {
    if (selectedRoom) {
      // Update existing room
      setRooms(rooms.map((room) => (room.id === selectedRoom.id ? { ...room, ...roomData } : room)));
    } else {
      // Add new room
      setRooms([...rooms, { ...roomData, status: 'operating', actions: ['UPDATE', 'DELETE'] }]);
    }
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
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
          <div>Time</div>
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
            {rooms.map((room, index) => (
              <RoomItem key={room.id} room={room} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
            ))}
          </div>

          {/* Add Button positioned at bottom right */}
          <div className="flex justify-end mt-12">
            <AddButton onClick={handleAddRoom} />
          </div>
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
