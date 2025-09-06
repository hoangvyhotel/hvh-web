import { http } from 'lib/http/axios';
import { Home, Car, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingRequests } from 'services/bookingService';
import SurchargeModal from './modal-actions/surcharge-modal';
import NoteModal from './modal-actions/note-modal';
import { toast } from 'react-toastify';
import { utilitiesRequests } from 'services/utilitiesService';
import { roomRequests } from 'services/roomService';
import MoveRoomModal from './modal-actions/move-room-modal';
function translateBookingType(type) {
  switch (type.toLowerCase()) {
    case 'day':
      return 'Ngày';
    case 'night':
      return 'Đêm';
    case 'hour':
      return 'Giờ';
    default:
      return 'Không xác định';
  }
}

const CheckinPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const hotelId = searchParams.get('hotelId');
  const [booking, setBooking] = useState(null);
  const [utilities, setUtilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSurchargeOpen, setIsSurchargeOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [isMoveRoomOpen, setIsMoveRoomOpen] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  useEffect(() => {
    const fetchBooking = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        setError(null);

        const res = await http(bookingRequests.getBooking(roomId));
        setBooking(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [roomId]);

  useEffect(() => {
    const fetchUtilities = async () => {
      if (!hotelId) return;
      try {
        const res = await http(utilitiesRequests.list(hotelId));
        setUtilities(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Không thể tải tiện ích');
      }
    };

    fetchUtilities();
  }, [hotelId]);

  useEffect(() => {
    if (isNoteOpen) {
      http.get(`/booking/get-note/${booking.BookingId}`).then((res) => {
        if (res.data?.succeeded) {
          setNoteData(res.data.data);
        }
      });
    }
  }, [isNoteOpen, booking]);
  const fetchAvailableRooms = async () => {
    if (!hotelId) return;
    try {
      const res = await http(roomRequests.getRoomAvailable(roomId, hotelId)); // giả sử API này trả về danh sách phòng
      setAvailableRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách phòng');
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!booking) return <div className="p-4 text-center">Không có dữ liệu</div>;
  return (
    <>
      <div className="bg-gray-100 min-h-screen font-sans">
        {/* Top Bar */}
        <div className="bg-[#ADDDC0] text-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <button className="text-2xl p-2 rounded-full hover:bg-gray-200 transition-colors bg-white cursor-pointer">
              <Home />
            </button>
            <span className="text-xl font-semibold">Về Trang Chủ</span>
          </div>
          <div className="text-2xl font-bold">{booking.RoomName || ''}</div>
          <div className="flex items-center space-x-2"></div>
        </div>

        {/* Main Content Area with 60:40 Split */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column (60%) */}
          <div className="lg:col-span-7">
            {/* Booking Info Card */}
            <div className="bg-white rounded-lg shadow-md border border-green-500 mb-4">
              {/* Hàng 1 - Thông tin thuê */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-green-500 p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-lg font-bold">THUÊ THEO:</span>
                  <button className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-md font-bold cursor-pointer">
                    {translateBookingType(booking.TypeBooking) || ''}
                  </button>
                  <span className="text-lg font-bold">LÚC:</span>
                  <span className="font-semibold">
                    {new Date(booking.CheckinDate).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                  <button
                    className="bg-yellow-500 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer w-full sm:w-auto"
                    onClick={() => setIsSurchargeOpen(true)}
                  >
                    Phụ Thu
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer w-full sm:w-auto"
                    onClick={() => setIsNoteOpen(true)}
                  >
                    Ghi chú
                  </button>
                </div>
              </div>

              {/* Hàng 2 - Giấy tờ & Xe */}
              <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-green-500 p-2 sm:p-4">
                <div className="flex flex-col items-center p-2">
                  <div className="text-3xl sm:text-5xl text-green-600">
                    <FileText />
                  </div>
                  <span className="mt-1 font-bold text-sm sm:text-base">Giấy tờ</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <div className="text-3xl sm:text-5xl text-green-600">
                    <Car />
                  </div>
                  <span className="mt-1 font-bold text-sm sm:text-base">Xe</span>
                </div>
              </div>

              {/* Hàng 3 - Các tiện ích khác */}
              <div className="flex flex-wrap justify-start border-b border-green-500 p-2 sm:p-4">
                {booking.Utilities?.map((u, index) => {
                  // icon từ lucide-react
                  let IconComp;
                  try {
                    const { [u.Icon]: LucideIcon } = require('lucide-react');
                    IconComp = LucideIcon || Car;
                  } catch {
                    IconComp = Car;
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center p-2 relative w-16 sm:w-24 cursor-pointer"
                      onClick={async () => {
                        try {
                          if (!booking.BookingId) return;

                          const dto = {
                            bookingId: booking.BookingId,
                            utilityId: u._id, // hoặc u.utilitiesId nếu bạn lưu ObjectId
                            quantity: 1
                          };

                          // gọi API removeUtility
                          const res = await http(bookingRequests.removeUtility(dto));

                          // reload lại booking để cập nhật UI
                          const updated = await http(bookingRequests.getBooking(roomId));
                          setBooking(updated.data.data);
                          toast.success(res.data.message || 'Đã giảm/xóa tiện ích thành công');
                        } catch (err) {
                          console.error(err);
                          toast.error('Xử lý tiện ích thất bại');
                        }
                      }}
                    >
                      {/* Hiển thị số lượng */}
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-400 text-white rounded-full h-4 sm:h-6 w-4 sm:w-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                        {u.Quantity}
                      </div>

                      {/* Icon */}
                      <div className="text-2xl sm:text-4xl text-green-600">{IconComp ? <IconComp /> : <Car />}</div>

                      {/* Tên tiện ích */}
                      <span className="mt-1 text-xs sm:text-sm">{u.Name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  className="cursor-pointer bg-red-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"
                  onClick={async () => {
                    if (!booking?.BookingId) return;
                    try {
                      if (!window.confirm('Bạn có chắc muốn hủy phòng này không?')) return;

                      // gọi API xóa booking
                      const res = await http(bookingRequests.removeBooking(booking.BookingId));
                      toast.success(res.data.message || 'Hủy phòng thành công');
                      navigate('/pages/home/room-tracking');

                      // cập nhật UI: xóa booking khỏi state
                      setBooking(null);
                    } catch (err) {
                      console.error(err);
                      toast.error('Hủy phòng thất bại');
                    }
                  }}
                >
                  HỦY PHÒNG
                </button>

                <button
                  className="cursor-pointer bg-yellow-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-yellow-600 transition-colors w-full sm:w-auto"
                  onClick={async () => {
                    await fetchAvailableRooms();
                    setIsMoveRoomOpen(true);
                  }}
                >
                  ĐỔI PHÒNG
                </button>
              </div>
              <button className="cursor-pointer bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                TRẢ PHÒNG
              </button>
            </div>{' '}
          </div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-5">
            {/* Service Icons */}
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 space-y-2 sm:space-y-4">
              {/* Nhóm trên: Giấy tờ & Xe */}
              <div className="grid grid-cols-2 sm:grid-cols-5 border border-green-500 rounded-md p-1 sm:p-2">
                <div className="flex flex-col items-center p-1 sm:p-2">
                  <div className="text-xl sm:text-2xl text-green-600 cursor-pointer">
                    <FileText />
                  </div>
                  <span className="text-xs sm:text-sm mt-1">Giấy tờ</span>
                </div>
                <div className="flex flex-col items-center p-1 sm:p-2">
                  <div className="text-xl sm:text-2xl text-green-600">
                    <Car />
                  </div>
                  <span className="text-xs sm:text-sm mt-1 cursor-pointer">Xe</span>
                </div>
                {/* 3 ô trống trên điện thoại */}
                <div className="hidden sm:block col-span-3"></div>
              </div>

              {/* Nhóm dưới: Nước & Đồ ăn */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-green-500 rounded-md p-1 sm:p-2">
                {utilities.map((u) => {
                  // icon động
                  let IconComp;
                  try {
                    const { [u.icon]: LucideIcon } = require('lucide-react');
                    IconComp = LucideIcon || Car; // fallback Car
                  } catch {
                    IconComp = Car;
                  }

                  return (
                    <div
                      key={u._id}
                      className="flex flex-col items-center p-1 sm:p-2"
                      onClick={async () => {
                        try {
                          if (!booking.BookingId) return;

                          const dto = {
                            bookingId: booking.BookingId, // id booking
                            utilityId: u._id, // id utility
                            quantity: 1 // mặc định 1, có thể tùy chỉnh
                          };

                          const res = await http(bookingRequests.addUtility(dto));
                          // reload lại booking để cập nhật UI
                          const updated = await http(bookingRequests.getBooking(roomId));
                          setBooking(updated.data.data);
                          toast.success(res.data.message || 'Thêm tiện ích thành công');
                        } catch (err) {
                          console.error(err);
                          toast.error('Thêm tiện ích thất bại');
                        }
                      }}
                    >
                      <div className="text-xl sm:text-2xl text-green-600 cursor-pointer">{IconComp ? <IconComp /> : <Car />}</div>
                      <span className="text-xs sm:text-sm mt-1">{u.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Info */}
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
              <div className="divide-y divide-green-500 border border-green-500 rounded-md">
                {/* BookingPricing */}

                {booking.BookingPricing?.map((bp, index) => (
                  <div key={index} className="p-2 sm:p-4">
                    <div className="text-gray-500 text-sm mt-1">
                      Giờ vào:{' '}
                      {new Date(bp.StartDate).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>

                    {bp.EndDate && (
                      <div className="text-gray-500 text-sm">
                        Kết thúc:{' '}
                        {new Date(bp.EndDate).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    )}

                    {/* Render History */}
                    {bp.History?.length > 0 && (
                      <div className="mt-3 border-l-2 border-green-500 pl-3">
                        <span className="text-gray-600 font-semibold block mb-1">Lịch sử giá:</span>
                        <ul className="space-y-2">
                          {bp.History.map((h, hIndex) => (
                            <li key={hIndex} className="bg-gray-50 p-2 rounded text-sm flex flex-col">
                              <div className="flex justify-between">
                                <span className="font-bold text-green-700">{translateBookingType(h.PriceType)}</span>
                                <span className="font-bold text-green-700">{h.Amount?.toLocaleString('vi-VN')} đ</span>
                              </div>

                              <span className="text-gray-500 text-xs">
                                Từ:{' '}
                                {new Date(h.AppliedFrom).toLocaleString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </span>
                              {h.AppliedTo && (
                                <span className="text-gray-500 text-xs">
                                  Đến:{' '}
                                  {new Date(h.AppliedTo).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </span>
                              )}

                              <span className="text-gray-500 text-xs mt-1">
                                Số giờ: <b>{h.Times}</b> giờ
                              </span>

                              {/* Nếu là HOUR thì hiển thị giá giờ đầu / giờ sau */}
                              {h.PriceType === 'HOUR' && (
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Giờ đầu: {h.AppliedFirstHourPrice?.toLocaleString('vi-VN')} đ</div>
                                  <div>Giờ tiếp: {h.AppliedNextHourPrice?.toLocaleString('vi-VN')} đ</div>
                                </div>
                              )}

                              {/* Nếu là NIGHT thì hiển thị giá ban đêm */}
                              {h.PriceType === 'NIGHT' && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Giá ban đêm: {h.AppliedNightPrice?.toLocaleString('vi-VN')} đ
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Surcharge */}
                {booking.Surcharge?.length > 0 && (
                  <div className="p-2 sm:p-4">
                    <span className="text-gray-600 font-semibold block mb-2">Phụ thu:</span>
                    {booking.Surcharge.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{s.Content}</span>
                        <span className="font-bold">{s.Amount?.toLocaleString('vi-VN')} đ</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {booking.Notes && (
                  <div className="p-2 sm:p-4">
                    <span className="text-gray-600 font-semibold block mb-2">Ghi chú:</span>
                    <div className="space-y-1">
                      {booking.Notes.Content && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Nội dung</span>
                          <span className="font-bold">{booking.Notes.Content}</span>
                        </div>
                      )}
                      {booking.Notes.Discount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Giảm giá</span>
                          <span className="font-bold">{booking.Notes.Discount.toLocaleString('vi-VN')} đ</span>
                        </div>
                      )}
                      {booking.Notes.PayInAdvance > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Trả trước</span>
                          <span className="font-bold">{booking.Notes.PayInAdvance.toLocaleString('vi-VN')} đ</span>
                        </div>
                      )}
                      {booking.Notes.NegotiatedPrice > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Giá thỏa thuận</span>
                          <span className="font-bold">{booking.Notes.NegotiatedPrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tổng tiền */}
                <div className="flex justify-between items-center p-2 sm:p-4 bg-gray-50">
                  <span className="text-gray-600 font-semibold text-xs sm:text-base">Tạm tính:</span>
                  <span className="font-bold text-lg text-green-700">
                    {booking.BookingPricing?.[0]?.CalculatedAmount?.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SurchargeModal
        isOpen={isSurchargeOpen}
        onClose={() => setIsSurchargeOpen(false)}
        bookingId={booking._id} // truyền bookingId
        onSave={async (surcharge) => {
          try {
            // Gọi API thêm phụ thu
            console.log('bookingId', booking.BookingId);
            const addSurcharge = await http(bookingRequests.addSurcharge({ ...surcharge, BookingId: booking.BookingId }));

            toast.success(addSurcharge.data.message);
            // reload lại booking để cập nhật UI
            const res = await http(bookingRequests.getBooking(roomId));
            setBooking(res.data.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <MoveRoomModal
        isOpen={isMoveRoomOpen}
        onClose={() => setIsMoveRoomOpen(false)}
        rooms={availableRooms}
        initialRoomId={booking.RoomId}
        onMove={async (targetRoomId) => {
          try {
            // Gọi API đổi phòng
            const res = await http(
              bookingRequests.moveRoom({
                bookingId: booking.BookingId,
                newRoomId: targetRoomId
              })
            );
            toast.success(res.data.message || 'Đổi phòng thành công');
            navigate(`/pages/management/checkin-zone?roomId=${targetRoomId}&hotelId=${hotelId}`, { replace: true });
            setIsMoveRoomOpen(false);
          } catch (err) {
            console.error(err);
            toast.error('Đổi phòng thất bại');
          }
        }}
      />

      <NoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        initialData={noteData}
        onSave={async (noteData) => {
          try {
            // ✅ Gọi API thêm ghi chú (bạn cần định nghĩa bookingRequests.addNote)
            await http(bookingRequests.addNote(booking.BookingId, noteData));
            const res = await http(bookingRequests.getBooking(roomId));
            setBooking(res.data.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </>
  );
};

export default CheckinPage;
