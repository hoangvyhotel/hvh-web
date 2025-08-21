import { Outlet } from 'react-router-dom';
import Header from './Header';

const HotelManagementLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default HotelManagementLayout;
