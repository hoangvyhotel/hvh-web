import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import RoomManagement from '../views/pages/management/room-management';
import ExpenseManagement from '../views/pages/management/expense-management/expense-page';
import HotelManagementLayout from '../layouts/HotelManagementLayout';
import RetalManagement from '../views/pages/management/rental-management';
import ChangePassword from '../views/pages/management/change-password';
import RoomPriceUpdate from 'views/pages/management/price-management/update-price-page';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));
const UtilitiesPage = Loadable(lazy(() => import('views/pages/management/Utilities')));

// utils
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/pages/home',
      element: <DashboardDefault />
    },
    {
      path: '/pages/instruction',
      element: <SamplePage />
    },
    {
      path: '/pages/management',
      element: <HotelManagementLayout />,
      children: [
        {
          path: '',
          element: <SamplePage />
        },
        {
          path: 'room-management',
          element: <RoomManagement />
        },
        {
          path: 'rental-management',
          element: <RetalManagement />
        },
        {
          path: 'change-password',
          element: <ChangePassword />,
          path: 'expense-management',
          element: <ExpenseManagement />
        },
        {
          path: 'price-management',
          element: <RoomPriceUpdate />
        }
      ]
    },
    {
      path: '/pages/management/utilities',
      element: <UtilitiesPage />
    },
    {
      path: '/pages/lodging-report',
      element: <SamplePage />
    },
  // auth routes removed
    {
      path: 'components',
      children: [
        {
          path: 'typography',
          element: <UtilsTypography />
        }
      ]
    }
  ]
};

export default MainRoutes;
