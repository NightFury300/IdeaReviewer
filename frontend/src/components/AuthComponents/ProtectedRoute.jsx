import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({ element }) {
  const isAuthenticated = useSelector((state) => state.auth.loginStatus);

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to={`/login`} replace />
  );
}

export default ProtectedRoute;
