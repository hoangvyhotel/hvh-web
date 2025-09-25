import { X } from 'lucide-react';
import { useEffect } from 'react';
import formatToMySQL from 'utils/dateFormat';

const BillModal = ({ isOpen, onClose, bill }) => {
  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener when modal is open
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
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

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Chi tiết hóa đơn</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
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
              <p className="mt-1 text-sm text-gray-900">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
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

          {/* Additional details if available */}
          {bill.items && bill.items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiết dịch vụ</label>
              <div className="space-y-2">
                {bill.items.map((item, index) => (
                  <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>{item.name}</span>
                    <span>{item.price ? `${item.price.toLocaleString('vi-VN')} VND` : 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
