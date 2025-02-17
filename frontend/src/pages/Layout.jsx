import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuthCheck from '../hooks/useAuthCheck.js';

function Layout() {
  const isAuthChecked = useAuthCheck();

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

export default Layout