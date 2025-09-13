import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import RoomManagement from '../views/pages/management/room-management';
import ExpenseManagement from '../views/pages/management/expense-management/expense-page';
import HotelManagementLayout from '../layouts/HotelManagementLayout';
import RetalManagement from '../views/pages/management/bill-management';
import ChangePassword from '../views/pages/management/change-password';
import RoomPriceUpdate from 'views/pages/management/price-management/update-price-page';
import UtilitiesPage from 'views/pages/management/utility-management';
import SummaryManagement from 'views/pages/management/summary-management';
import AddUserPage from 'views/pages/management/create-user/create-user-page';
import { ProtectedRoute, AdminProtectedRoute } from 'hooks/useAuth';
import CheckinPage from 'views/pages/management/checkin-zone/checkin-page';
import CheckoutConfirm from 'views/pages/management/checkin-zone/checkout-confirm';
import RoomTracking from 'views/pages/home/room-tracking/RoomTracking';
import ChangePasswordManager from 'views/pages/management/change-password-manager';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

// utils
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

// ==============================|| MAIN ROUTES ||============================== //

function AdminClearWrapper({ children }) {
  // previously this wrapper cleared the admin flag when entering management,
  // which caused the freshly set admin login to be revoked immediately and
  // triggered logout-like behavior that removed `username` from storage.
  // Keep this wrapper as a no-op to avoid those side-effects.
  return children;
}

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute>
          <RoomTracking />
        </ProtectedRoute>
      )
    },
    {
      path: 'pages/home/room-tracking',
      element: (
        <ProtectedRoute>
          <RoomTracking />
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
          <AdminClearWrapper>
            <HotelManagementLayout />
          </AdminClearWrapper>
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'checkin-zone',
          element: <CheckinPage />
        },
        {
          path: 'checkin-zone/checkout-confirm',
          element: <CheckoutConfirm />
        },
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
          element: <ChangePassword />
        },
        {
          path: 'change-password-manager',
          element: <ChangePasswordManager />
        },
        {
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
