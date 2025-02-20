import React, { useState } from "react";
import { getReplies, createReply } from "../services/replyAPI.js";
import { deleteComment } from "../services/commentAPI.js";
import ReplyCard from "./ReplyCard.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserTag from "./UserTag.jsx";
import { LogIn, MessageSquareReply, Trash } from "lucide-react";

function CommentCard({ comment, onDelete }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.userData?.userId) || "";
  const isLoggedIn = useSelector((state) => state.auth.loginStatus);

  const fetchReplies = async () => {
    if (!showReplies) {
      setLoadingReplies(true);
      try {
        const response = await getReplies(comment.id);
        setReplies(response || []);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleAddReply = async () => {
    if (!newReply.trim()) return;
    try {
      const newReplyObj = await createReply(comment.id, newReply);
      setReplies((prev) => [...prev, newReplyObj]); // Update state instead of refreshing
      setNewReply("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReply = (replyId) => {
    setReplies((prev) => prev.filter((reply) => reply.id !== replyId)); // Remove the reply from state
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg">
      <UserTag username={comment?.username} />
      <div
        className="flex justify-between items-center cursor-pointer transition-all duration-200 hover:text-gray-700"
        onClick={fetchReplies}
      >
        <p className="text-gray-800 transition-all duration-200">- {comment.text}</p>

        {comment.user_id === currentUserId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteComment();
            }}
            className="text-red-500 text-sm bg-gray-200 px-2 py-1 rounded-md ml-2 cursor-pointer transition-all duration-200 hover:bg-gray-300"
          >
            <Trash size={18} />
          </button>
        )}
      </div>

      {showReplies && (
        <div className="ml-6 mt-2 border-l pl-4" onClick={(e) => e.stopPropagation()}>
          {loadingReplies ? (
            <p>Loading replies...</p>
          ) : replies.length > 0 ? (
            replies.map((reply) => <ReplyCard key={reply.id} reply={reply} onDelete={() => handleDeleteReply(reply.id)} />)
          ) : (
            <p className="text-gray-500">No replies yet.</p>
          )}
          {isLoggedIn ? (
            <div className="mt-4">
              <textarea
                value={newReply}
                onChange={handleReplyChange}
                className="w-full p-2 border border-gray-300 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                placeholder="Write a reply..."
              />
              <button
                onClick={handleAddReply}
                className="flex justify-center items-center mt-2 text-white bg-blue-500 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-600"
              >
                <MessageSquareReply size={24} />
                Add Reply
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex justify-center items-center mt-2 text-white bg-blue-500 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-600"
            >
              <LogIn size={24} />
              Login to Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentCard;
