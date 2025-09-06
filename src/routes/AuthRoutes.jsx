import Login from 'views/auth/Login';

const AuthRoutes = {
  // expose /login as a standalone top-level route so the login page
  // is rendered outside the main layout and doesn't create an empty
  // parent match at '/'.
  path: '/login',
  element: <Login />
};

export default AuthRoutes;
