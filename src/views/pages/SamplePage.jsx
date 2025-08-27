import Typography from '@mui/material/Typography';
import MainCard from 'components/cards/MainCard';
import { Link } from 'react-router-dom';

export default function SamplePage() {
  const cards = [
    { title: 'Phòng', content: 'Phòng', link: '/pages/management/room-management' },
    { title: 'Cập nhật giá phòng', content: 'Cập nhật giá phòng', link: '/pages/management/price-management' },
    { title: 'Nước', content: 'Nước', link: '/pages/management/utility-management' },
    { title: 'Danh sách thuê', content: 'Danh sách', link: '/pages/management/rental-management' },
    { title: 'Chi phí', content: 'Chi phí', link: '/pages/management/expense-management' },
    { title: 'Danh sách', content: 'Danh sách', link: '/management/profit-management' },
    { title: 'Tổng kết', content: 'Extra card example', link: '/management/summary-management' },
    { title: 'Đổi mật khẩu', content: 'Extra card example', link: '/pages/management/change-password' },
    { title: 'Đổi mật khẩu admin', content: 'Extra card example', link: '/management/change-password-admin' }
  ];

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
