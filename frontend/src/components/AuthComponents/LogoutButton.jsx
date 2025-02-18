import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutUser } from '../../services/userAPI';
import AuthButtons from './AuthButtons';
import { useSelector } from 'react-redux';

function LogoutButton() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.loginStatus);

    if(!isLoggedIn){
        return (<AuthButtons haveBgColors={true}/>)
    }

    const handleLogout = async () => {
        try {
            await logoutUser()
            dispatch(logout())
        }catch(error){
            console.error("Error logging out:", error)
        }
    }
  
  return (
    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
        Logout
    </button>
  )
}

export default LogoutButton