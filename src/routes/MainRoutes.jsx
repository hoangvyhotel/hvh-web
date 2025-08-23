import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import LoginPage from '../sections/auth/AuthLogin';
import RoomManagement from '../views/pages/management/room-management';
import HotelManagementLayout from '../layouts/HotelManagementLayout';
import CostManagement from '../views/pages/management/cost-management';
import RetalManagement from '../views/pages/management/rental-management';
import ChangePassword from '../views/pages/management/change-password';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

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
          path: 'cost-management',
          element: <CostManagement />
        },
        {
          path: 'rental-management',
          element: <RetalManagement />
        },
        {
          path: 'change-password',
          element: <ChangePassword />
        }
      ]
    },
    {
      path: '/pages/lodging-report',
      element: <SamplePage />
    },
    {
      path: '/auth/login',
      element: <LoginPage />
    },
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
