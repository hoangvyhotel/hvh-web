import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Car, FileText, Home, DollarSign, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { http } from 'lib/http/axios';
import { bookingRequests } from 'services/bookingService';
import { createBill } from 'services/billsService';
import { resolveIcon } from 'utils/iconResolver';
import { toast } from 'react-toastify';
import formatToMySQL from 'utils/dateFormat';

// Helper function to translate booking type
function translateBookingType(type) {
  switch (type?.toLowerCase()) {
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

const CheckoutConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get query parameters
  const bookingId = searchParams.get('bookingId');
  const roomId = searchParams.get('roomId');

  const [data, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const formatCurrency = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue === null || numValue === undefined) return '0 đ';
    return numValue.toLocaleString('vi-VN') + ' đ';
  };

  // Normalize history item fields (accept API fields in various casings)
  const normalizeHistoryItem = (item) => {
    if (!item) return {};
    const get = (keys) => keys.reduce((acc, k) => acc ?? item[k] ?? item[k.toLowerCase()] ?? item[k.charAt(0).toUpperCase() + k.slice(1)], undefined);
    const priceType = (get(['PriceType', 'priceType', 'price_type']) || '').toString();
    return {
      PriceType: priceType.toUpperCase(),
      Amount: Number(get(['Amount', 'amount', 'Price', 'price', 'value']) || 0) || 0,
      AppliedFrom: get(['AppliedFrom', 'appliedFrom', 'applied_from']) || null,
      AppliedTo: get(['AppliedTo', 'appliedTo', 'applied_to']) || null,
      Times: get(['Times', 'times']) || 0,
      AppliedFirstHourPrice: Number(get(['AppliedFirstHourPrice', 'appliedFirstHourPrice', 'applied_first_hour_price']) || 0) || 0,
      AppliedNextHourPrice: Number(get(['AppliedNextHourPrice', 'appliedNextHourPrice', 'applied_next_hour_price']) || 0) || 0,
      AppliedNightPrice: Number(get(['AppliedNightPrice', 'appliedNightPrice', 'applied_night_price']) || 0) || 0
    };
  };

  const fetchBooking = async () => {
    if (!roomId) {
      setError('Không có roomId để tải thông tin booking');
      return;
    }

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

  useEffect(() => {
    fetchBooking();
  }, [roomId]);

  // Calculate totals
  const calculateTotals = () => {
    if (!data) return { roomTotal: 0, utilitiesTotal: 0, surchargeTotal: 0, finalTotal: 0 };

    // Room price from BookingPricing History
    let roomTotal = 0;
    if (data.BookingPricing?.[0]?.History) {
      roomTotal = data.BookingPricing[0].History.reduce((sum, historyItem) => {
        // Some APIs return different field names for price (Amount, Price, Value)
        const amt = historyItem?.Amount ?? historyItem?.Price ?? historyItem?.Value ?? historyItem?.AmountValue ?? 0;
        return sum + (Number(amt) || 0);
      }, 0);
    }

    // Utilities total
    const utilitiesTotal =
      data.Utilities?.reduce((sum, utility) => {
        return sum + utility.Price * utility.Quantity;
      }, 0) || 0;

    // Surcharge total
    const surchargeTotal =
      data.Surcharge?.reduce((sum, surcharge) => {
        return sum + (surcharge.Amount || 0);
      }, 0) || 0;

    // Apply discounts and adjustments from Notes
    let discount = 0;
    let payInAdvance = 0;
    let negotiatedPrice = 0;

    if (data.Notes) {
      discount = data.Notes.Discount || 0;
      payInAdvance = data.Notes.PayInAdvance || 0;
      negotiatedPrice = data.Notes.NegotiatedPrice || 0;
    }

    // Final total is CalculatedAmount from BookingPricing
  let finalTotal = data.BookingPricing?.[0]?.CalculatedAmount || 0;

    // If there's a negotiated price, use it instead
    if (negotiatedPrice > 0) {
      finalTotal = negotiatedPrice;
    }

    return {
      // if roomTotal couldn't be derived from history, fallback to CalculatedAmount
      roomTotal: roomTotal || (finalTotal ? finalTotal - utilitiesTotal - surchargeTotal + discount + payInAdvance : 0),
      utilitiesTotal,
      surchargeTotal,
      discount,
      payInAdvance,
      negotiatedPrice,
      finalTotal: Math.max(0, finalTotal) // Ensure non-negative
    };
  };

  const handleCheckout = async () => {
    if (!data?.BookingId) {
      toast.error('Không có thông tin booking để trả phòng');
      return;
    }

    try {
      setProcessing(true);

      // Confirm checkout
      const confirmed = window.confirm(
        `Xác nhận trả phòng ${data.RoomName}?\n\nTổng tiền: ${formatCurrency(calculateTotals().finalTotal)}`
      );

      if (!confirmed) return;

      // Create bill and checkout
      const billData = await createBill(roomId);

      toast.success('Trả phòng thành công!');

      // Navigate back to room tracking after a delay
      setTimeout(() => {
        navigate('/pages/home/room-tracking');
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Trả phòng thất bại. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => navigate('/pages/home/room-tracking')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không có dữ liệu booking</p>
          <button
            onClick={() => navigate('/pages/home/room-tracking')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-[#ADDDC0] text-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className="text-2xl p-2 rounded-full hover:bg-gray-200 transition-colors bg-white"
            onClick={() => navigate('/pages/home/room-tracking')}
          >
            <Home />
          </button>
          <span className="text-xl font-semibold">Xác nhận trả phòng</span>
        </div>
        <div className="text-2xl font-bold">{data.RoomName}</div>
      </div>

      {/* Main Content - Optimized Layout */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Booking Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-md border border-green-400 p-6">
              <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                <DollarSign className="mr-2" />
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-green-300 rounded p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="text-green-600 mr-2" />
                    <span className="font-semibold">Loại thuê:</span>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {translateBookingType(data.TypeBooking)}
                  </span>
                </div>

                <div className="bg-gray-50 border border-green-300 rounded p-4 flex items-center">
                  <FileText className="text-green-600 mr-3" size={24} />
                  <div>
                    <div className="text-xs text-gray-500">Giấy tờ</div>
                    <div className="font-semibold text-lg">{data.Documents?.length || 0}</div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-green-300 rounded p-4 flex items-center">
                  <Car className="text-green-600 mr-3" size={24} />
                  <div>
                    <div className="text-xs text-gray-500">Xe</div>
                    <div className="font-semibold text-lg">{data.CarInfos?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents and Vehicles Information */}
            {((data.Documents && data.Documents.length > 0) || (data.CarInfos && data.CarInfos.length > 0)) && (
              <div className="bg-white rounded-lg shadow-md border border-green-400 p-6">
                <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <FileText className="mr-2" />
                  Thông tin giấy tờ và phương tiện
                </h2>

                <div className="space-y-6">
                  {/* Documents Section */}
                  {data.Documents && data.Documents.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <FileText className="mr-2 text-green-600" size={20} />
                        Giấy tờ tùy thân ({data.Documents.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.Documents.map((doc, index) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                doc.TypeID === 'CCCD' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : doc.TypeID === 'CMND'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {doc.TypeID}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                doc.Gender ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                              }`}>
                                {doc.Gender ? 'Nam' : 'Nữ'}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {doc.FullName && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Họ tên: </span>
                                  <span className="text-sm text-gray-800">{doc.FullName}</span>
                                </div>
                              )}
                              {doc.ID && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Số: </span>
                                  <span className="text-sm text-gray-800 font-mono">{doc.ID}</span>
                                </div>
                              )}
                              {doc.BirthDay && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Ngày sinh: </span>
                                  <span className="text-sm text-gray-800">
                                    {new Date(doc.BirthDay).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              )}
                              {doc.Address && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Địa chỉ: </span>
                                  <span className="text-sm text-gray-800">{doc.Address}</span>
                                </div>
                              )}
                              {doc.EthnicGroup && (
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Dân tộc: </span>
                                  <span className="text-sm text-gray-800">{doc.EthnicGroup}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vehicles Section */}
                  {data.CarInfos && data.CarInfos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <Car className="mr-2 text-green-600" size={20} />
                        Phương tiện ({data.CarInfos.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {data.CarInfos.map((car, index) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Car className="text-green-600" size={24} />
                            </div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Biển số xe</div>
                            <div className="text-lg font-bold text-gray-800 font-mono bg-white px-3 py-1 rounded border">
                              {car.LicensePlate || 'Chưa có thông tin'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing History - Simplified */}
            {data.BookingPricing && data.BookingPricing.length > 0 && data.BookingPricing[0].History && (
              <div className="bg-white rounded-lg shadow-md border border-green-400 p-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <Clock className="mr-2 text-green-600" size={20} />
                  Lịch sử giá phòng
                </h3>
                <div className="space-y-3">
                  {data.BookingPricing[0].History.map((historyItem, index) => {
                    const nh = normalizeHistoryItem(historyItem);
                    return (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              (historyItem?.Action === 'CREATE' || historyItem?.action === 'CREATE') ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {(historyItem?.Action === 'CREATE' || historyItem?.action === 'CREATE') ? 'Tạo mới' : 'Đổi loại'}
                            </span>
                            <span className="px-2 py-1 bg-green-600 text-white rounded text-sm">
                              {translateBookingType(nh.PriceType)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {nh.Times} giờ
                            </span>
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            {formatCurrency(nh.Amount)}
                          </div>
                        </div>

                        {/* Time Information */}
                        <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium">Từ: </span>
                              {nh.AppliedFrom ? formatToMySQL(nh.AppliedFrom) : '—'}
                            </div>
                            {nh.AppliedTo ? (
                              <div>
                                <span className="font-medium">Đến: </span>
                                {formatToMySQL(nh.AppliedTo)}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Services Used */}
            {data.Utilities && data.Utilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md border border-green-400 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Dịch vụ đã sử dụng</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {data.Utilities.map((utility, index) => {
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

                    const iconVal = parseIconVal(utility.Icon);

                    return (
                      <div key={index} className="bg-gray-50 border rounded p-3 text-center">
                        <div className="relative text-2xl text-green-600 mb-2">
                          {resolveIcon(iconVal, { size: 24, color: '#16a34a' })}
                          <span className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center font-bold">
                            {utility.Quantity}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{utility.Name}</div>
                        <div className="text-sm text-green-600 font-semibold">
                          {formatCurrency(utility.Price * utility.Quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-green-700 mb-6 flex items-center">
                <CreditCard className="mr-2" />
                Tóm tắt thanh toán
              </h2>

              <div className="space-y-4">
                {/* Room charges */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Tiền phòng</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(totals.roomTotal)}</span>
                </div>

                {/* Utilities charges */}
                {totals.utilitiesTotal > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Dịch vụ</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totals.utilitiesTotal)}</span>
                  </div>
                )}

                {/* Surcharges */}
                {data.Surcharge && data.Surcharge.length > 0 && (
                  <div className="py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-semibold">Phụ thu</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(totals.surchargeTotal)}</span>
                    </div>
                    <div className="space-y-1">
                      {data.Surcharge.map((surcharge, index) => (
                        <div key={index} className="flex justify-between items-center text-sm pl-4">
                          <span className="text-gray-600">• {surcharge.Content || `Phụ thu ${index + 1}`}</span>
                          <span className="text-gray-600">{formatCurrency(surcharge.Amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discounts */}
                {totals.discount > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Giảm giá</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(totals.discount)}</span>
                  </div>
                )}

                {/* Paid in advance */}
                {totals.payInAdvance > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Đã trả trước</span>
                    <span className="font-semibold text-blue-600">-{formatCurrency(totals.payInAdvance)}</span>
                  </div>
                )}
              </div>

              {/* Final total */}
              <div className="mt-6 pt-4 border-t-2 border-green-200">
                <div className="flex justify-between items-center py-4 bg-green-50 rounded-lg px-4">
                  <span className="text-xl font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-green-700">{formatCurrency(totals.finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="mr-2" size={20} />
                      Xác nhận trả phòng
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(`/pages/management/checkin-zone?roomId=${roomId}&hotelId=${searchParams.get('hotelId') || ''}`)}
                  className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={processing}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirm;