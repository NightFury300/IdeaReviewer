import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useAuthCheck from '../hooks/useAuthCheck.js';
import AuthButtons from '../components/AuthComponents/AuthButtons.jsx';
import { useSelector } from 'react-redux';
import LogoutButton from '../components/AuthComponents/LogoutButton.jsx';

function Layout() {
  const isAuthChecked = useAuthCheck();
  const isLoggedIn = useSelector((state) => state.auth.loginStatus)
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500 font-semibold' : 'text-gray-700';
  };

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return  (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-500 transition">
          IdeaReviewer
        </Link>
        <nav className="flex gap-6">
          <Link
            to="/"
            className={`${isActive('/')} hover:text-blue-500 transition`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`${isActive('/profile')} hover:text-blue-500 transition`}
          >
            My Profile
          </Link>
        </nav>
        {isLoggedIn ? <LogoutButton/> : <AuthButtons/>}
      </header>

      {/* Page Content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} IdeaReviewer. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout