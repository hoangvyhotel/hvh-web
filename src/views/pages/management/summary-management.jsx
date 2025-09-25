import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// project
import MainCard from 'components/cards/MainCard';
import Header from 'layouts/HotelManagementLayout/Header';
import { BarChart } from 'lucide-react';

// services
import { billsRequests } from 'services/billsService';
import { expenseRequests, fetchMonthlyExpenses } from 'services/expenseService';
import { useApiQuery } from 'hooks/useApi';
import { useHotelState } from 'hooks/useAuth';

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();

export default function SummaryManagement() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const { hotelId } = useHotelState();

  const { data: billsData, isLoading } = useApiQuery(['bills', month, year, hotelId], billsRequests.daily({ month, year, hotelId }));

  const { data: monthlyData, isLoading: monthlyLoading } = useApiQuery(
    ['bills-monthly', month, year, hotelId],
    billsRequests.monthly({ month, year, hotelId })
  );

  // fetch expenses for the month
  // use useApiQuery with a request object similar to other services
  const { data: expensesData, isLoading: expensesLoading } = useApiQuery(
    ['expenses-monthly', month, year, hotelId],
    expenseRequests.monthly({ month, year, hotelId })
  );

  // helper to read monthly totals from different API response shapes
  const getMonthlyField = (field) => {
    if (!monthlyData) return null;
    // common shapes: { data: { totalUtilities: X } } or { totalUtilities: X } or { data: { data: { totalUtilities: X } } }
    return monthlyData?.data?.[field] ?? monthlyData?.[field] ?? monthlyData?.data?.data?.[field] ?? null;
  };

  const getExpenseTotal = () => {
    if (!expensesData) return null;
    // possible shapes: { data: { total: X } } or { total: X } or { data: { data: { total: X } } }
    return expensesData?.data?.total ?? expensesData?.total ?? expensesData?.data?.data?.total ?? 0;
  };

  // derived numbers
  const expenseTotal = Number(getExpenseTotal() ?? 0) || 0;
  const monthlyUtilities = Number(getMonthlyField('totalUtilities') ?? 0) || 0;
  const monthlyTotal = Number(getMonthlyField('total') ?? 0) || 0;
  const netUtilities = Number(monthlyUtilities) - Number(expenseTotal) || 0;
  const netTotal = Number(monthlyTotal) - Number(expenseTotal) || 0;

  return (
    <MainCard>
      <div className="border-b border-gray-300 mb-4 flex items-center justify-between" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Tổng kết" icon={<BarChart className="w-6 h-6 mr-2 text-blue-600" />} />
        <Grid item>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel id="month-label" sx={{ fontSize: '0.95rem' }}>
                Tháng
              </InputLabel>
              <Select
                labelId="month-label"
                value={month}
                label="Tháng"
                onChange={(e) => setMonth(e.target.value)}
                sx={{ fontSize: '1.05rem', py: 0.5 }}
                MenuProps={{ PaperProps: { sx: { fontSize: '1rem' } } }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m} sx={{ fontSize: '1rem' }}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="year-label" sx={{ fontSize: '0.95rem' }}>
                Năm
              </InputLabel>
              <Select
                labelId="year-label"
                value={year}
                label="Năm"
                onChange={(e) => setYear(e.target.value)}
                sx={{ fontSize: '1.05rem', py: 0.5 }}
                MenuProps={{ PaperProps: { sx: { fontSize: '1rem' } } }}
              >
                {[year - 1, year, year + 1].map((y) => (
                  <MenuItem key={y} value={y} sx={{ fontSize: '1rem' }}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </div>

      <Box sx={{ mt: 2 }}>
        <Divider />
      </Box>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
          <div className="col-span-6">Mục</div>
          <div className="col-span-3 text-right">Tiền nước</div>
          <div className="col-span-3 text-right">Tổng cộng</div>
        </div>

        <div className="bg-white">
          <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-100 items-center">
            <div className="col-span-6 font-semibold">CHI PHÍ</div>
            <div className="col-span-3 text-right">{expensesLoading ? '...' : '-'}</div>
            <div className="col-span-3 text-right">
              {expensesLoading ? (
                '...'
              ) : (
                <span className="text-red-600 font-bold">{formatCurrency(-1 * expenseTotal)}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-100 items-center">
            <div className="col-span-6 font-semibold">DOANH THU</div>
            <div className="col-span-3 text-right">{monthlyLoading || expensesLoading ? '...' : formatCurrency(monthlyUtilities)}</div>
            <div className="col-span-3 text-right">{monthlyLoading || expensesLoading ? '...' : formatCurrency(monthlyTotal)}</div>
          </div>

          <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 bg-gray-50">
            <div className="font-semibold">TỔNG SAU CHI PHÍ</div>
            <div className="text-right">
              {monthlyLoading || expensesLoading ? (
                '...'
              ) : (
                <span className="text-green-700 font-bold">{formatCurrency(netTotal)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading && <div className="p-3">Đang tải dữ liệu...</div>}
        {!isLoading && billsData && Array.isArray(billsData.data) && billsData.data.length === 0 && (
          <div className="p-3">Không có dữ liệu</div>
        )}

        <div className="mt-4">
          <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
            <div className="col-span-6">Thời điểm</div>
            <div className="col-span-3 text-right">Tiền nước</div>
            <div className="col-span-3 text-right">Doanh thu</div>
          </div>

          <div className="bg-white">
            {billsData &&
              Array.isArray(billsData.data) &&
              billsData.data.map((r) => {
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
                const label = weekday
                  ? `${weekday} (${String(r.day).padStart(2, '0')}/${String(month).padStart(2, '0')})`
                  : `(${String(r.day).padStart(2, '0')}/${String(month).padStart(2, '0')})`;

                return (
                  <div key={r.day} className="grid grid-cols-12 gap-2 py-4 px-4 border-b border-gray-100 items-center">
                    <div className="col-span-6 font-semibold">{label}</div>
                    <div className="col-span-3 text-right">{formatCurrency(r.totalUtilities)}</div>
                    <div className="col-span-3 text-right">{formatCurrency(r.total ?? null)}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </MainCard>
  );
}

// helpers
function formatCurrency(value) {
  if (value == null) return '-';
  const n = Number(value);
  if (isNaN(n)) return '-';
  const rounded = Math.round(n);
  return rounded.toLocaleString('vi-VN') + ' vnđ';
}
