import axios from "axios";
import store from "../store/store";
import { logout } from "../store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
const PUBLIC_ROUTES = ["/user/login", "/user/register"];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (PUBLIC_ROUTES.some((route) => originalRequest.url.includes(route))) {
        return Promise.reject(error);
      }
    if (originalRequest._retry) {
        store.dispatch(logout());
        return Promise.reject(error);
    }
    if (error.response && error.response.status === 401) {
        originalRequest._retry = true;
      try {
        await axios.post(import.meta.env.VITE_BACKEND_URL + "/user/refresh-token", {}, { withCredentials: true });
        console.log("Token Refreshed");
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
