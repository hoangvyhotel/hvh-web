const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors items-center px-2 md:px-4 py-4 grid grid-cols-12 gap-2 text-xs md:text-base flex-col md:flex-row">
      {/* Ngày */}
      <div className="col-span-12 md:col-span-2 mb-2 md:mb-0">
        <span className="text-gray-700 font-semibold">{formatDate(expense.date)}</span>
      </div>

      {/* Số tiền */}
      <div className="col-span-12 md:col-span-2 mb-2 md:mb-0">
        <span className="text-gray-700 font-semibold">{formatPrice(expense.amount)}</span>
      </div>

      {/* Lý do */}
      <div className="col-span-12 md:col-span-4 whitespace-normal break-words text-gray-600 mb-2 md:mb-0">{expense.reason}</div>

      {/* Ghi chú */}
      <div className="col-span-12 md:col-span-2 whitespace-normal break-words text-gray-600 mb-2 md:mb-0">{expense.note}</div>

      {/* Actions */}
      <div className="col-span-12 md:col-span-2 flex items-center justify-center space-x-1">
        <button
          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors w-full md:w-auto mb-2 md:mb-0 cursor-pointer"
          onClick={() => onEdit(expense)}
        >
          CẬP NHẬT
        </button>
        <span className="hidden md:inline text-gray-400 text-sm">|</span>
        <button
          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors w-full md:w-auto cursor-pointer"
          onClick={() => onDelete(expense._id)}
        >
          XÓA
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
