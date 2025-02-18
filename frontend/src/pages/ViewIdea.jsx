import React, { useEffect, useState } from 'react';
import { getIdea } from '../services/ideasAPI.js';
import { useParams, useNavigate } from 'react-router-dom';
import CommentCard from '../components/CommentCard.jsx';
import { useSelector } from 'react-redux';
import { createComment } from '../services/commentAPI.js';

function ViewIdea() {
  const [idea, setIdea] = useState({comments:[]});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { id: ideaId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.loginStatus);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdea(ideaId);
        setIdea(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching idea:', error);
        setLoading(false);
      }
    };
    fetchIdea();
  }, [ideaId]);

  const handleDeleteComment = (commentId) => {
    navigate(0)
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(ideaId, newComment);
      navigate(0)
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">{idea.idea.title}</h2>
        <p className="text-gray-600 mt-4">{idea.idea.description}</p>
        <div className="flex justify-between mt-4 text-gray-500">
          <span>Upvotes: {idea.upvotes}</span>
          <span>Downvotes: {idea.downvotes}</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
        {idea.comments?.length > 0 ? (
          idea.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} onDelete={handleDeleteComment} />
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        <div className="mt-4">
          {isLoggedIn ? (
            <>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleAddComment}
                className="mt-2 text-white bg-blue-500 px-4 py-2 rounded-md"
              >
                Add Comment
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-white bg-blue-500 px-4 py-2 rounded-md"
            >
              Login to add a comment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewIdea;
