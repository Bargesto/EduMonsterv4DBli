import { useState } from 'react';
import { X } from 'lucide-react';

interface AddClassModalProps {
  onClose: () => void;
  onAdd: (name: string, shortId: string) => void;
}

// Function to generate a more complex 12-character ID with hyphens
const generateShortId = () => {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const allChars = upperChars + numbers;
  
  // Generate 12 characters
  let result = '';
  for (let i = 0; i < 12; i++) {
    // Ensure at least one number in each 4-character segment
    if (i % 4 === 3) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    } else {
      result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Add hyphen after every 4 characters (except at the end)
    if (i % 4 === 3 && i < 11) {
      result += '-';
    }
  }
  return result;
};

export default function AddClassModal({ onClose, onAdd }: AddClassModalProps) {
  const [name, setName] = useState('');
  const [shortId] = useState(generateShortId());

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name, shortId);
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Add New Class
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="shortId" className="block text-sm font-medium text-gray-700 mb-1">
              Class ID (Auto-generated)
            </label>
            <input
              type="text"
              id="shortId"
              value={shortId}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono tracking-wider"
            />
            <p className="mt-1 text-sm text-gray-500">
              This unique code identifies your class. It's generated in a 12-character format for security.
            </p>
          </div>

          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter class name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}