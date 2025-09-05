import { X } from 'lucide-react';
import { useEffect } from 'react';

import { floorData } from '../../views/pages/home/data/room-data';

import { useHotelState } from 'hooks/useAuth';

const RoomModal = ({ isOpen, onClose, room, onSave }) => {
  const { hotelId } = useHotelState();
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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = {
      floor: parseInt(formData.get('floor'), 10),
      description: formData.get('description'),
      originalPrice: parseFloat(formData.get('originalPrice')) || 0,
      afterHoursPrice: parseFloat(formData.get('afterHoursPrice')) || 0,
      dayPrice: parseFloat(formData.get('dayPrice')) || 0,
      nightPrice: parseFloat(formData.get('nightPrice')) || 0,
      typeHire: 1, // 1: Theo giờ, 2: Theo ngày, 3: Theo đêm. Mặc định load là 1
      status: true,
  hotelId: hotelId || ''
    };
    onSave(roomData);
    onClose();
  };

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
          <h2 className="text-xl font-semibold text-gray-800">{room ? 'Cập nhật phòng' : 'Thêm phòng mới'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          {/* Tầng */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-gray-700 font-medium">Tầng</label>
            <div className="col-span-9">
              <select
                name="floor"
                defaultValue={room?.floor || ''}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                required
              >
                {floorData.map(
                  (floor) =>
                    floorData.id !== 0 && (
                      <option key={floor.id} value={floor.id}>
                        {floor.name}
                      </option>
                    )
                )}
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-3 text-gray-700 font-medium pt-2">Mô tả</label>
            <div className="col-span-9">
              <textarea
                name="description"
                defaultValue={room?.description || ''}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                placeholder="Nhập mô tả phòng"
              />
            </div>
          </div>

          {/* Giá theo giờ */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-gray-700 font-medium">Giá theo giờ</label>
            <div className="col-span-9 flex items-center space-x-2">
              <input
                type="number"
                name="originalPrice"
                defaultValue={room?.originalPrice || ''}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="60000"
                required
              />
              <span className="text-gray-600 font-medium">/ Giờ</span>
            </div>
          </div>

          {/* Giá giờ tiếp theo */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-gray-700 font-medium"></label>
            <div className="col-span-9 flex items-center space-x-2">
              <input
                type="number"
                name="afterHoursPrice"
                defaultValue={room?.afterHoursPrice || ''}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="20000"
                required
              />
              <span className="text-gray-600 font-medium">/ Giờ tiếp theo</span>
            </div>
          </div>

          {/* Giá theo đêm */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-gray-700 font-medium">Giá theo đêm</label>
            <div className="col-span-9 flex items-center space-x-2">
              <input
                type="number"
                name="nightPrice"
                defaultValue={room?.nightPrice || ''}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="200000"
                required
              />
              <span className="text-gray-600 font-medium">/ Đêm</span>
            </div>
          </div>

          {/* Giá theo ngày */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-gray-700 font-medium">Giá theo ngày</label>
            <div className="col-span-9 flex items-center space-x-2">
              <input
                type="number"
                name="dayPrice"
                defaultValue={room?.dayPrice || ''}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="300000"
                required
              />
              <span className="text-gray-600 font-medium">/ Ngày</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-2 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
