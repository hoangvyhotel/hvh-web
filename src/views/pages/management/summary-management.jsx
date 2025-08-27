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

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();

export default function SummaryManagement() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const hotelId = '68a6b81c9924e1f3880ce291';

  const { data: billsData, isLoading } = useApiQuery(
    ['bills', month, year, hotelId],
    billsRequests.daily({ month, year, hotelId })
  );

  const { data: monthlyData, isLoading: monthlyLoading } = useApiQuery(
    ['bills-monthly', month, year, hotelId],
    billsRequests.monthly({ month, year, hotelId })
  );

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
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(monthlyData?.data?.totalUtilities ?? null)}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(monthlyData?.data?.totalRoom ?? null)}</TableCell>
              <TableCell sx={{ fontSize: '1.25rem' }}>{monthlyLoading ? '...' : formatCurrency(monthlyData?.data?.total ?? null)}</TableCell>
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
      <TableCell sx={{ fontWeight: 700, textAlign: 'right', fontSize: '1.15rem' }}>Doanh thu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>Loading...</TableCell>
              </TableRow>
            )}

            {!isLoading && billsData && Array.isArray(billsData.data) && billsData.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>Không có dữ liệu</TableCell>
              </TableRow>
            )}

            {!isLoading && billsData && Array.isArray(billsData.data) && billsData.data.map((r) => (
              <TableRow key={r.day}>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{`${r.weekday} (${String(r.day).padStart(2, '0')}/${String(month).padStart(2, '0')})`}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '1.1rem' }}>{formatCurrency(r.totalUtilities)}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '1.1rem' }}>{formatCurrency(r.total)}</TableCell>
              </TableRow>
            ))}
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
