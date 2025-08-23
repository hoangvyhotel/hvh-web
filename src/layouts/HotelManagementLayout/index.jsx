import { Outlet } from 'react-router-dom';

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
