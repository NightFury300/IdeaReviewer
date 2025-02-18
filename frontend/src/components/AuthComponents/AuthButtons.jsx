import { Link, useLocation } from "react-router-dom";

const AuthButtons = () => {
  const location = useLocation();

  const haveBgColors = !(location.pathname === "/login" || location.pathname === "/signup");
  return (
    <div className="flex gap-4 mb-6">
  <Link
    to="/login"
    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
      location.pathname === "/login" || haveBgColors
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    Login
  </Link>
  <Link
    to="/signup"
    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
      location.pathname === "/signup" || haveBgColors
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    Sign Up
  </Link>
</div>

  );
};

export default AuthButtons;
