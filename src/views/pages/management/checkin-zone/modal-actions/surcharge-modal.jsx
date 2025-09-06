import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SurchargeModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [Content, setContent] = useState('');
  const [Amount, setAmount] = useState('');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.Content || '');
      setAmount(initialData.Amount?.toString() || '');
    } else {
      setContent('');
      setAmount('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const surcharge = {
      ...initialData,
      Content,
      Amount: Number(Amount),
    };
    if (onSave) onSave(surcharge);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Phụ thu</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Lý do</label>
                <input
                  type="text"
                  value={Content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập lý do phụ thu..."
                  required
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Số tiền (VND)</label>
                <input
                  type="number"
                  value={Amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-white border rounded-lg">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-700 rounded-lg">
                  Lưu
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

export default SurchargeModal;
