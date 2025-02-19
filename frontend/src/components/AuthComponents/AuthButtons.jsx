import { LogIn, PenSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AuthButtons = () => {
  const location = useLocation();
  return (
    <div className="flex gap-4 mb-6">
  <Link
    to="/login"
    className={`flex px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer ${
      location.pathname === "/login"
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    <LogIn size={24}/><h1>Login</h1>
  </Link>
  <Link
    to="/signup"
    className={`flex px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer ${
      location.pathname === "/signup"
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    <PenSquare size={24}/><h1>Sign Up</h1>
  </Link>
</div>

  );
};

export default AuthButtons;
