import axiosInstance from "../utils/axiosInstance"

const basePath = "/reply"

const getReplies = async(commentId)=>{
    try{
        let response = await axiosInstance.get(basePath + `/${commentId}`)
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while fetching the replies." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const createReply = async(comment_id,text) => {
    try{
        let response = await axiosInstance.post(basePath,{comment_id,text})
        return response.data
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while creating the reply." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

const deleteReply = async(replyId) => {
    try{
        await axiosInstance.delete(basePath + `/${replyId}`)
        return
    }catch(error){
        const errorMessage = error.response ? error.response.data.error || "Something went wrong while deleting the reply." : "Network error. Please try again.";
        throw new Error(errorMessage);
    }
}

export {getReplies,createReply,deleteReply}