import axios from "../utils/axiosInstance";

const basePath = "/user"

async function registerUser({ username, email, password }) {
    try {
      const response = await axios.post(basePath + "/register", {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the user." : "Network error. Please try again.";
      throw new Error(errorMessage);
    }
  }

async function loginUser({email,password}){
    try{
        const response = await axios.post(basePath + "/login",{email,password});
        
        return response.data;
    }catch(error){      
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while logging the user." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

async function logoutUser(){
    try{
        const response = await axios.post(basePath + "/logout")
        return response.data
    }catch(error){
      const errorMessage = error.response ? error.response.data.error || "Something went wrong while logging out the user." : "Network error. Please try again.";
      throw new Error(errorMessage);
    }
}

export {registerUser,loginUser,logoutUser}