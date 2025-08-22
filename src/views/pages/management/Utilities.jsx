import { useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Battery80Icon from '@mui/icons-material/Battery80';

// project imports
import MainCard from 'components/cards/MainCard';

const sampleData = [
  { id: 1, name: 'NGỌT', price: '20,000VND', status: 'Đang bán' },
  { id: 2, name: 'SUỐI', price: '10,000VND', status: 'Đang bán' },
  { id: 3, name: 'BIA', price: '20,000VND', status: 'Đang bán' }
];

export default function UtilitiesPage() {
  const [rows] = useState(sampleData);

  return (
    <MainCard title="Quản lý dịch vụ">
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          {/* larger heading for readability */}
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Danh sách dịch vụ
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" sx={{ fontSize: '0.95rem', paddingX: 2 }}>
            Thêm
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48 }} />
              <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600 }}>Tên</TableCell>
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
                <TableCell>
                  <Battery80Icon color="primary" fontSize="large" />
                </TableCell>
                <TableCell sx={{ fontSize: '1.05rem', py: 2 }}>{row.name}</TableCell>
                <TableCell sx={{ fontSize: '1.05rem', py: 2 }}>{row.price}</TableCell>
                <TableCell sx={{ fontSize: '1.05rem', py: 2 }}>{row.status}</TableCell>
                <TableCell align="right">
                  <Button color="info" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none', mr: 1 }}>
                    Cập nhật
                  </Button>
                  <Button color="error" size="small" sx={{ fontSize: '0.95rem', textTransform: 'none' }}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
