import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import PagesRoutes from './PagesRoutes';
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([AuthRoutes, AdminRoutes, MainRoutes, PagesRoutes], {
  basename: import.meta.env.VITE_APP_BASE_URL
});

export default router;
