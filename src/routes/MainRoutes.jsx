import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import Login from 'views/auth/Login';
import RoomManagement from '../views/pages/management/room-management';
import ExpenseManagement from '../views/pages/management/expense-management/expense-page';
import HotelManagementLayout from '../layouts/HotelManagementLayout';
import RetalManagement from '../views/pages/management/rental-management';
import ChangePassword from '../views/pages/management/change-password';
import RoomPriceUpdate from 'views/pages/management/price-management/update-price-page';
import UtilitiesPage from 'views/pages/management/utility-management';
import SummaryManagement from 'views/pages/management/summary-management';
import AddUserPage from 'views/pages/management/create-user/create-user-page';
import { ProtectedRoute, AdminProtectedRoute } from 'hooks/useAuth';

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
      index: true,
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'pages/home',
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'pages/instruction',
      element: <SamplePage />
    },
    {
      path: 'pages/management',
      element: (
        <ProtectedRoute>
          <AdminProtectedRoute>
            <HotelManagementLayout />
          </AdminProtectedRoute>
        </ProtectedRoute>
      ),
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
        },
        {
          path: 'summary-management',
          element: <SummaryManagement />
        },
        {
          path: 'utility-management',
          element: <UtilitiesPage />
        },
        {
          path: 'create-user',
          element: <AddUserPage />
        }
      ]
    },
    {
      path: 'pages/lodging-report',
      element: <SamplePage />
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
