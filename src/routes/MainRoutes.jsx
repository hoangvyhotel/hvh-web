import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import LoginPage from '../sections/auth/AuthLogin';

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
      element: <SamplePage />
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
