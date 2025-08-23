import { ArrowLeftToLine } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Header = ({ title, icon }) => {
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
        {icon}
        <h1 className="font-bold text-2xl" style={{ color: '#348667' }}>
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
