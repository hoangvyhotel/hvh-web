import { ArrowLeftToLine, House } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="lg:pb-6 pb-4 flex">
      <NavLink
        to={'/pages/management'}
        className="flex items-center px-4 py-2 bg-gray-200 border rounded-lg space-x-2 hover:bg-gray-300 transition-colors cursor-pointer"
      >
        <ArrowLeftToLine className="w-4 h-4 text-gray-600" />
        <span className="font-semibold text-gray-700 hover:text-gray-900">Quay lại</span>
      </NavLink>
      <div className="flex-1 flex items-center justify-center">
        <House className="w-6 h-6 text-gray-600 mr-2" />
        <h1 className="font-bold text-2xl" style={{ color: '#348667' }}>
          Danh sách phòng
        </h1>
      </div>
    </header>
  );
};

export default Header;
