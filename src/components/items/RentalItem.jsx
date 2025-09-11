import BillModal from 'components/modals/BillModal';
import { useState } from 'react';
import { fetchBillById } from 'services/billsService';

const RentalItem = ({ bill, onEdit, onDelete }) => {
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' vnđ';
  };

  const handleEdit = () => {
    if (onEdit) onEdit(rental);
  };

  const handleViewDetails = async () => {
    // Handle view details logic
    const billData = await fetchBillById(bill._id.toString());
    setSelectedBill(billData);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
      {/* Phòng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{bill.roomName}</span>
      </div>

      {/* Giờ (Check-in và Check-out) */}
      <div className="col-span-5 space-y-1 flex flex-col pl-25">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Check-in: {new Date(bill.checkin).toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">
            Check-out:
            {bill.checkout ? new Date(bill.checkout).toLocaleString() : ' - '}
          </span>
        </div>
      </div>

      {/* Tiền Nước */}
      <div className="col-span-2 flex justify-center">
        <span className="text-gray-600">{formatPrice(bill.totalUtilitiesPrice)}</span>
      </div>

      {/* Số Tiền */}
      <div className="col-span-2 flex justify-center">
        <span className="text-green-600 font-semibold">{formatPrice(bill.totalRoomPrice)}</span>
      </div>

      {/* Actions */}
      {/* <div className="col-span-3 flex items-center justify-center space-x-1">
        <button onClick={handleEdit} className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
          CẬP NHẬT
        </button>
        <span className="text-gray-400 text-sm">|</span>
        <button
          onClick={handleViewDetails}
          className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
        >
          XEM CHI TIẾT
        </button>
      </div> */}
      <BillModal isOpen={isModelOpen} onClose={() => setIsModalOpen(false)} bill={bill} />
    </div>
  );
};

export default RentalItem;
