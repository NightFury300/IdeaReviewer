import React from 'react';
import { deleteReply } from '../services/replyAPI.js';
import { useSelector } from 'react-redux';
import UserTag from './UserTag.jsx';
import { Trash } from 'lucide-react';

function ReplyCard({ reply, onDelete }) {
  const currentUserId = useSelector(state => state.auth.userData?.userId) || "";
    
  const handleDelete = async () => {
    try {
      await deleteReply(reply.id);
      onDelete(reply.id);
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  return (
    <div className="relative bg-white p-2 rounded-md shadow-sm mb-2 flex justify-between items-center">
        <div className="relative bg-white p-2 rounded-md shadow-sm mb-2">
  <UserTag username={reply?.username} />
  <p className="text-gray-700 mt-1">- {reply.text}</p>
</div>

      
      {reply.user_id === currentUserId && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }} 
          className="text-red-500 text-sm bg-gray-200 px-2 py-1 rounded-md ml-2 cursor-pointer transition-all duration-200 hover:bg-gray-300"
        >
          <Trash size={18} />
        </button>
      )}
    </div>
  );
}

export default ReplyCard;
