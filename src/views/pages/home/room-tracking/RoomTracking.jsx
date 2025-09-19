import { useState, useEffect } from 'react';
import { bookingRequests } from 'services/bookingService';
import { http } from 'lib/http/axios';
import { resolveIcon } from 'utils/iconResolver';
import IconErrorBoundary from 'components/IconErrorBoundary';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useHotelState } from 'hooks/useAuth';

const getCardColor = (status, typeBooking) => {
  if (status === 'FREE') return 'bg-[#ADDDC0]';
  if (status === 'CHECKIN') {
    if (typeBooking === 'DAY') return 'bg-red-400';
    if (typeBooking === 'NIGHT') return 'bg-lime-300';
    if (typeBooking === 'HOUR') return 'bg-pink-300';
  }
  return 'bg-gray-100';
};

const RoomCard = ({ room, handleAddBooking, handleRouteToCheckinZone, fetchData }) => {
  const color = getCardColor(room.Status, room.TypeBooking);
  return (
    <div
      className={`rounded-xl shadow-lg p-6 min-h-[260px] w-full flex flex-col justify-between text-center ${color}`}
    >
      <div className="flex flex-col gap-1">
        <div className="font-extrabold text-2xl min-h-[32px]">{room.RoomName}</div>
      </div>

      <div className="flex flex-col gap-2">
        {room.Status === 'FREE' ? (
          <div className="flex gap-2 justify-center">
            <button
              className="px-2 py-1 bg-white border rounded text-pink-600 font-semibold flex-1 cursor-pointer"
              onClick={() => handleAddBooking('HOUR', room.RoomId, fetchData, room.HotelId)}
            >
              Giờ
            </button>
            <button
              className="px-2 py-1 bg-white border rounded text-pink-600 font-semibold flex-1 cursor-pointer"
              onClick={() => handleAddBooking('DAY', room.RoomId, fetchData, room.HotelId)}
            >
              Ngày
            </button>
            <button
              className="px-2 py-1 bg-white border rounded text-pink-600 font-semibold flex-1 cursor-pointer"
              onClick={() => handleAddBooking('NIGHT', room.RoomId, fetchData, room.HotelId)}
            >
              Đêm
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div
              className={`text-xs font-semibold ${
                room.TypeBooking === 'DAY'
                  ? 'text-red-700'
                  : room.TypeBooking === 'NIGHT'
                  ? 'text-green-700'
                  : 'text-yellow-700'
              } min-h-[24px]`}
            > 
              Giờ vào từ:{' '}
              {room.Checkin
                ? new Date(room.Checkin).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </div>

            <button
              className={`px-2 py-1 bg-white border rounded font-semibold mt-1 cursor-pointer ${
                room.TypeBooking === 'DAY'
                  ? 'text-red-600'
                  : room.TypeBooking === 'NIGHT'
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}
              onClick={() => handleRouteToCheckinZone(room.RoomId, room.HotelId)}
            >
              {room.TypeBooking === 'DAY'
                ? 'Ngày'
                : room.TypeBooking === 'NIGHT'
                ? 'Đêm'
                : 'Giờ'}
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 italic min-h-[20px]">
        {room.Description || '-'}
      </div>

      <div className="flex gap-1 flex-wrap justify-center overflow-auto min-h-[28px]">
        {room.Utilities && room.Utilities.length > 0 ? (
          room.Utilities.map((u, idx) => {
            const parseIconVal = (val) => {
              if (val == null) return '';
              if (typeof val === 'object') return val;
              if (typeof val === 'string') {
                try {
                  return JSON.parse(val);
                } catch (e) {
                  try {
                    return JSON.parse(val.replace(/'/g, '"'));
                  } catch (e2) {
                    return val;
                  }
                }
              }
              return '';
            };

            const iconVal = parseIconVal(u.icon ?? u.Icon ?? u.IconName ?? u.IconKey);
            const displayName = u.name || u.Name || u.title || u.NameEn || '';
            return (
              <span
                key={idx}
                className="flex items-center gap-1 text-xs bg-gray-100 px-1 py-0.5 rounded text-[10px]"
              >
                <IconErrorBoundary fallback={<span style={{ width: 12, display: 'inline-block' }} />}>
                  {resolveIcon(iconVal || u.icon, { size: 12, className: 'text-gray-600' })}
                </IconErrorBoundary>
                <span className="text-[10px] text-gray-700">{displayName}</span>
                <span className="text-[10px] text-gray-500">x{u.Quantity}</span>
              </span>
            );
          })
        ) : (
          <span className="text-xs text-gray-400"></span>
        )}
      </div>
    </div>
  );
};

const RoomTracking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hotelId } = useHotelState();

  const navigate = useNavigate(); // ✅ đặt ở đây

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http(
        bookingRequests.getRooms(hotelId)
      );
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBooking = async (type, roomId, fetchData, hotelId) => {
    try {
      const dto = {
        roomId: roomId,
        type: type.toUpperCase(),
      };

      const res = await http(bookingRequests.addBooking(dto));
      toast.success(res.message);
      fetchData();
      handleRouteToCheckinZone(roomId, hotelId);
    } catch (err) {
      console.error(err);
      toast.error('Đặt phòng thất bại!');
    }
  };

  const handleRouteToCheckinZone = (roomId, hotelId) => {
    navigate(`/pages/management/checkin-zone?roomId=${roomId}&hotelId=${hotelId}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  const floors = {};
  bookings.forEach((room) => {
    if (!floors[room.Floor]) floors[room.Floor] = [];
    floors[room.Floor].push(room);
  });

  Object.keys(floors).forEach((floor) => {
    floors[floor].sort((a, b) => a.RoomId.localeCompare(b.RoomId));
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {Object.keys(floors)
        .sort((a, b) => Number(a) - Number(b))
        .map((floor) => (
          <div key={floor} className="mb-8">
            <div className="font-bold text-lg mb-4 text-center">Tầng {floor}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {floors[floor].map((room) => (
                <RoomCard
                  key={room.RoomId}
                  room={room}
                  fetchData={fetchData}
                  handleAddBooking={handleAddBooking}
                  handleRouteToCheckinZone={handleRouteToCheckinZone}
                />
              ))}
            </div>
          </div>
        ))}
      <Outlet />
    </div>
  );
};

export default RoomTracking;
