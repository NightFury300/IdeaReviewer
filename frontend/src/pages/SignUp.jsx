import React from 'react'
import { registerUser } from '../services/userAPI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthButtons from '../components/AuthButtons';

function SignUp() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [signupError,setSignupError] = React.useState('');
  const [signupSuccess, setSignupSuccess] = React.useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;

    if (!usernameRegex.test(username)) {
      setSignupError("Username can only contain letters, numbers, underscores (_), and dots (.)");
      setSignupSuccess("");
      return;
    }

    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters long.");
      setSignupSuccess("");
      return;
    }
    try{
      await registerUser({ email, password, username });
      setSignupSuccess("Registration successful! Redirecting to login...");
      setSignupError("");

      setTimeout(() => {
        navigate("/login");
      }, 750);
    }catch(error){
      setSignupError(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center p-8">
    <AuthButtons />
    <form
      className="flex flex-col gap-4 w-80 bg-white shadow-md rounded-lg p-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
    >
      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
        onChange={(e) => setUsername(e.target.value)}
      />
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
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Register
      </button>
    </form>
    {signupSuccess && (
      <div className="text-green-500 mt-2 font-medium">{signupSuccess}</div>
    )}
    {signupError && (
      <div className="text-red-500 mt-2 font-medium">{signupError}</div>
    )}
  </div>
  
  )
}

export default SignUp