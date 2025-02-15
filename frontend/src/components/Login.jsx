import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import { Navigate } from 'react-router-dom'

function Login() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => (state.auth.loginStatus))

  const handleLogin = () =>{
    dispatch(login())
  }

  return (
    isAuthenticated ? <Navigate to="/dashboard" replace/> :
    <div>
      <button onClick={() => {handleLogin}}>
        Login
      </button>
    </div>
  )
}

export default Login