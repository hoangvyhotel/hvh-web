import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DocumentModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [idValue, setIdValue] = useState('');
  const [typeId, setTypeId] = useState('CCCD');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [gender, setGender] = useState('Male');
  const [ethnicGroup, setEthnicGroup] = useState('');

  useEffect(() => {
    if (initialData) {
      setIdValue(initialData.ID || '');
      setTypeId(initialData.TypeID || 'CCCD');
      setFullName(initialData.FullName || '');
      setAddress(initialData.Address || '');
      setBirthDay(initialData.BirthDay || '');
      setGender(initialData.Gender ? 'Male' : 'Female');
      setEthnicGroup(initialData.EthnicGroup || '');
    } else {
      setIdValue('');
      setTypeId('CCCD');
      setFullName('');
      setAddress('');
      setBirthDay('');
      setGender('Male');
      setEthnicGroup('');
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
    const data = {
      ID: idValue,
      TypeID: typeId,
      FullName: fullName,
      Address: address,
      BirthDay: birthDay,
      Gender: gender === 'Male',
      EthnicGroup: ethnicGroup
    };
    if (onSave) onSave(data);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.4)' }}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Lưu giữ giấy tờ</h3>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Số CCCD/CMND</label>
                <input value={idValue} onChange={(e) => setIdValue(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Loại giấy tờ</label>
                <select value={typeId} onChange={(e) => setTypeId(e.target.value)} className="w-full border p-2 rounded">
                  <option value="CCCD">CCCD</option>
                  <option value="CMND">CMND</option>
                  <option value="Passport">Hộ Chiếu</option>
                  <option value="DriverLicense">Bằng Lái</option>
                  <option value="VehicleReg">Cà Vẹt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Họ và tên</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Địa chỉ</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Ngày sinh</label>
                <input type="date" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Giới tính</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border p-2 rounded">
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Dân tộc</label>
                <input value={ethnicGroup} onChange={(e) => setEthnicGroup(e.target.value)} className="w-full border p-2 rounded" />
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

export default DocumentModal;
