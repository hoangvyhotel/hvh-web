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
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
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
import MainBackButton from 'components/buttons/BackButton';

// no local sample data: table will be populated from API

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

  // load list from API (hotelId handled on backend or by default)
  const listQuery = useApiQuery(['utilities'], utilitiesRequests.list());

  useEffect(() => {
    // map incoming query data (supports either raw array or wrapper { data: [...] })
    const d = listQuery.data;
    // eslint-disable-next-line no-console
    console.log('utilities listQuery', { isLoading: listQuery.isLoading, isError: listQuery.isError, data: d, error: listQuery.error });
    if (!d) return;
    const items = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
    const mapped = items.map((it) => ({
      id: it._id ?? it.id,
      name: it.name,
      price: formatPrice(it.price),
      status: it.status ? 'Đang bán' : 'Không hoạt động',
      icon: it.icon
    }));
    setRows(mapped);
  }, [listQuery.data, listQuery.isLoading, listQuery.isError, listQuery.error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name || '—',
      price: Number(String(form.price).replace(/[^0-9.-]+/g, '')) || 0,
      icon: form.icon || '',
      status: !!form.status,
      hotelId: '60d5ecb54b24c2001f6479a1'
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, ...payload },
        {
          onSuccess: (res) => {
            // res may be wrapper or object
            const item = res?.data ?? res;
            const mapped = {
              id: item._id ?? item.id,
              name: item.name,
              price: formatPrice(item.price),
              status: item.status ? 'Đang bán' : 'Không hoạt động',
              icon: item.icon
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
          const mapped = {
            id: item._id ?? item.id,
            name: item.name,
            price: formatPrice(item.price),
            status: item.status ? 'Đang bán' : 'Không hoạt động',
            icon: item.icon
          };
          setRows((r) => [mapped, ...r]);
          handleClose();
        }
      });
    }
  };

  const handleEdit = (row) => {
  setEditId(row.id);
  setForm({ name: row.name || '', price: String(row.price).replace(/[^0-9.-]+/g, ''), icon: row.icon || '', status: row.status === 'Đang bán' });
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
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <MainBackButton onClick={() => navigate('/pages/management')}>Quay lại</MainBackButton>
        </Grid>

        <Grid item xs sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.dark', display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '26px' }}>
            <RoomServiceIcon sx={{ color: 'success.main', fontSize: '28px' }} />
            Danh sách dịch vụ
          </Typography>
        </Grid>

        <Grid item>
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' }, fontSize: '0.95rem', paddingX: 2 }}
          >
            Thêm dịch vụ
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Divider />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
        {listQuery.isLoading && (
          <Typography sx={{ p: 3 }}>Đang tải dữ liệu...</Typography>
        )}
        {listQuery.isError && (
          <Typography color="error" sx={{ p: 3 }}>
            Lỗi khi tải: {listQuery.error?.message ?? 'Không xác định'}
          </Typography>
        )}
        {!listQuery.isLoading && !listQuery.isError && rows.length === 0 && (
          <Typography sx={{ p: 3 }}>Chưa có dịch vụ nào.</Typography>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 360, minWidth: 240, fontWeight: 700, color: 'success.dark', fontSize: '1.1rem' }}>Tên</TableCell>
              <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600 }}>Giá</TableCell>
              <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600 }}>Tình Trạng</TableCell>
              <TableCell align="right" sx={{ fontSize: '1.05rem', fontWeight: 600 }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, width: 360, minWidth: 240 }}>
                  {row.icon ? (
                    <Avatar src={row.icon} alt={row.name} sx={{ width: 44, height: 44 }} />
                  ) : (
                    <Battery80Icon color="success" sx={{ fontSize: 36 }} />
                  )}
                  <Typography sx={{ fontWeight: 700, color: 'success.main', fontSize: '1.125rem' }}>{row.name}</Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <div>
                    <Typography sx={{ color: 'success.main', fontWeight: 700, fontSize: '1.05rem' }}>{row.price}</Typography>
                  </div>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={row.status}
                    variant="outlined"
                    sx={{
                      color: row.status === 'Đang bán' ? 'success.main' : 'warning.main',
                      borderColor: 'transparent',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      paddingY: 0.5,
                      paddingX: 1.25
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 2 }}>
                  <Button onClick={() => handleEdit(row)} variant="outlined" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none', mr: 1, paddingY: 0.5, paddingX: 1.25 }}>
                    Cập nhật
                  </Button>
                  <Button onClick={() => handleDelete(row.id)} variant="outlined" color="error" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none', paddingY: 0.5, paddingX: 1.25 }}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Tên dịch vụ" name="name" value={form.name} onChange={handleChange} fullWidth />
              <TextField label="Giá (số)" name="price" value={form.price} onChange={handleChange} fullWidth />
              <TextField
                label="Icon (URL hoặc path)"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                helperText="Ví dụ: /assets/images/water.svg hoặc https://..."
                fullWidth
              />
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
