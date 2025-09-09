import { CircleDot } from 'lucide-react';
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
  const [billSelected, setBillSelected] = useState(null);
  const hotelId = useHotelState().hotelId;

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const billsResponse = await fetchAllBills(hotelId);
        setBills(billsResponse);
        toast.success('Đã tải dữ liệu hóa đơn thành công!');
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  return (
    <>
      <div className="border-b border-gray-300">
        <Header title="Danh sách thuê phòng" icon={<CircleDot className="w-6 h-6 text-gray-600 mr-2" />} />
      </div>

      <div className="p-6">
        {/* Header Table */}
        <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
          <div className="col-span-1">Phòng</div>
          <div className="col-span-4 flex justify-center">Giờ</div>
          <div className="col-span-2 flex justify-center">Tiền dịch vụ</div>
          <div className="col-span-2 flex justify-center">Tiền phòng</div>
          <div className="col-span-3 text-center">Chức năng</div>
        </div>

        {/* List Items */}
        <div className="bg-white">
          {bills.map((bill) => (
            <RentalItem key={bill._id.toString()} bill={bill} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-500 mt-4">
        <div className="flex justify-between items-start mt-6">
          <span className="font-bold text-2xl">Tổng cộng</span>
          <span className="font-semibold text-xl">{formatCurrency(1220000)}</span>
        </div>
      </div>
    </>
  );
};

export default RetalManagement;
