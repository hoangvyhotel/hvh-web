import { useHotelState } from 'hooks/useAuth';
import Header from '../../../../layouts/HotelManagementLayout/Header';
import { http } from 'lib/http/axios';
import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { roomRequests } from 'services/roomService';

const RoomPriceUpdate = () => {
  const [priceType, setPriceType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newNextHourPrice, setNewNextHourPrice] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hotelId } = useHotelState();

  const getFloorName = (floorNumber) => {
    return floorNumber === 0 ? 'Tầng trệt' : `Tầng ${floorNumber}`;
  };

  const fetchRoomsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http(roomRequests.getAll(hotelId, 'true'));
      if (res.data.succeeded) {
        setRoomsData(res.data.data);
      } else {
        setError('Không thể tải danh sách phòng');
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu phòng:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsData();
  }, []);

  const generateFloorsFromData = () => {
    const floorsMap = {};

    roomsData.forEach((room) => {
      const floor = room.floor;
      if (!floorsMap[floor]) {
        floorsMap[floor] = [];
      }
      floorsMap[floor].push(room.id);
    });

    return Object.keys(floorsMap)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((floor) => ({
        floor: parseInt(floor),
        rooms: floorsMap[floor]
      }));
  };

  const floors = generateFloorsFromData();
  const allRooms = floors.flatMap((floor) => floor.rooms);

  const handleRoomChange = (room) => {
    if (room === 'all') {
      if (selectedRooms.length === allRooms.length) {
        setSelectedRooms([]);
      } else {
        setSelectedRooms([...allRooms]);
      }
    } else {
      if (selectedRooms.includes(room)) {
        setSelectedRooms(selectedRooms.filter((r) => r !== room));
      } else {
        setSelectedRooms([...selectedRooms, room]);
      }
    }
  };

  const handleFloorChange = (floorRooms) => {
    const allFloorRoomsSelected = floorRooms.every((room) => selectedRooms.includes(room));

    if (allFloorRoomsSelected) {
      setSelectedRooms(selectedRooms.filter((room) => !floorRooms.includes(room)));
    } else {
      const newSelectedRooms = [...selectedRooms];
      floorRooms.forEach((room) => {
        if (!newSelectedRooms.includes(room)) {
          newSelectedRooms.push(room);
        }
      });
      setSelectedRooms(newSelectedRooms);
    }
  };

  const handleSubmit = async () => {
    if (!priceType || !newPrice || selectedRooms.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin và chọn ít nhất một phòng');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        typePrice: priceType,
        data: selectedRooms.map((roomId) => {
          if (priceType === 'hours') {
            return {
              roomId: roomId,
              newPrice: parseInt(newPrice),
              newNextHourPrice: parseInt(newNextHourPrice)
            };
          } else {
            return {
              roomId: roomId,
              newPrice: parseInt(newPrice)
            };
          }
        })
      };

      // Gọi API update giá
      const response = await http(roomRequests.updateRangePrice(updateData));

      if (response.data.succeeded) {
        toast(response.data.message);
        // Reset form
        setPriceType('');
        setNewPrice('');
        setSelectedRooms([]);
      } else {
        throw new Error(response.data.message || 'Cập nhật giá thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật giá:', error);
      alert(`Lỗi: ${error.message || 'Không thể cập nhật giá'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-md font-semibold text-red-800 mb-2">Lỗi</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={fetchRoomsData} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="border-b border-gray-300 mb-4" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Quản lý giá phòng" icon={<Tag className="w-6 h-6 mr-2 text-blue-600" />} />
      </div>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin giá</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Loại giá cần cập nhật</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
              >
                <option value="">Chọn giá cần cập nhật</option>
                <option value="hours">Giá giờ</option>
                <option value="night">Giá đêm</option>
                <option value="day">Giá ngày</option>
              </select>
            </div>

            {/* Nếu là giá giờ thì hiện 2 input */}
            {priceType === 'hours' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Giá giờ đầu (VND)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Nhập giá giờ đầu"
                    min="0"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Giá giờ sau (VND)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={newNextHourPrice}
                    onChange={(e) => setNewNextHourPrice(e.target.value)}
                    placeholder="Nhập giá giờ sau"
                    min="0"
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {priceType === 'day' ? 'Giá ngày (VND)' : priceType === 'night' ? 'Giá đêm (VND)' : 'Giá mới (VND)'}
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Nhập giá mới"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Áp dụng cho phòng</h2>
            <p className="text-sm text-gray-500 mb-4">Chọn phòng sẽ áp dụng mức giá mới</p>

            <div className="mb-4 p-3 bg-white rounded border border-gray-200">
              <label className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600"
                  checked={selectedRooms.length === allRooms.length}
                  onChange={() => handleRoomChange('all')}
                />
                <span className="font-medium">Chọn tất cả phòng</span>
              </label>
            </div>

            <div className="h-64 overflow-y-auto p-3 bg-white rounded border border-gray-200">
              {floors.map((floor) => {
                const allFloorRoomsSelected = floor.rooms.every((room) => selectedRooms.includes(room));
                const someFloorRoomsSelected = floor.rooms.some((room) => selectedRooms.includes(room));

                return (
                  <div key={floor.floor} className="mb-4 last:mb-0">
                    <label className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={allFloorRoomsSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = someFloorRoomsSelected && !allFloorRoomsSelected;
                          }
                        }}
                        onChange={() => handleFloorChange(floor.rooms)}
                      />
                      <span className="font-medium text-gray-800">{getFloorName(floor.floor)}</span>
                      <span className="text-sm text-gray-500">({floor.rooms.length} phòng)</span>
                    </label>

                    <div className="grid grid-cols-5 gap-2 ml-6">
                      {floor.rooms.map((room) => {
                        const roomInfo = roomsData.find((r) => r.id === room);
                        return (
                          <label key={room} className="flex items-center gap-2 p-1 hover:bg-blue-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600"
                              checked={selectedRooms.includes(room)}
                              onChange={() => handleRoomChange(room)}
                            />
                            <span className="text-sm" title={roomInfo?.description || ''}>
                              {roomInfo?.name || room}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-sm text-gray-500">Đã chọn: {selectedRooms.length} phòng</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-md font-semibold text-blue-800 mb-2">Xác nhận thay đổi</h3>
          <p className="text-sm text-blue-600">
            Sau khi nhấn Lưu, giá phòng sẽ được cập nhật theo thiết lập của bạn. Thao tác này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleSubmit}
            disabled={!priceType || !newPrice || selectedRooms.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomPriceUpdate;
