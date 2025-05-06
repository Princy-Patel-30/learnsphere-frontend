import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import React from 'react'
const DashboardProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/select-role" replace />;
  }
  return children;
};

export default DashboardProtectedRoute;