// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  // Lấy role từ localStorage
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : '';

  if (role === 'admin') {
    // Admin chỉ hiển thị đổi mật khẩu admin và tạo tài khoản mới
    return (
      <MainCard title="Quản lý cho Admin">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Chức năng dành cho Admin
        </Typography>
        <ul style={{ fontSize: '1rem', lineHeight: '2' }}>
          <li>
            <a href="/management/change-password">Đổi mật khẩu admin</a>
          </li>
          <li>
            <a href="/management/create-user">Tạo tài khoản mới</a>
          </li>
        </ul>
      </MainCard>
    );
  }

  // Staff hiển thị các trang quản lý
  if (role === 'staff') {
    return (
      <MainCard title="Quản lý cho Nhân viên">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Các chức năng quản lý
        </Typography>
        <ul style={{ fontSize: '1rem', lineHeight: '2' }}>
          <li>
            <a href="/management/room-management">Quản lý phòng</a>
          </li>
          <li>
            <a href="/management/bill-management">Quản lý hóa đơn</a>
          </li>
          <li>
            <a href="/management/utility-management">Quản lý dịch vụ</a>
          </li>
          <li>
            <a href="/management/cost-management">Quản lý chi phí</a>
          </li>
          <li>
            <a href="/management/summary-management">Tổng hợp báo cáo</a>
          </li>
          <li>
            <a href="/management/services">Quản lý tiện ích</a>
          </li>
        </ul>
      </MainCard>
    );
  }

  // Nếu chưa đăng nhập hoặc role không xác định
  return (
    <MainCard title="Quản lý">
      <Typography variant="body2">Bạn chưa đăng nhập hoặc không có quyền truy cập.</Typography>
    </MainCard>
  );
}
