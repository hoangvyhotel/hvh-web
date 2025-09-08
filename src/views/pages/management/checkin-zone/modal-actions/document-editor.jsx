import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { http } from 'lib/http/axios';
import { bookingRequests } from 'services/bookingService';
import { toast } from 'react-toastify';
import DocumentModal from './document-modal';

const DocumentEditor = ({ isOpen, onClose, bookingId, onSave }) => {
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
        const res = await http(bookingRequests.getDocuments(bookingId));
        if (res.data?.succeeded) setItems(res.data.data || []);
        else toast.error(res.data?.message || 'Không thể tải giấy tờ');
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải giấy tờ');
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
            <h3 className="text-lg font-semibold">Xem & sửa giấy tờ ({items.length})</h3>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>

          <div className="p-4">
            {loading && <div>Đang tải...</div>}
            {!loading && !current && <div>Không có giấy tờ</div>}
            {!loading && current && (
              <div className="space-y-2 text-sm">
                <div><strong>Loại:</strong> {current.TypeID}</div>
                <div><strong>Số:</strong> {current.ID}</div>
                <div><strong>Họ và tên:</strong> {current.FullName}</div>
                <div><strong>Địa chỉ:</strong> {current.Address}</div>
                <div><strong>Ngày sinh:</strong> {current.BirthDay}</div>
                <div><strong>Giới tính:</strong> {current.Gender ? 'Nam' : 'Nữ'}</div>
                <div><strong>Dân tộc:</strong> {current.EthnicGroup}</div>

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
        <DocumentModal
          isOpen={editingOpen}
          onClose={() => setEditingOpen(false)}
          initialData={current}
          onSave={async (data) => {
            // perform update via API
            try {
              // try to find a document identifier
              const docId = current._id || current.id || current.ID || current.DocumentId || current.DocId || current.ID;
              const updates = {
                ID: data.ID,
                TypeID: data.TypeID,
                FullName: data.FullName,
                Address: data.Address,
                BirthDay: data.BirthDay,
                Gender: data.Gender,
                EthnicGroup: data.EthnicGroup
              };

              const dto = {
                bookingId,
                docId,
                updates
              };

              const res = await http(bookingRequests.updateDocument(dto));
              if (res.data?.succeeded === false) {
                toast.error(res.data?.message || 'Cập nhật giấy tờ thất bại');
              } else {
                toast.success(res.data?.message || 'Cập nhật giấy tờ thành công');
                // refresh list
                try {
                  const r2 = await http(bookingRequests.getDocuments(bookingId));
                  if (r2.data?.succeeded) setItems(r2.data.data || []);
                } catch (err) {
                  console.error(err);
                }
                // notify parent to refresh booking if provided
                if (typeof onSave === 'function') await onSave(data);
              }
            } catch (err) {
              console.error(err);
              toast.error('Cập nhật giấy tờ thất bại');
            }
            setEditingOpen(false);
          }}
        />
      )}
    </div>,
    document.body
  );
};

export default DocumentEditor;
