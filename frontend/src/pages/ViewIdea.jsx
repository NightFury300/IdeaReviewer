import React, { useEffect, useState } from 'react';
import { getIdea } from '../services/ideasAPI.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createComment } from '../services/commentAPI.js';
import { createVote, deleteVote, hasVoted } from '../services/voteAPI.js';
import { LogIn, MessageSquareMore, SquareArrowDown,SquareArrowUp } from 'lucide-react';
import CommentCard from '../components/CommentCard.jsx';
import UserTag from '../components/UserTag.jsx';

function ViewIdea() {
  const [idea, setIdea] = useState({ comments: [] });
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [voteStatus, setVoteStatus] = useState(null);
  const { id: ideaId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.loginStatus);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdea(ideaId);
        setIdea(data);
        setVoteStatus(data.voteStatus);
        setLoading(false);

        if (isLoggedIn) {
          const vote = await hasVoted(ideaId);
          if (vote.has_voted) {
            setVoteStatus(vote.vote_type);
          }
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
        setLoading(false);
      }
    };
    fetchIdea();
  }, [ideaId]);
  const handleDeleteComment = (commentId) => {
    navigate(0);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(ideaId, newComment);
      navigate(0);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const handleVote = async (type) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (voteStatus === type) {
      await deleteVote(ideaId);
      setVoteStatus(null);
    } else {
      let typeId = type === 'upvote' ? '1' : '-1';
      await createVote(ideaId, typeId);
      setVoteStatus(type);
    }
    navigate(0)
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6">
        <UserTag username={idea.idea.username} />

        <h2 className="text-3xl font-bold text-gray-800">{idea.idea.title}</h2>
        <p className="text-gray-600 mt-3 leading-relaxed">{idea.idea.description}</p>

        <div className="flex items-center justify-between mt-6">

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('upvote')}
              className={`p-2 rounded-lg transition duration-200 ease-in-out cursor-pointer ${
                voteStatus === 'upvote' ? 'text-green-600 bg-gray-100 hover:bg-gray-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <SquareArrowUp size={24} />
            </button>
            <span className="text-lg font-semibold text-gray-700">{idea.upvotes}</span>

            <button
              onClick={() => handleVote('downvote')}
              className={`p-2 rounded-lg transition duration-200 ease-in-out cursor-pointer ${
                voteStatus === 'downvote' ? 'text-red-600 bg-gray-100 hover:bg-gray-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <SquareArrowDown size={24} />
            </button>
            <span className="text-lg font-semibold text-gray-700">{idea.downvotes}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
        {idea.comments?.length > 0 ? (
          idea.comments.map((comment) => <CommentCard key={comment.id} comment={comment} onDelete={handleDeleteComment}/>)
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {isLoggedIn ? (
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Write a comment..."
            />
            <button
              onClick={() => handleAddComment()}
              className="flex justify-center items-center mt-2 text-white bg-blue-500 px-4 py-2 transition duration-200 ease-in-out rounded-md cursor-pointer hover:bg-blue-700"
            >
              <MessageSquareMore size={24}/> Add Comment
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex justify-center items-center mt-2 text-white bg-blue-500 px-4 py-2 transition duration-200 ease-in-out rounded-md cursor-pointer hover:bg-blue-700"
          >
            <LogIn size={24}/> Login to add a comment
          </button>
        )}
      </div>
    </div>
  );
}

export default ViewIdea;
