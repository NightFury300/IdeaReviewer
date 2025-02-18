import axiosInstance from "../utils/axiosInstance"

const basePath = "/votes"

const createVote = async(idea_id,vote_type) => {
    try{
        let response = await axiosInstance.post(basePath,{idea_id,vote_type})
        return response.data
    }catch (error) {
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the vote." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const deleteVote = async(idea_id) => {
    try{        
        await axiosInstance.delete(basePath + `/${idea_id}`)
        return
    }catch (error) {
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while deleting the vote." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const hasVoted = async(idea_id) => {
    try{
        let response = await axiosInstance.get(basePath + `/${idea_id}`)
        return response.data;
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while fetching the vote status." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

export {createVote,deleteVote,hasVoted}