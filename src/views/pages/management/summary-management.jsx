import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// project
import MainCard from 'components/cards/MainCard';
import MainBackButton from 'components/buttons/BackButton';

// services
import { billsRequests } from 'services/billsService';
import { useApiQuery } from 'hooks/useApi';
import { useHotelState } from 'hooks/useAuth';

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();

export default function SummaryManagement() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const { hotelId } = useHotelState();

  const { data: billsData, isLoading } = useApiQuery(
    ['bills', month, year, hotelId],
    billsRequests.daily({ month, year, hotelId })
  );

  const { data: monthlyData, isLoading: monthlyLoading } = useApiQuery(
    ['bills-monthly', month, year, hotelId],
    billsRequests.monthly({ month, year, hotelId })
  );

  // helper to read monthly totals from different API response shapes
  const getMonthlyField = (field) => {
    if (!monthlyData) return null;
    // common shapes: { data: { totalUtilities: X } } or { totalUtilities: X } or { data: { data: { totalUtilities: X } } }
    return (
      monthlyData?.data?.[field] ?? monthlyData?.[field] ?? monthlyData?.data?.data?.[field] ?? null
    );
  };

  return (
    <MainCard>
      <Box sx={{ fontSize: '1.15rem' }}>
      <Grid container alignItems="center" spacing={2} justifyContent="space-between">
        <Grid item>
          <MainBackButton onClick={() => window.history.back()}>Quay Lại</MainBackButton>
        </Grid>

        <Grid item xs sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.dark', fontSize: '2.2rem' }}>
            TỔNG KẾT
          </Typography>
        </Grid>

        <Grid item>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel id="month-label" sx={{ fontSize: '0.95rem' }}>Tháng</InputLabel>
              <Select
                labelId="month-label"
                value={month}
                label="Tháng"
                onChange={(e) => setMonth(e.target.value)}
                sx={{ fontSize: '1.05rem', py: 0.5 }}
                MenuProps={{ PaperProps: { sx: { fontSize: '1rem' } } }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m} sx={{ fontSize: '1rem' }}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="year-label" sx={{ fontSize: '0.95rem' }}>Năm</InputLabel>
              <Select
                labelId="year-label"
                value={year}
                label="Năm"
                onChange={(e) => setYear(e.target.value)}
                sx={{ fontSize: '1.05rem', py: 0.5 }}
                MenuProps={{ PaperProps: { sx: { fontSize: '1rem' } } }}
              >
                {[year - 1, year, year + 1].map((y) => (
                  <MenuItem key={y} value={y} sx={{ fontSize: '1rem' }}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Divider />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 1000 }}></TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Tiền nước</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Tiền phòng</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Tổng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.25rem' }}>CHI PHÍ</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{formatCurrency(0)}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{formatCurrency(0)}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{formatCurrency(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.25rem' }}>DOANH THU</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(getMonthlyField('totalUtilities'))}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(getMonthlyField('totalRoom'))}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(getMonthlyField('total'))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Daily breakdown - data from API */}
  <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
                <TableRow>
          <TableCell sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Thời điểm</TableCell>
          <TableCell sx={{ fontWeight: 700, textAlign: 'right', fontSize: '1.15rem' }}>Tiền nước</TableCell>
          <TableCell sx={{ fontWeight: 700, textAlign: 'right', fontSize: '1.15rem' }}>Tiền phòng</TableCell>
          <TableCell sx={{ fontWeight: 700, textAlign: 'right', fontSize: '1.15rem' }}>Doanh thu</TableCell>
                </TableRow>
              </TableHead>
          <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center' }}>Loading...</TableCell>
                  </TableRow>
                )}

            {!isLoading && billsData && Array.isArray(billsData.data) && billsData.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center' }}>Không có dữ liệu</TableCell>
              </TableRow>
            )}

            {!isLoading && billsData && Array.isArray(billsData.data) && billsData.data.map((r) => {
              // safe weekday: use API weekday if available, otherwise compute from year/month/day
              const getWeekdayName = (y, m, d) => {
                try {
                  if (d == null) return '';
                  const date = new Date(Number(y), Number(m) - 1, Number(d));
                  return date.toLocaleDateString('vi-VN', { weekday: 'long' });
                } catch (e) {
                  return '';
                }
              };

              const weekday = r.weekday ?? getWeekdayName(year, month, r.day);
              const label = weekday ? `${weekday} (${String(r.day).padStart(2, '0')}/${String(month).padStart(2, '0')})` : `(${String(r.day).padStart(2, '0')}/${String(month).padStart(2, '0')})`;

              return (
                <TableRow key={r.day}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{label}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontSize: '1.1rem' }}>{formatCurrency(r.totalUtilities)}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontSize: '1.1rem' }}>{formatCurrency(r.totalRoom ?? r.totalRoomAmount ?? null)}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontSize: '1.1rem' }}>{formatCurrency(r.total)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </MainCard>
  );
}

// helpers
function formatCurrency(value) {
  if (value == null) return '-';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
}
