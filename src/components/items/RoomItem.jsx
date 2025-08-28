const RoomItem = ({ room, onEdit, onDelete, onUpdateStatus, index }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' vnđ';
  };

  const getStatusDisplay = (status) => {
    return status === false ? 'Bảo trì' : 'Đang hoạt động';
  };

  const getStatusColor = (status) => {
    return status === false ? 'text-orange-600' : 'text-green-600';
  };

  const handleEdit = () => {
    onEdit(room);
  };

  const handleDelete = () => {
    onDelete(room.id);
  };

  const handleUpdateStatus = () => {
    const newStatus = !room.status;
    onUpdateStatus(room.id, newStatus);
  };

  return (
    <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
      {/* Phòng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{index + 1}</span>
      </div>

      {/* Tầng */}
      <div className="col-span-1">
        <span className="text-green-600 font-semibold">{room.floor}</span>
      </div>

      {/* Giá */}
      <div className="col-span-5 space-y-1">
        <div className="text-green-600">
          <span className="font-medium">{formatPrice(room.originalPrice)} / Giờ</span>
          <span className="text-gray-500 ml-2">(Giờ tiếp theo {formatPrice(room.afterHoursPrice)} / Giờ)</span>
        </div>
        <div className="text-green-900">
          <span className="font-medium">{formatPrice(room.nightPrice)} / Đêm</span>
        </div>
        <div className="text-green-500">
          <span className="font-medium">{formatPrice(room.dayPrice)} / Ngày</span>
        </div>
      </div>

      {/* Tình trạng */}
      <div className="col-span-2">
        {room.status === true ? (
          <span className={`font-medium ${getStatusColor(room.status)}`}>{getStatusDisplay(room.status)}</span>
        ) : (
          <span className={`font-medium ${getStatusColor(room.status)}`}>{getStatusDisplay(room.status)}</span>
        )}
      </div>

      {/* Actions */}
      <div className="col-span-3 flex items-center justify-center space-x-1">
        <button onClick={handleEdit} className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
          CẬP NHẬT
        </button>
        <span className="text-gray-400 text-sm">|</span>
        <button
          onClick={handleUpdateStatus}
          className={`px-2 py-1 text-xs ${
            room.status === true ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-green-600 hover:bg-gray-200'
          }`}
        >
          {room.status === true ? 'Bảo trì' : 'Hoạt động'}
        </button>
      </div>
    </div>
  );
};

export default RoomItem;
