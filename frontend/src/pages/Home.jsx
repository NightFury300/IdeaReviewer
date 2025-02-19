import React, { useEffect, useState } from 'react';
import IdeaCard from '../components/IdeaCard.jsx';
import { getTopIdeas } from '../services/ideasAPI.js';
import { SquarePlus} from "lucide-react"
import { useNavigate } from 'react-router-dom';

function Home() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getTopIdeas();        
        setIdeas(data || []);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="flex justify-between mb-6">
      <h1 className="text-2xl font-bold mb-6">Home</h1>
        <button
          onClick={() => navigate("/ideas/new")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <SquarePlus size={24} /> Post Idea
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <IdeaCard key={idea.idea.id} ideaData={idea} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            <p>No ideas available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
