import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const bookingTypes = [
  { value: "HOUR", label: "Theo giờ" },
  { value: "DAY", label: "Theo ngày" },
  { value: "NIGHT", label: "Qua đêm" },
];

const ChangeBookingTypeModal = ({
  isOpen,
  onClose,
  onChangeType,
  initialType = "",
}) => {
  const [selectedType, setSelectedType] = useState("");

  // reset state khi mở modal
  useEffect(() => {
    setSelectedType(""); // 👈 luôn reset rỗng để bắt buộc chọn mới
  }, [isOpen]);

  // lock scroll khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChangeType = (e) => {
    e.preventDefault();
    if (onChangeType && selectedType) {
      onChangeType(selectedType);
    }
    onClose();
  };

  // loại bỏ type hiện tại khỏi danh sách
  const filteredTypes = bookingTypes.filter(
    (type) => type.value !== initialType
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(30, 41, 59, 0.4)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Đổi kiểu thuê
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <form onSubmit={handleChangeType} className="space-y-4">
              {/* Hiển thị kiểu hiện tại */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Kiểu hiện tại:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bookingTypes.find((t) => t.value === initialType)?.label}
                </span>
              </p>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Chọn kiểu booking mới
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  required
                >
                  <option value="" disabled>
                    Chọn kiểu booking...
                  </option>
                  {filteredTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!selectedType}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  Đổi kiểu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ChangeBookingTypeModal;
