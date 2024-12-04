import { useState } from 'react';
import { X } from 'lucide-react';

interface EditClassModalProps {
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function EditClassModal({ initialName, onClose, onSave }: EditClassModalProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Sınıf Adını Düzenle
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sınıf adı"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}