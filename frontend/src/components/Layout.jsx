import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { login, logout } from '../store/authSlice'

function Layout() {
    const dispatch = useDispatch()
    
    useEffect(() => {
        const initRedux = async () => {
            try{
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/ideas",{withCredentials:true})
                
                if(response.status < 400)
                    dispatch(login({}))
                else
                    dispatch(logout())
            }catch(error){
                dispatch(logout())
            }
        }
        initRedux()
    },[])
    return (
    <Outlet/>
  )
}

export default Layout