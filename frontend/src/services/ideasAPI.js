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

const createIdea = async ({title,description}) => {
    try{
        let response = await axiosInstance.post(basePath,{title,description})
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the idea." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const getUserIdeas = async() => {
    try{
        let response = await axiosInstance.get(basePath)
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while fetching the ideas." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const deleteIdea = async(ideaId) => {
    try{
        await axiosInstance.delete(basePath + `/${ideaId}`)
        return
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while deleting the idea." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const getIdea = async(ideaId) => {
    try{        
        let response = await axiosInstance.get(basePath + `/${ideaId}`)
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while fetching the idea." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const updateIdea = async(ideaId,{title,description}) => {
    try{
        let response = await axiosInstance.put(basePath + `/${ideaId}`,{title,description})
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while updating the idea." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

export {getTopIdeas,createIdea,getUserIdeas,deleteIdea,getIdea,updateIdea}