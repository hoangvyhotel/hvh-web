const RentalItem = ({ rental, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return dateString;
  };

  const handleEdit = () => {
    if (onEdit) onEdit(rental);
  };

  const handleViewDetails = () => {
    // Handle view details logic
    console.log('View details for rental:', rental.id);
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
      {/* Phòng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{rental.roomNumber}</span>
      </div>

      {/* Giờ (Check-in và Check-out) */}
      <div className="col-span-4 space-y-1">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Check-in:</span>
          <span className="ml-2 text-gray-600">{formatDateTime(rental.checkIn)}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">Check-out:</span>
          <span className="ml-2 text-gray-600">{formatDateTime(rental.checkOut)}</span>
        </div>
      </div>

      {/* Tiền Nước */}
      <div className="col-span-2">
        <span className="text-gray-600">{formatCurrency(rental.waterFee)}</span>
      </div>

      {/* Số Tiền */}
      <div className="col-span-2">
        <span className="text-green-600 font-semibold">{formatCurrency(rental.totalAmount)}</span>
      </div>

      {/* Actions */}
      <div className="col-span-3 flex items-center justify-center space-x-1">
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
      </div>
    </div>
  );
};

export default RentalItem;
