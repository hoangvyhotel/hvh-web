import { CircleDot } from 'lucide-react';
import Header from '../../../layouts/HotelManagementLayout/Header';

import { rentalCardData } from '../home/data/rental-cartd-data';
import RentalItem from '../../../components/items/RentalItem';

const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const RetalManagement = () => {
  return (
    <>
      <div className="border-b border-gray-300">
        <Header title="Danh sách thuê phòng" icon={<CircleDot className="w-6 h-6 text-gray-600 mr-2" />} />
      </div>

      <div className="p-6">
        {/* Header Table */}
        <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
          <div className="col-span-1">Phòng</div>
          <div className="col-span-4">Giờ</div>
          <div className="col-span-2">Tiền Nước</div>
          <div className="col-span-2">Số Tiền</div>
          <div className="col-span-3 text-center">Chức năng</div>
        </div>

        {/* List Items */}
        <div className="bg-white">
          {rentalCardData.map((item) => (
            <RentalItem key={item.id} rental={item} />
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
