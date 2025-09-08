import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const VehicleModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [license, setLicense] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('Car');

  useEffect(() => {
    if (initialData) {
      setLicense(initialData.LicensePlate || '');
      setColor(initialData.Color || '');
      setType(initialData.Type || 'Car');
    } else {
      setLicense('');
      setColor('');
      setType('Car');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { LicensePlate: license, Color: color, Type: type };
    if (onSave) onSave(data);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.4)' }}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Thông tin xe</h3>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Biển số</label>
                <input value={license} onChange={(e) => setLicense(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Màu</label>
                <input value={color} onChange={(e) => setColor(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Loại xe</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded">
                  <option value="Car">Xe hơi</option>
                  <option value="Motor">Xe máy</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default VehicleModal;
