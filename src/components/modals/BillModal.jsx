import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import formatToMySQL from 'utils/dateFormat';

const BillModal = ({ isOpen, onClose, bill, onUpdate }) => {
  const [totalRoomPrice, setTotalRoomPrice] = useState(bill?.totalRoomPrice || 0);

  // Khi bill thay đổi thì set lại giá trị input
  useEffect(() => {
    if (bill) {
      setTotalRoomPrice(bill.totalRoomPrice || 0);
    }
  }, [bill]);

  // ESC để đóng
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bill) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        billId: bill._id,
        totalRoomPrice: Number(totalRoomPrice),
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Cập nhật hóa đơn</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mã hóa đơn</label>
              <p className="mt-1 text-sm text-gray-900">{bill.id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="mt-1 text-sm text-gray-900">{bill.createdAt ? formatToMySQL(bill.createdAt) : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
              <p className="mt-1 text-sm text-gray-900">{bill.customerName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phòng</label>
              <p className="mt-1 text-sm text-gray-900">{bill.roomName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian thuê</label>
              <p className="mt-1 text-sm text-gray-900">
                {bill.checkIn && bill.checkOut
                  ? `${formatToMySQL(bill.checkIn)} - ${formatToMySQL(bill.checkOut)}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
              <p className="mt-1 text-sm text-gray-900">{bill.totalAmount ? `${bill.totalAmount.toLocaleString('vi-VN')} VND` : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <p className="mt-1 text-sm text-gray-900">{bill.status || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
              <p className="mt-1 text-sm text-gray-900">{bill.notes || 'Không có'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tổng tiền phòng
            </label>
            <input
              type="number"
              value={totalRoomPrice}
              onChange={(e) => setTotalRoomPrice(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
