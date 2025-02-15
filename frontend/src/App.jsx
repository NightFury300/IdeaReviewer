import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "./utils/axiosInstance";
import { loginUser } from "./services/api";

function App() {
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch()
  
  /*useEffect(() => {
    handleStartup();
  })*/
  return (
    <>
      
    </>
  )
}

export default App
