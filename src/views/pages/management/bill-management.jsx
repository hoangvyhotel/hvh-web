import { CircleDot, Calendar } from 'lucide-react';
import Header from '../../../layouts/HotelManagementLayout/Header';

import RentalItem from '../../../components/items/RentalItem';
import { useEffect, useState } from 'react';
import { fetchAllBills } from 'services/billsService';
import { toast } from 'react-toastify';
import { useHotelState } from 'hooks/useAuth';

const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const RetalManagement = () => {
  const [bills, setBills] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const [loading, setLoading] = useState(false);
  const hotelId = useHotelState().hotelId;

  const fetchBills = async (date) => {
    if (!hotelId) return;
    
    setLoading(true);
    try {
      const billsResponse = await fetchAllBills(hotelId, date);
      console.log('Bills loaded successfully');
      setBills(billsResponse || []);
      toast.success('Đã tải dữ liệu hóa đơn thành công!');
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Lỗi khi tải dữ liệu hóa đơn');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills(selectedDate);
  }, [hotelId, selectedDate]);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };
  const totalRoomPrice = bills.reduce((sum, bill) => sum + (bill.totalRoomPrice || 0), 0);

  return (
    <>
      <div className="border-b border-gray-300">
        <Header title="Danh sách thuê phòng" icon={<CircleDot className="w-6 h-6 text-gray-600 mr-2" />} />
      </div>

      <div className="p-6">
        {/* Date Filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <label className="font-medium text-gray-700">Chọn ngày:</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Hôm nay
          </button>
        </div>

        {/* Header Table */}
        <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
          <div className="col-span-1">Phòng</div>
          <div className="col-span-5 flex justify-center">Giờ</div>
          <div className="col-span-2 flex justify-center">Tiền dịch vụ</div>
          <div className="col-span-2 flex justify-center">Tiền phòng</div>
          {/* <div className="col-span-3 text-center">Chức năng</div> */}
        </div>

        {/* List Items */}
        <div className="bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : bills.length > 0 ? (
            bills.map((bill) => (
              <RentalItem key={bill._id.toString()} bill={bill} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có hóa đơn nào cho ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-500 mt-4">
        <div className="flex justify-between items-start mt-6">
          <span className="font-bold text-2xl">Tổng cộng</span>
          <span className="font-semibold text-xl">{formatCurrency(totalRoomPrice)}</span>
        </div>
      </div>
    </>
  );
};

export default RetalManagement;
