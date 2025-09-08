import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { http } from 'lib/http/axios';
import { bookingRequests } from 'services/bookingService';
import { toast } from 'react-toastify';
import VehicleModal from './vehicle-modal';

const VehicleEditor = ({ isOpen, onClose, bookingId, onSave }) => {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIndex(0);
    const load = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        const res = await http(bookingRequests.getCars(bookingId));
        if (res.data?.succeeded) setItems(res.data.data || []);
        else toast.error(res.data?.message || 'Không thể tải thông tin xe');
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải thông tin xe');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const current = items[index] || null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(30,41,59,0.4)' }}>
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Xem & sửa thông tin xe ({items.length})</h3>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>

          <div className="p-4">
            {loading && <div>Đang tải...</div>}
            {!loading && !current && <div>Không có thông tin xe</div>}
            {!loading && current && (
              <div className="space-y-2 text-sm">
                <div><strong>Biển số:</strong> {current.LicensePlate}</div>
                <div><strong>Màu:</strong> {current.Color}</div>
                <div><strong>Loại:</strong> {current.VehicleType}</div>

                <div className="flex items-center gap-2 mt-4">
                  <button disabled={index <= 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                  <span className="text-sm">{index + 1}/{items.length}</span>
                  <button disabled={index >= items.length - 1} onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>

                  <button onClick={() => setEditingOpen(true)} className="ml-auto px-3 py-1 bg-blue-600 text-white rounded">Sửa</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingOpen && current && (
        <VehicleModal
          isOpen={editingOpen}
          onClose={() => setEditingOpen(false)}
          initialData={current}
          onSave={async (data) => {
            try {
              // try to identify vehicle by license plate or an _id
              const licensePlate = current.LicensePlate || current.licensePlate || current._id;
              const updates = {
                LicensePlate: data.LicensePlate,
                Color: data.Color,
                VehicleType: data.Type || data.VehicleType
              };

              const dto = {
                bookingId,
                licensePlate,
                updates
              };

              const res = await http(bookingRequests.updateCar(dto));
              if (res.data?.succeeded === false) {
                toast.error(res.data?.message || 'Cập nhật thông tin xe thất bại');
              } else {
                toast.success(res.data?.message || 'Cập nhật thông tin xe thành công');
                try {
                  const r2 = await http(bookingRequests.getCars(bookingId));
                  if (r2.data?.succeeded) setItems(r2.data.data || []);
                } catch (err) {
                  console.error(err);
                }
                if (typeof onSave === 'function') await onSave(data);
              }
            } catch (err) {
              console.error(err);
              toast.error('Cập nhật thông tin xe thất bại');
            }
            setEditingOpen(false);
          }}
        />
      )}
    </div>,
    document.body
  );
};

export default VehicleEditor;
