import axiosInstance from "../utils/axiosInstance";

const basePath = "/comments"

const createComment = async(idea_id,text) => {
    try{
        let response = await axiosInstance.post(basePath,{idea_id,text})
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the comment." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const deleteComment = async(commentId) => {
    try{
        await axiosInstance.delete(basePath + `/${commentId}`)
        return
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the reply." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

export {createComment,deleteComment}