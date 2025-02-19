import { Trash2, X } from 'lucide-react';
import React from 'react';

function ConfirmationModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        <p className="mt-4 text-gray-700">Are you sure you want to delete this idea?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer"
          >
            <X size={24}/>
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            <Trash2 size={24}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
