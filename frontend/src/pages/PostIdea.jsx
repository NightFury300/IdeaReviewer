import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIdea } from "../services/ideasAPI.js";
import { SquarePlus, X } from "lucide-react";

function PostIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePostIdea = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      await createIdea({ title, description });
      navigate("/");
    } catch (err) {
      setError("Failed to post idea. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Post a New Idea</h2>
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Idea Title"
          className="border p-3 w-full rounded-md mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe your idea in detail..."
          className="border p-3 w-full h-40 rounded-md resize-none mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            <X size={24}/>
          </button>
          <button
            onClick={handlePostIdea}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            <SquarePlus size={24}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostIdea;
