import axios from "../utils/axiosInstance";

async function registerUser({ username, email, password }) {
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while creating the user." : "Network error. Please try again.";
      throw new Error(errorMessage);
    }
  }

async function loginUser({email,password}){
    try{
        const response = await axios.post("/login",{email,password});
        return response.data;
    }catch(error){
        const errorMessage = error.response ? error.response.data.message || "Something went wrong while logging the user." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

async function logoutUser(){
    try{
        const response = await axios.post("/logout")
        return response.data
    }catch(error){
        throw new Error("Something went wrong while logging out.")
    }
}

async function createStatement({name,amount,type}){
  try{
    const response = await axios.post("/create-statement",
      {
        name,
        amount,
        type
      }
    )
    return response.data;
  }catch(error){
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while creating the statement." : "Network error. Please try again.";
      throw new Error(errorMessage);
  }
}

async function updateStatement({statementId,name,amount,type}){
  try{
    const response = await axios.patch("/update-statement",
      {
        statementId,
        name,
        amount,
        type
      }
    )
    return response.data;
  }catch(error){
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while updating the statement." : "Network error. Please try again.";
      throw new Error(errorMessage);
  }
}

async function deleteStatement({statementId}){
  try{
    const response = await axios.delete(`/delete-statement/${statementId}`
    )
    return response.data;
  }catch(error){
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while deleting the statement." : "Network error. Please try again.";
      throw new Error(errorMessage);
  }
}

async function getStatement({statementId}){
  try{
    const response = await axios.get(`/get-statement/${statementId}`
    )
    return response.data;
  }catch(error){
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while fetching the statement." : "Network error. Please try again.";
      throw new Error(errorMessage);
  }
}

async function getAllStatements(){
  try{
    const response = await axios.get(`/get-all-statements`
    )
    return response.data;
  }catch(error){
      const errorMessage = error.response ? error.response.data.message || "Something went wrong while fetching the statements." : "Network error. Please try again.";
      throw new Error(errorMessage);
  }
}
export {registerUser,loginUser,logoutUser,createStatement,deleteStatement,getAllStatements,
  getStatement,updateStatement
}