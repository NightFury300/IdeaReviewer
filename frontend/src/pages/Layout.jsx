import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useAuthCheck from '../hooks/useAuthCheck.js';
import AuthButtons from '../components/AuthComponents/AuthButtons.jsx';
import { useSelector } from 'react-redux';
import LogoutButton from '../components/AuthComponents/LogoutButton.jsx';
import { Lightbulb } from 'lucide-react';

function Layout() {
  const isAuthChecked = useAuthCheck();
  const isLoggedIn = useSelector((state) => state.auth.loginStatus)
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-yellow-400 font-semibold' : 'text-gray-700';
  };

  if (!isAuthChecked) {
    return  <>
              {/* Warning Message Banner */}
              <div className="w-full bg-red-600 text-white text-center py-2 font-semibold">
                Please note: This website is hosted on a free platform. The first time you access the site or after some inactivity, it may take a minute for the backend to start. If something isn't working right away, kindly try again in a minute or less.
              </div>
              <div>Loading...</div>
            </>;
  }

  return  (
    <div className="min-h-screen flex flex-col bg-gray-50">
    {/* Warning Message Banner */}
    <div className="w-full bg-red-600 text-white text-center py-2 font-semibold">
        Please note: This website is hosted on a free platform. The first time you access the site or after some inactivity, it may take a minute for the backend to start. If something isn't working right away, kindly try again in a minute or less.
      </div>
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="flex flex-col items-start text-3xl font-extrabold text-gray-800 tracking-tight hover:text-yellow-400 transition">
        <div className="flex items-center">
          <Lightbulb size={36} className="text-yellow-400 mr-2" />
            IdeaHub
        </div>
        <span className="text-xs font-semibold text-gray-600 tracking-wide ml-10">
          Discover & Share Ideas
        </span>
      </Link>

        <nav className="flex gap-6">
          <Link
            to="/"
            className={`${isActive('/')} hover:text-yellow-400 transition`}
          >
            Home
          </Link>
          <Link
            to="/ideas"
            className={`${isActive('/ideas')} hover:text-yellow-400 transition`}
          >
            My Ideas
          </Link>
        </nav>
        {isLoggedIn ? <LogoutButton/> : <AuthButtons/>}
      </header>

      <main className="flex-grow p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} IdeaReviewer. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout