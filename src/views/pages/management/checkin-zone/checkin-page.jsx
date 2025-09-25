import { http } from 'lib/http/axios';
import formatToMySQL from 'utils/dateFormat';
import { Home, Car, FileText } from 'lucide-react';
import { resolveIcon } from 'utils/iconResolver';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingRequests } from 'services/bookingService';
import SurchargeModal from './modal-actions/surcharge-modal';
import NoteModal from './modal-actions/note-modal';
import DocumentModal from './modal-actions/document-modal';
import VehicleModal from './modal-actions/vehicle-modal';
import DocumentViewer from './modal-actions/document-viewer';
import VehicleViewer from './modal-actions/vehicle-viewer';
import DocumentEditor from './modal-actions/document-editor';
import VehicleEditor from './modal-actions/vehicle-editor';
import { toast } from 'react-toastify';
import { utilitiesRequests } from 'services/utilitiesService';
import { roomRequests } from 'services/roomService';
import MoveRoomModal from './modal-actions/move-room-modal';
import ChangeBookingTypeModal from './modal-actions/change-booking-type';
function translateBookingType(type) {
  // normalize input safely to avoid calling toLowerCase on undefined/null
  let key = '';
  if (typeof type === 'string') key = type.trim().toLowerCase();
  else if (type != null && typeof type !== 'object') key = String(type).toLowerCase();

  switch (key) {
    case 'day':
    case 'ngày':
      return 'Ngày';
    case 'night':
    case 'đêm':
    case 'dem':
      return 'Đêm';
    case 'hour':
    case 'giờ':
    case 'gio':
      return 'Giờ';
    default:
      return 'Không xác định';
  }
}

const CheckinPage = () => {
  const navigate = useNavigate();

  // Normalize history item fields (handle camelCase / PascalCase / lowercase keys from API)
  const normalizeHistoryItem = (item) => {
    if (!item) return {};
    const getVal = (keys) => keys.reduce((acc, k) => acc ?? item[k] ?? item[k.toLowerCase()] ?? item[k.charAt(0).toUpperCase() + k.slice(1)], undefined);
    const priceType = (getVal(['PriceType', 'priceType', 'price_type']) || '').toString();
    return {
      PriceType: priceType.toUpperCase(),
      Amount: Number(getVal(['Amount', 'amount', 'Price', 'price', 'value']) || 0) || 0,
      AppliedFrom: getVal(['AppliedFrom', 'appliedFrom', 'applied_from']) || null,
      AppliedTo: getVal(['AppliedTo', 'appliedTo', 'applied_to']) || null,
      Times: getVal(['Times', 'times']) || 0,
      AppliedFirstHourPrice: Number(getVal(['AppliedFirstHourPrice', 'appliedFirstHourPrice', 'applied_first_hour_price']) || 0) || 0,
      AppliedNextHourPrice: Number(getVal(['AppliedNextHourPrice', 'appliedNextHourPrice', 'applied_next_hour_price']) || 0) || 0,
      AppliedNightPrice: Number(getVal(['AppliedNightPrice', 'appliedNightPrice', 'applied_night_price']) || 0) || 0
    };
  };

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
  const [isChangeTypeOpen, setIsChangeTypeOpen] = useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isVehicleViewerOpen, setIsVehicleViewerOpen] = useState(false);
  const [isDocumentEditorOpen, setIsDocumentEditorOpen] = useState(false);
  const [isVehicleEditorOpen, setIsVehicleEditorOpen] = useState(false);
  const fetchBooking = async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await http(bookingRequests.getBooking(roomId));
      setBooking(res.data.data);
            console.log("res", booking);

    } catch (err) {
      console.error(err);
      setError('Không thể tải thông tin booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [roomId]);
  useEffect(() => {
    const fetchUtilities = async () => {
      if (!hotelId) return;
      try {
        const res = await http(utilitiesRequests.list({ hotelId }));
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
      const res = await http(roomRequests.getRoomAvailable(roomId, hotelId));
      setAvailableRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách phòng');
    }
  };

  const handleSaveDocument = async (doc) => {
    try {
      if (!booking?.BookingId) {
        toast.error('Không có booking để lưu giấy tờ');
        return;
      }

      const dto = {
        bookingId: booking.BookingId,
        ID: doc.ID,
        TypeID: doc.TypeID,
        FullName: doc.FullName,
        Address: doc.Address,
        BirthDay: doc.BirthDay,
        Gender: doc.Gender,
        EthnicGroup: doc.EthnicGroup
      };

      const res = await http(bookingRequests.addDocument(dto));
      if (res.data?.succeeded === false) {
        toast.error(res.data?.message || 'Lưu giấy tờ thất bại');
        return;
      }

      // reload booking to get persisted documents
      const updated = await http(bookingRequests.getBooking(roomId));
      setBooking(updated.data.data);
      toast.success(res.data?.message || 'Lưu giấy tờ thành công');
    } catch (err) {
      console.error(err);
      toast.error('Lưu giấy tờ thất bại');
    }
  };

  const handleSaveVehicle = async (vehicle) => {
    try {
      if (!booking?.BookingId) {
        toast.error('Không có booking để lưu thông tin xe');
        return;
      }

      const dto = {
        bookingId: booking.BookingId,
        LicensePlate: vehicle.LicensePlate,
        Color: vehicle.Color,
        VehicleType: vehicle.Type || vehicle.VehicleType
      };

      const res = await http(bookingRequests.addCar(dto));
      if (res.data?.succeeded === false) {
        toast.error(res.data?.message || 'Lưu thông tin xe thất bại');
        return;
      }

      const updated = await http(bookingRequests.getBooking(roomId));
      setBooking(updated.data.data);
      toast.success(res.data?.message || 'Lưu thông tin xe thành công');
    } catch (err) {
      console.error(err);
      toast.error('Lưu thông tin xe thất bại');
    }
  };

  const handleCheckout = async () => {
    navigate(`/pages/management/checkin-zone/checkout-confirm?bookingId=${booking.BookingId}&roomId=${roomId}&hotelId=${hotelId}`);
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!booking) return <div className="p-4 text-center">Không có dữ liệu</div>;
  console.log("booking", booking);
  return (
    <>
      <div className="bg-gray-100 min-h-screen font-sans">
        {/* Top Bar */}
        <div className="bg-[#ADDDC0] text-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <button
              className="text-2xl p-2 rounded-full hover:bg-gray-200 transition-colors bg-white cursor-pointer"
              onClick={() => navigate('/pages/home/room-tracking')}
            >
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
                  <button
                    className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-md font-bold cursor-pointer"
                    onClick={() => setIsChangeTypeOpen(true)}
                  >
                    {translateBookingType(booking?.TypeBooking) || ''}
                  </button>
                  <span className="text-lg font-bold">LÚC:</span>
                  <span className="font-semibold">{formatToMySQL(booking.CheckinDate)}</span>
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
                  {/* display-only left icon (no click) */}
                  <div
                    className="relative text-3xl sm:text-5xl text-green-600 cursor-pointer"
                    onClick={() => setIsDocumentEditorOpen(true)}
                  >
                    <FileText />
                    <span className="absolute -top-0 -right-1 bg-yellow-400 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center font-bold">
                      {booking.Documents?.length || 0}
                    </span>
                  </div>
                  <span className="mt-1 font-bold text-sm sm:text-base">Giấy tờ</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  {/* display-only left icon (no click) */}
                  <div className="relative text-3xl sm:text-5xl text-green-600 cursor-pointer" onClick={() => setIsVehicleEditorOpen(true)}>
                    <Car />
                    <span className="absolute -top-0 -right-1 bg-yellow-400 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center font-bold">
                      {booking.CarInfos?.length || 0}
                    </span>
                  </div>
                  <span className="mt-1 font-bold text-sm sm:text-base">Xe</span>
                </div>
              </div>

              {/* Hàng 3 - Các tiện ích khác */}
              <div className="flex flex-wrap justify-start border-b border-green-500 p-2 sm:p-4">
                {booking.Utilities?.map((u, index) => {
                  const parseIconVal = (val) => {
                    if (val == null) return '';
                    if (typeof val === 'object') return val;
                    if (typeof val === 'string') {
                      try {
                        return JSON.parse(val);
                      } catch (e) {
                        return val;
                      }
                    }
                    return '';
                  };

                  const iconVal = parseIconVal(u.Icon ?? u.icon ?? u.IconName ?? u.IconKey);

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center p-2 relative w-16 sm:w-24 cursor-pointer"
                      onClick={async () => {
                        try {
                          const bookingId = booking?.BookingId || booking?._id || booking?.id;
                          const utilityId = u?._id || u?.id || u?.utilitiesId;

                          if (!bookingId || !utilityId) {
                            toast.error('Không thể xử lý tiện ích: thiếu bookingId hoặc utilityId.');
                            return;
                          }

                          const dto = {
                            bookingId,
                            BookingId: bookingId,
                            utilityId,
                            UtilityId: utilityId,
                            quantity: 1
                          };
                          // gọi API removeUtility
                          const res = await http(bookingRequests.removeUtility(dto));

                          // reload lại booking để cập nhật UI
                          const updated = await http(bookingRequests.getBooking(roomId));
                          setBooking(updated.data.data);
                          toast.success(res.data.message || 'Đã giảm tiện ích thành công');
                        } catch (err) {
                          
                          const serverMsg = err?.response?.data?.message || err?.message || 'Xử lý tiện ích thất bại';
                          toast.error(serverMsg);
                        }
                      }}
                    >
                      {/* Hiển thị số lượng */}
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-400 text-white rounded-full h-4 sm:h-6 w-4 sm:w-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                        {u.Quantity}
                      </div>

                      {/* Icon */}
                      <div className="text-2xl sm:text-4xl text-green-600">{resolveIcon(iconVal, { size: 28, color: '#16a34a' })}</div>

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

                      // cập nhật UI: xóa booking khỏi state
                      setBooking(null);

                      // Delay để hiển thị toast trước khi redirect
                      setTimeout(() => {
                        navigate('/pages/home/room-tracking');
                      }, 1500);
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
              <button
                className="cursor-pointer bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                onClick={handleCheckout}
              >
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
                  <button onClick={() => setIsDocumentOpen(true)} className="text-xl sm:text-2xl text-green-600 cursor-pointer">
                    <FileText />
                  </button>
                  <span className="text-xs sm:text-sm mt-1">Giấy tờ</span>
                </div>
                <div className="flex flex-col items-center p-1 sm:p-2">
                  <button onClick={() => setIsVehicleOpen(true)} className="text-xl sm:text-2xl text-green-600 cursor-pointer">
                    <Car />
                  </button>
                  <span className="text-xs sm:text-sm mt-1">Xe</span>
                </div>
                {/* 3 ô trống trên điện thoại */}
                <div className="hidden sm:block col-span-3"></div>
              </div>

              {/* Nhóm dưới: Nước & Đồ ăn */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-green-500 rounded-md p-1 sm:p-2">
                {utilities
                  .filter((u) => u?.status === true || u?.Status === true)
                  .map((u) => {
                    const parseIconVal = (val) => {
                      if (val == null) return '';
                      if (typeof val === 'object') return val;
                      if (typeof val === 'string') {
                        try {
                          return JSON.parse(val);
                        } catch (e) {
                          return val;
                        }
                      }
                      return '';
                    };

                    const iconVal = parseIconVal(u.icon ?? u.Icon ?? u.IconName ?? u.IconKey);

                    return (
                      <div
                        key={u._id}
                        className="flex flex-col items-center p-1 sm:p-2"
                        onClick={async () => {
                          try {
                            if (!booking.BookingId) return;

                            const dto = {
                              bookingId: booking.BookingId, // id booking
                              utilityId: u.id, // id utility
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
                        <div className="text-xl sm:text-2xl text-green-600 cursor-pointer">
                          {resolveIcon(iconVal, { size: 22, color: '#16a34a' })}
                        </div>
                        <span className="text-xs sm:text-sm mt-1">{u.name || u.Name}</span>
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
                      {formatToMySQL(bp.StartDate)}
                    </div>

                    {bp.EndDate && (
                      <div className="text-gray-500 text-sm">
                        Kết thúc:{' '}
                        {formatToMySQL(bp.EndDate)}
                      </div>
                    )}

                    {/* Render History */}
                    {bp.History?.length > 0 && (
                      <div className="mt-3 border-l-2 border-green-500 pl-3">
                        <span className="text-gray-600 font-semibold block mb-1">Lịch sử giá:</span>  
                        <ul className="space-y-2">
                          {bp.History.map((h, hIndex) => {
                            const nh = normalizeHistoryItem(h);
                            return (
                              <li key={hIndex} className="bg-gray-50 p-2 rounded text-sm flex flex-col">
                                <div className="flex justify-between">
                                  <span className="font-bold text-green-700">{translateBookingType(nh.PriceType)}</span>
                                  <span className="font-bold text-green-700">{(nh.Amount || 0).toLocaleString('vi-VN')} đ</span>
                                </div>

                                <span className="text-gray-500 text-xs">
                                  Từ:{' '}
                                  {nh.AppliedFrom ? formatToMySQL(nh.AppliedFrom) : '—'}
                                </span>
                                {nh.AppliedTo ? (
                                  <span className="text-gray-500 text-xs">
                                    Đến:{' '}
                                    {formatToMySQL(nh.AppliedTo)}
                                  </span>
                                ) : null}

                                <span className="text-gray-500 text-xs mt-1">
                                  Số giờ: <b>{nh.Times}</b> giờ
                                </span>

                                {nh.PriceType === 'HOUR' && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <div>Giờ đầu: {Number(nh.AppliedFirstHourPrice || 0).toLocaleString('vi-VN')} đ</div>
                                    <div>Giờ tiếp: {Number(nh.AppliedNextHourPrice || 0).toLocaleString('vi-VN')} đ</div>
                                  </div>
                                )}

                                {nh.PriceType === 'NIGHT' && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    Giá ban đêm: {Number(nh.AppliedNightPrice || 0).toLocaleString('vi-VN')} đ
                                  </div>
                                )}
                              </li>
                            );
                          })}
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
                {booking.TotalAmountUtilities > 0 && (
                  <div className="flex justify-between items-center p-2 sm:p-4">
                    <span className="text-gray-600 font-semibold text-xs sm:text-base">Tổng dịch vụ:</span>
                    <span className="font-bold text-blue-600">{booking.TotalAmountUtilities.toLocaleString('vi-VN')} đ</span>
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

      <ChangeBookingTypeModal
        isOpen={isChangeTypeOpen}
        onClose={() => setIsChangeTypeOpen(false)}
        initialType={booking.TypeBooking} // VD: "HOUR", "DAY", "NIGHT"
        onChangeType={async (newType) => {
          try {
            // Gọi API đổi kiểu booking
            const res = await http(
              bookingRequests.changeTypeBooking({
                bookingId: booking.BookingId,
                newPriceType: newType
              })
            );
            toast.success(res.data.message || 'Đổi kiểu booking thành công');

            await fetchBooking();
            setIsChangeTypeOpen(false);
          } catch (err) {
            console.error(err);
            toast.error('Đổi kiểu booking thất bại');
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
      <DocumentModal isOpen={isDocumentOpen} onClose={() => setIsDocumentOpen(false)} onSave={handleSaveDocument} />
      <VehicleModal isOpen={isVehicleOpen} onClose={() => setIsVehicleOpen(false)} onSave={handleSaveVehicle} />
      <DocumentViewer isOpen={isDocumentViewerOpen} onClose={() => setIsDocumentViewerOpen(false)} bookingId={booking?.BookingId} />
      <VehicleViewer isOpen={isVehicleViewerOpen} onClose={() => setIsVehicleViewerOpen(false)} bookingId={booking?.BookingId} />
      <DocumentEditor
        isOpen={isDocumentEditorOpen}
        onClose={() => setIsDocumentEditorOpen(false)}
        bookingId={booking?.BookingId}
        onSave={async () => {
          // refresh booking after an update
          try {
            const updated = await http(bookingRequests.getBooking(roomId));
            setBooking(updated.data.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <VehicleEditor
        isOpen={isVehicleEditorOpen}
        onClose={() => setIsVehicleEditorOpen(false)}
        bookingId={booking?.BookingId}
        onSave={async () => {
          try {
            const updated = await http(bookingRequests.getBooking(roomId));
            setBooking(updated.data.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </>
  );
};

export default CheckinPage;
