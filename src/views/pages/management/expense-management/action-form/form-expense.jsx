import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import { useHotelState } from 'hooks/useAuth';

const ExpenseModal = ({ isOpen, onClose, onSave, mode = 'add', initialData = null }) => {
  const { hotelId } = useHotelState();

  const [date, setDate] = useState('');
  const [reason, setReason] = useState('Lương nhân viên');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setDate(initialData.date ? initialData.date.split('T')[0] : '');
      setReason(initialData.reason || 'Lương nhân viên');
      setNote(initialData.note || '');
      setAmount(initialData.amount || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setReason('Lương nhân viên');
      setNote('');
      setAmount('');
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expense = {
      ...initialData,
      date: new Date(date).toISOString(),
      reason,
      note,
      amount: Number(amount),
      hotelId: initialData?.hotelId || hotelId
    };
    if (onSave) onSave(expense, mode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Chỉnh sửa chi phí' : 'Thêm chi phí'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Ngày"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              select
              label="Lý do"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            >
              <MenuItem value="Lương nhân viên">Lương nhân viên</MenuItem>
              <MenuItem value="Nhập hàng">Nhập hàng</MenuItem>
              <MenuItem value="Chi phí khác">Chi phí khác</MenuItem>
            </TextField>

            <TextField
              label="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Số tiền (VND)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === 'edit' ? 'Cập nhật' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseModal;
