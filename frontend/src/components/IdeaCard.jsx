import React from 'react';
import { Link } from 'react-router-dom';
import UserTag from './UserTag';

function IdeaCard({ ideaData }) {
  const { idea, upvotes, downvotes, comments } = ideaData;
  const { title, description,username } = idea;
  const truncatedDescription = description.length > 100 ? description.slice(0, 100) + "..." : description;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col border border-gray-200 hover:shadow-xl transition duration-300">
      <Link to={`/ideas/${ideaData.idea.id}`}>
      <UserTag username={username} />


        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{truncatedDescription}</p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="font-semibold text-green-500">Upvotes:</span>
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="font-semibold text-red-500">Downvotes:</span>
              <span>{downvotes}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="font-semibold text-blue-500">Comments:</span>
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default IdeaCard;
