import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import axios from "../utils/axiosInstance";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
          
        const response = await axios.get("/user/profile");
        dispatch(login({ userId: response.data._id }));
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
        } else {
          console.error("Error checking auth:", error);
        }
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  return isAuthChecked;
};

export default useAuthCheck;
