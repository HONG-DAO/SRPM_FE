import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
  const user = sessionStorage.getItem('accessToken');
  console.log('>>>', user);
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const ProtectedRoute = () => {
  const user = sessionStorage.getItem('accessToken');

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};
