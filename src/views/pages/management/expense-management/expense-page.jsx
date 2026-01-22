import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '../../../../layouts/HotelManagementLayout/Header';
import { http } from '../../../../lib/http/axios';
import { expenseRequests } from '../../../../services/expenseService';
import ExpenseItem from '../../../../components/items/ExpenseItem';
import ExpenseModal from './action-form/form-expense';
import ConfirmModal from 'components/ui/modal/confirm-modal';
import { FileText } from 'lucide-react';

const ExpenseManagement = () => {
  // ---------------- STATE ----------------
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingExpense, setEditingExpense] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // ---------------- FETCH DATA ----------------
  const fetchData = async (y, m) => {
    setLoading(true);
    setError(null);
    try {
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      const res = await http(expenseRequests.getAll('68a6b81c9924e1f3880ce291', monthStr));
      setExpenses(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách chi phí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  // ---------------- HANDLERS ----------------
  const openAddModal = () => {
    setModalMode('add');
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setModalMode('edit');
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (expense, mode) => {
    try {
      if (mode === 'add') {
        await http(expenseRequests.add(expense));
        toast.success('Thêm chi phí thành công!');
      } else {
        await http(expenseRequests.update(expense._id, expense));
        toast.success('Cập nhật chi phí thành công!');
      }
      fetchData(year, month);
    } catch (err) {
      console.error(err);
      toast.error('Thao tác thất bại!');
    }
  };

  const openConfirmModal = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await http(expenseRequests.delete(deleteId));
      toast.success('Xóa chi phí thành công!');
      fetchData(year, month);
    } catch (err) {
      console.error(err);
      toast.error('Xóa chi phí thất bại!');
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // ---------------- RENDER ----------------
  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <>
      {/* HEADER */}
      <div className="border-b border-gray-300 mb-4" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Quản lý chi phí" icon={<FileText className="w-6 h-6 mr-2 text-green-600" />} />
      </div>

      {/* FILTER & ADD BUTTON */}
      <div className="p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto"
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </div>

          <button
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors cursor-pointer w-full sm:w-auto"
            onClick={openAddModal}
          >
            Thêm chi phí
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-12 gap-2 py-4 px-2 md:px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700 text-xs md:text-base">
          <div className="col-span-2">Ngày</div>
          <div className="col-span-2">Số tiền</div>
          <div className="col-span-4">Lý do</div>
          <div className="col-span-2">Ghi chú</div>
          <div className="col-span-2 text-center"></div>
        </div>

        {/* EXPENSE LIST */}
        <div className="bg-white">
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Không có dữ liệu</div>
          ) : (
            expenses.map((exp) => <ExpenseItem key={exp._id} expense={exp} onEdit={openEditModal} onDelete={openConfirmModal} />)
          )}
        </div>

        {/* MODALS */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExpense}
          mode={modalMode}
          initialData={editingExpense}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Xóa chi phí"
          content="Bạn có chắc chắn muốn xóa chi phí này không?"
          className="max-w-md"
        />
      </div>
    </>
  );
};

export default ExpenseManagement;
