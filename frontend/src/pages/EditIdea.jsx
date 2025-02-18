import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdea, updateIdea } from '../services/ideasAPI.js';

function EditIdea() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdea(id);
        
        setIdea(data);
        setTitle(data.idea.title); 
        setDescription(data.idea.description);
      } catch (error) {
        console.error('Error fetching idea:', error);
      }
    };

    fetchIdea();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateIdea(id, { title, description });
      navigate('/ideas');
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  if (!idea) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Idea</h1>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            rows="6"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/ideas')} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditIdea;
