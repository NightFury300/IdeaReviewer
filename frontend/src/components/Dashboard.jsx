import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

function Dashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      <button onClick={() => {handleLogout()}}>
        Dashboard Logout
      </button>
    </div>
  )
}

export default Dashboard