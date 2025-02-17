import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/userAPI';

function LogoutButton() {
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            await logoutUser()
            dispatch(logout())
        }catch(error){
            console.error("Error logging out:", error)
        }
    }
  
  return (
    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
        Dashboard Logout
    </button>
  )
}

export default LogoutButton