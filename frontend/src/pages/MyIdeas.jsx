import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import { getUserIdeas, deleteIdea } from '../services/ideasAPI.js';

function MyIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        const data = await getUserIdeas();
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchUserIdeas();
  }, []);

  const handleDelete = (ideaId) => {
    setIdeaToDelete(ideaId); 
    setIsModalOpen(true); 
  };

  const confirmDelete = async () => {
    if (ideaToDelete) {
      try {
        await deleteIdea(ideaToDelete); 
        setIdeas(ideas.filter(idea => idea.idea.id !== ideaToDelete)); 
      } catch (error) {
        console.error('Error deleting idea:', error);
      } finally {
        setIsModalOpen(false); 
        setIdeaToDelete(null); 
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); 
    setIdeaToDelete(null); 
  };

  const handleEdit = (ideaId) => {
    navigate(`/ideas/edit/${ideaId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">My Ideas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas?.length > 0 ? (
          ideas.map((idea) => (
            <div key={idea.idea.id} className="relative">
              <IdeaCard ideaData={idea} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(idea.idea.id)}
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition cursor-pointer"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(idea.idea.id)}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition cursor-pointer"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            <p>No ideas available at the moment.</p>
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default MyIdeas;
