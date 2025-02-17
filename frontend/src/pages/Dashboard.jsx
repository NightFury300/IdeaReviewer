import React, { useEffect, useState } from 'react';
import IdeaCard from '../components/IdeaCard.jsx';
import LogoutButton from '../components/AuthComponents/LogoutButton.jsx';
import { getTopIdeas } from '../services/ideasAPI.js';

function Dashboard() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getTopIdeas();        
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <LogoutButton />
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

export default Dashboard;
