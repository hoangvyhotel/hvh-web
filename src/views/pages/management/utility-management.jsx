import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Battery80Icon from '@mui/icons-material/Battery80';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/cards/MainCard';
import { useApiQuery, useApiMutation } from 'hooks/useApi';
import { utilitiesRequests } from 'services/utilitiesService';
import { useHotelState } from 'hooks/useAuth';
import MainBackButton from 'components/buttons/BackButton';
import Header from 'layouts/HotelManagementLayout/Header';
import { Tag } from 'lucide-react';
import IconPicker from 'components/IconPicker';
import { resolveIcon } from 'utils/iconResolver';

// curated small set of lucide icon names used by IconPicker in utilities
const ALLOWED_ICONS = [
  'Milk',
  'Apple',
  'Pizza',
  'Bottle',
  'SmartphoneCharging',
  'CupSoda',
  'Hamburger',
  'Cookie',
  'EggFried',
  'Wifi',
  'Wine',
  'Fridge',
  'Car',
  'Phone',
  'Droplet',
  'Shower',
  'Shirt',
  'Drum',
  'Gift'
];

export default function UtilitiesPage() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', icon: '', status: true });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', price: '', icon: '', status: true });
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const formatPrice = (v) => {
    if (v == null || v === '') return '';
    const num = Number(String(v).replace(/[^0-9.-]+/g, '')) || 0;
    return num.toLocaleString('en-US') + 'vnđ';
  };

  const toNumberString = (v) => {
    if (v == null || v === '') return '';
    // remove non-digits
    return String(v).replace(/[^0-9.-]+/g, '');
  };

  const createMutation = useApiMutation((dto) => utilitiesRequests.create(dto));
  const updateMutation = useApiMutation((dto) => utilitiesRequests.update(dto.id, dto));
  const deleteMutation = useApiMutation((id) => utilitiesRequests.remove(id));

  const { hotelId } = useHotelState();

  // load list from API using current hotelId
  const listQuery = useApiQuery(['utilities', hotelId], utilitiesRequests.list({ hotelId }));

  useEffect(() => {
    // map incoming query data (supports either raw array or wrapper { data: [...] })
    const d = listQuery.data;
    // eslint-disable-next-line no-console
    console.log('utilities listQuery', { isLoading: listQuery.isLoading, isError: listQuery.isError, data: d, error: listQuery.error });
    if (!d) return;
    const items = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
    const parseIcon = (v) => {
      if (v == null) return '';
      if (typeof v === 'object') return v;
      if (typeof v === 'string') {
        try {
          const parsed = JSON.parse(v);
          return parsed;
        } catch (e) {
          return v; // plain URL or name
        }
      }
      return '';
    };

    const mapped = items.map((it) => ({
      id: it._id ?? it.id,
      name: it.name,
      price: formatPrice(it.price),
      status: it.status ? 'Đang bán' : 'Không hoạt động',
      icon: parseIcon(it.icon)
    }));
  // debug: log parsed icons to verify shape at runtime
  // eslint-disable-next-line no-console
  console.debug('utilities.parsedIcons', mapped.map((m) => ({ id: m.id, icon: m.icon })));
  setRows(mapped);
  }, [listQuery.data, listQuery.isLoading, listQuery.isError, listQuery.error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const iconValue = typeof form.icon === 'object' && form.icon !== null ? JSON.stringify(form.icon) : (form.icon || '');

    const payload = {
      name: form.name || '—',
      price: Number(String(form.price).replace(/[^0-9.-]+/g, '')) || 0,
      icon: iconValue,
      status: !!form.status,
      hotelId
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, ...payload },
        {
          onSuccess: (res) => {
            // res may be wrapper or object
            const item = res?.data ?? res;
            const parsedIcon = (() => {
              try {
                if (typeof item.icon === 'string') return JSON.parse(item.icon);
              } catch (e) {}
              return item.icon;
            })();

            const mapped = {
              id: item._id ?? item.id,
              name: item.name,
              price: formatPrice(item.price),
              status: item.status ? 'Đang bán' : 'Không hoạt động',
              icon: parsedIcon
            };
            setRows((prev) => prev.map((r) => (r.id === editId ? mapped : r)));
            handleClose();
          }
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (res) => {
          const item = res?.data ?? res;
          const parsedIcon = (() => {
            try {
              if (typeof item.icon === 'string') return JSON.parse(item.icon);
            } catch (e) {}
            return item.icon;
          })();

          const mapped = {
            id: item._id ?? item.id,
            name: item.name,
            price: formatPrice(item.price),
            status: item.status ? 'Đang bán' : 'Không hoạt động',
            icon: parsedIcon
          };
          setRows((r) => [mapped, ...r]);
          handleClose();
        }
      });
    }
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({
      name: row.name || '',
      price: String(row.price).replace(/[^0-9.-]+/g, ''),
      icon: row.icon || '',
      status: row.status === 'Đang bán'
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => setRows((prev) => prev.filter((r) => r.id !== id))
    });
  };

  return (
    <MainCard>
      <div className="border-b border-gray-300 mb-4 flex items-center justify-between" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Quản lý dịch vụ" icon={<Tag className="w-6 h-6 mr-2 text-blue-600" />} />
        <Grid item>
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' }, fontSize: '0.95rem', paddingX: 2 }}
          >
            Thêm dịch vụ
          </Button>
        </Grid>
      </div>

      <div className="p-6">
        {listQuery.isLoading && <div className="p-3">Đang tải dữ liệu...</div>}
        {listQuery.isError && <div className="p-3 text-red-600">Lỗi khi tải: {listQuery.error?.message ?? 'Không xác định'}</div>}
        {!listQuery.isLoading && !listQuery.isError && rows.length === 0 && <div className="p-3">Chưa có dịch vụ nào.</div>}

        <div className="mt-4">
          <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
            <div className="col-span-6">Tên</div>
            <div className="col-span-2">Giá</div>
            <div className="col-span-2">Tình Trạng</div>
            <div className="col-span-2 text-right">Hành động</div>
          </div>

          <div className="bg-white">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-100 items-center">
                <div className="col-span-6 flex items-center gap-3">
                  {row.icon ? (
                    // icon may be a URL string or metadata object
                    typeof row.icon === 'string' ? (
                      <Avatar src={row.icon} alt={row.name} sx={{ width: 44, height: 44 }} />
                    ) : (
                      <Avatar sx={{ width: 44, height: 44, bgcolor: 'transparent' }}>
                        {resolveIcon(row.icon, { size: 28, color: '#1f2937' })}
                      </Avatar>
                    )
                  ) : (
                    <Battery80Icon color="success" sx={{ fontSize: 36 }} />
                  )}
                  <div className="font-semibold text-success-main text-lg">{row.name}</div>
                </div>
                <div className="col-span-2">{row.price}</div>
                <div className="col-span-2">{row.status}</div>
                <div className="col-span-2 text-right">
                  <Button onClick={() => handleEdit(row)} variant="outlined" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none', mr: 1, paddingY: 0.5, paddingX: 1.25 }}>
                    Cập nhật
                  </Button>
                  <Button onClick={() => handleDelete(row.id)} variant="outlined" color="error" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none', paddingY: 0.5, paddingX: 1.25 }}>
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Tên dịch vụ" name="name" value={form.name} onChange={handleChange} fullWidth />
              <TextField label="Giá (số)" name="price" value={form.price} onChange={handleChange} fullWidth />
              <div>
                <IconPicker
                  value={form.icon}
                  onChange={(v) => setForm((s) => ({ ...s, icon: v }))}
                  size={28}
                  allowedIcons={ALLOWED_ICONS}
                />
                <div style={{ marginTop: 6, color: '#6b7280', fontSize: '0.85rem' }}>Bạn có thể nhập tên lucide (ví dụ: Droplet) hoặc dán URL ảnh.</div>
              </div>
              <FormControlLabel control={<Switch checked={form.status} onChange={handleChange} name="status" />} label="Hoạt động" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
