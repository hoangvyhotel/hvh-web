import Typography from '@mui/material/Typography';
import MainCard from 'components/cards/MainCard';
import { Link } from 'react-router-dom';

export default function SamplePage() {
  // show different cards depending on user role
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : '';

  const adminCards = [
    { title: 'Phòng', link: '/pages/management/room-management' },
    { title: 'Cập nhật giá phòng', link: '/pages/management/price-management' },
    { title: 'Nước', link: '/pages/management/utility-management' },
    { title: 'Danh sách thuê', link: '/pages/management/rental-management' },
    { title: 'Chi phí', link: '/pages/management/expense-management' },
    { title: 'Danh sách', link: '/pages/management/profit-management' },
    { title: 'Tổng kết', link: '/pages/management/summary-management' },
    { title: 'Đổi mật khẩu', link: '/pages/management/change-password' },
    { title: 'Đổi mật khẩu quản trị', link: '/pages/management/change-password-manager' },
    { title: 'Tạo tài khoản mới', link: '/pages/management/create-user' }
  ];

  const staffCards = [
    { title: 'Phòng', link: '/pages/management/room-management' },
    { title: 'Cập nhật giá phòng', link: '/pages/management/price-management' },
    { title: 'Nước', link: '/pages/management/utility-management' },
    { title: 'Danh sách thuê', link: '/pages/management/rental-management' },
    { title: 'Chi phí', link: '/pages/management/expense-management' },
    { title: 'Danh sách', link: '/pages/management/profit-management' },
    { title: 'Tổng kết', link: '/pages/management/summary-management' },
    { title: 'Đổi mật khẩu', link: '/pages/management/change-password' },
    { title: 'Đổi mật khẩu quản trị', link: '/pages/management/change-password-manager' }
  ];

  const cards = role === 'admin' ? adminCards : staffCards;

  return (
    <MainCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <Link to={card.link} key={index} className="block p-4 rounded shadow-sm bg-white transition border border-gray-200">
            <Typography variant="h3" className="mb-2 text-gray-800 text-center">
              {card.title}
            </Typography>
          </Link>
        ))}
      </div>
    </MainCard>
  );
}
