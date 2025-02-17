import axiosInstance from "../utils/axiosInstance"

const basePath = "/ideas"

const getTopIdeas = async () => {
    try{
        let response = axiosInstance.get(basePath + "/top")
        return (await response).data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while fetching the top ideas." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

export {getTopIdeas}