import axios from 'axios'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true
})

axiosInstance.interceptors.response.use((response) => response,async (error) => {
    const originalRequest = error.config;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    if(error.response && error.response.status == 401 /*&& !originalRequest._retry*/){
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/refresh-token",{},{withCredentials:true})
            
            return axiosInstance(originalRequest)
            
        } catch (refreshError) {
            dispatch(logout())
            navigate("/login")
        }
    }
    return Promise.reject(error);
})

export default axiosInstance;