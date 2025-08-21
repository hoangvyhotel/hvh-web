const RoomItem = ({ room }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'vnđ';
  };

  const getStatusDisplay = (status) => {
    return status === 'maintenance' ? 'Bảo trì' : 'Đang hoạt động';
  };

  const getStatusColor = (status) => {
    return status === 'maintenance' ? 'text-orange-600' : 'text-green-600';
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
      {/* Phòng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{room.id}</span>
      </div>

      {/* Tầng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{room.floor}</span>
      </div>

      {/* Giá */}
      <div className="col-span-5 space-y-1">
        <div className="text-green-600">
          <span className="font-medium">{formatPrice(room.hourlyPrice)} / Giờ</span>
          <span className="text-gray-500 ml-2">(Giờ tiếp theo {formatPrice(room.hourlyDiscount)} / Giờ)</span>
        </div>
        <div className="text-green-600">
          <span className="font-medium">{formatPrice(room.nightPrice)} / Đêm</span>
        </div>
        <div className="text-green-600">
          <span className="font-medium">{formatPrice(room.dailyPrice)} / Ngày</span>
        </div>
      </div>

      {/* Tình trạng */}
      <div className="col-span-2">
        <span className={`font-medium ${getStatusColor(room.status)}`}>{getStatusDisplay(room.status)}</span>
      </div>

      {/* Actions */}
      <div className="col-span-3 flex items-center justify-center space-x-1">
        <button className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">CẬP NHẬT</button>
        <span className="text-gray-400 text-sm">|</span>
        <button className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
          {room.status === 'maintenance' ? 'BỎ XÓA' : 'XÓA'}
        </button>
      </div>
    </div>
  );
};

export default RoomItem;
