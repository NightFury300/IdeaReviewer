import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/userAPI'
import { LogIn } from 'lucide-react'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      let data = await loginUser({ email, password })
      dispatch(login({ userId: data._id }))
      navigate("/")
    } catch (error) {
      setLoginError(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center p-8">
  <form
    className="flex flex-col gap-4 w-80 bg-white shadow-md rounded-lg p-6"
    onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}
  >
    <input
      type="email"
      placeholder="Email"
      className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="submit"
      className="flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
    >
      <LogIn size={24}/>Login
    </button>
  </form>
  {loginError && <div className="text-red-500 font-medium">{loginError}</div>}
</div>

  )
}

export default Login
