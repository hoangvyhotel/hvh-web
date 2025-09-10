import RoomItem from '../../../components/items/RoomItem';
import Header from '../../../layouts/HotelManagementLayout/Header';
import RoomModal from '../../../components/modals/RoomModal';
import { useEffect, useState } from 'react';
import { House } from 'lucide-react';
import { fetchRoomsByHotelId, addRoom, updateRoom, updateStatusRoom } from 'services/roomService';
import { useHotelState } from 'hooks/useAuth';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { hotelId } = useHotelState();

  // Load danh sách phòng khi component mount hoặc hotelId thay đổi
  useEffect(() => {
    const loadRooms = async () => {
      if (hotelId) {
        try {
          setLoading(true);
          console.log('Fetching rooms...');
          const roomData = await fetchRoomsByHotelId(hotelId);
          console.log('Room data fetched:', roomData);
          if (roomData) {
            setRooms(roomData);
          }
        } catch (error) {
          console.error('Error fetching rooms:', error);
          toast.error('Không thể tải danh sách phòng');
        } finally {
          setLoading(false);
        }
      }
    };

    loadRooms();
  }, [hotelId]);

  // Hàm tiện ích để refresh danh sách phòng
  const refreshRooms = async () => {
    try {
      const updatedRoomData = await fetchRoomsByHotelId(hotelId);
      if (updatedRoomData) {
        setRooms(updatedRoomData);
      }
    } catch (error) {
      console.error('Error refreshing rooms:', error);
      toast.error('Không thể tải lại danh sách phòng');
    }
  };

  // Xử lý mở modal thêm phòng
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  // Xử lý mở modal sửa phòng
  const handleEditRoom = (room) => {
    console.log('Room đã chọn để edit:', room);
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // Xử lý tạo phòng mới
  const handleCreateRoom = async (roomData) => {
    try {
      console.log('Creating new room:', roomData);
      const response = await addRoom({ ...roomData, hotelId });

      if (response?.data) {
        // Refresh danh sách phòng
        await refreshRooms();
        handleCloseModal();
        toast.success('Thêm phòng mới thành công!');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Thêm phòng thất bại';
      toast.error(errorMessage);
    }
  };

  // Xử lý cập nhật phòng
  const handleUpdateRoom = async (roomData) => {
    try {
      console.log('Updating room:', roomData);
      const response = await updateRoom(roomData.id, roomData);

      if (response?.data) {
        // Refresh danh sách phòng
        await refreshRooms();
        handleCloseModal();
        toast.success(`Cập nhật phòng ${roomData.name || roomData.roomNumber} thành công!`);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Cập nhật phòng thất bại';
      toast.error(errorMessage);
    }
  };

  // Xử lý cập nhật trạng thái phòng
  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      console.log('Updating room status:', { roomId, newStatus });
      const response = await updateStatusRoom(roomId, newStatus);

      if (response) {
        // Cập nhật state local ngay lập tức để UI responsive
        setRooms(rooms.map((room) => (room.id === roomId ? { ...room, status: newStatus } : room)));
        toast.success('Cập nhật trạng thái phòng thành công!');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Cập nhật trạng thái phòng thất bại';
      toast.error(errorMessage);

      // Refresh lại danh sách để đảm bảo data consistency
      await refreshRooms();
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
          <button
            className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
            onClick={handleAddRoom}
            disabled={loading}
          >
            Thêm phòng
          </button>
        </div>

        <div className="mt-4">
          {/* Header Table */}
          <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
            <div className="col-span-1">Phòng</div>
            <div className="col-span-2 flex">Tầng</div>
            <div className="col-span-2 flex justify-center">Giá</div>
            <div className="col-span-6 flex justify-center">Tình trạng</div>
          </div>

          {/* Room List */}
          <div className="bg-white">
            {loading ? (
              <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div>
            ) : rooms.length > 0 ? (
              rooms.map((room, index) => (
                <RoomItem key={room.id} room={room} onEdit={handleEditRoom} onUpdateStatus={handleUpdateStatus} index={index} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Room Modal */}
        <RoomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          room={selectedRoom}
          onCreate={handleCreateRoom}
          onUpdate={handleUpdateRoom}
        />
      </div>
    </>
  );
};

export default RoomManagement;
