import BillModal from 'components/modals/BillModal';
import { useState } from 'react';
import { fetchBillById } from 'services/billsService';

const RentalItem = ({ bill, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Sửa typo: isModalOpen
  const [selectedBill, setSelectedBill] = useState(null);
  const [editedTotalRoomPrice, setEditedTotalRoomPrice] = useState(bill.totalRoomPrice);
  const formatPrice = (price) => {
    const n = Number(price || 0);
    return new Intl.NumberFormat('vi-VN').format(n) + ' vnđ';
  };

  const handleOpenEditModal = async () => {
    console.log('Opening edit modal for bill:', bill);
    const billData = await fetchBillById(bill.id.toString()); // Giữ nếu cần refresh data
    setSelectedBill(billData);
    setEditedTotalRoomPrice(billData.totalRoomPrice); // Set giá trị ban đầu
    setIsModalOpen(true);
  };

  const handleViewDetails = async () => {
    // Handle view details logic
    const billData = await fetchBillById(bill._id.toString());
    setSelectedBill(billData);
    setIsModalOpen(true);
  };
  const handleUpdate = (updatedData) => {
    if (onEdit) {
      onEdit({ ...bill, totalRoomPrice: updatedData.totalRoomPrice });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
      {/* Phòng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{bill.roomName}</span>
      </div>
      {/* Giờ (Check-in và Check-out) */}
      <div className="col-span-4 space-y-1 flex flex-col pl-25">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Check-in: {new Date(bill.checkIn).toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">
            Check-out:
            {bill.checkOut ? new Date(bill.checkOut).toLocaleString() : ' - '}
          </span>
        </div>
      </div>
      {/* Tiền Nước */}
      <div className="col-span-2 flex justify-center">
        <span className="text-gray-600">{formatPrice(bill.totalUtilitiesPrice)}</span>
      </div>
      {/* Tổng Tiền (hiển thị tiền phòng) */}
      <div className="col-span-2 flex justify-center">
        <span className="text-green-600 font-semibold">{formatPrice(bill.totalRoomPrice)}</span>
      </div>
      {/* Actions */}
      <div className="col-span-3 flex items-center justify-center space-x-1">
        {bill.type === 'bill' && (
          <button
            onClick={handleOpenEditModal} // Thay vì handleEdit, mở modal
            className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
          >
            CẬP NHẬT
          </button>
        )}
        {/* <span className="text-gray-400 text-sm">|</span> */}
        {/* <button
          onClick={handleViewDetails}
          className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
        >
          XEM CHI TIẾT
        </button> */}
      </div>
      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={selectedBill}
        onUpdate={handleUpdate} // Truyền onUpdate để modal gọi khi save
      />{' '}
    </div>
  );
};

export default RentalItem;
