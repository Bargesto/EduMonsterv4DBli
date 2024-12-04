import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Copy, Check } from 'lucide-react';
import { loadState, saveState } from '../utils/storage';
import { ClassRoom } from '../types';
import AddClassModal from './AddClassModal';
import EditClassModal from './EditClassModal';

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

interface CopyFeedback {
  id: string;
  visible: boolean;
}

function ConfirmDeleteModal({ onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Class</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this class? This action cannot be undone and all student data will be lost.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassRoom | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>({ id: '', visible: false });
  const navigate = useNavigate();

  useEffect(() => {
    const state = loadState();
    if (state.currentTeacher) {
      setClasses(state.classes.filter(c => c.teacherId === state.currentTeacher?.id));
    }
  }, []);

  const handleAddClass = (name: string, shortId: string) => {
    const state = loadState();
    if (!state.currentTeacher) return;

    const newClass: ClassRoom = {
      id: crypto.randomUUID(),
      shortId,
      name,
      teacherId: state.currentTeacher.id,
      students: []
    };

    state.classes.push(newClass);
    saveState(state);
    setClasses(prev => [...prev, newClass]);
    setShowAddModal(false);
  };

  const handleEditClass = (name: string) => {
    if (!editingClass) return;

    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === editingClass.id);
    if (classIndex === -1) return;

    state.classes[classIndex].name = name;
    saveState(state);
    setClasses(prev => prev.map(c => 
      c.id === editingClass.id ? { ...c, name } : c
    ));
    setEditingClass(null);
  };

  const handleDeleteClass = () => {
    if (!deletingClass) return;

    const state = loadState();
    state.classes = state.classes.filter(c => c.id !== deletingClass.id);
    saveState(state);
    setClasses(prev => prev.filter(c => c.id !== deletingClass.id));
    setDeletingClass(null);
  };

  const copyToClipboard = async (shortId: string, classId: string) => {
    try {
      await navigator.clipboard.writeText(shortId);
      setCopyFeedback({ id: classId, visible: true });
      setTimeout(() => {
        setCopyFeedback({ id: '', visible: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shortId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyFeedback({ id: classId, visible: true });
        setTimeout(() => {
          setCopyFeedback({ id: '', visible: false });
        }, 2000);
      } catch (err) {
        console.error('Fallback: Failed to copy:', err);
        alert('Copy failed. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classroom) => (
          <div
            key={classroom.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{classroom.name}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClass(classroom);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Edit Class"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingClass(classroom);
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete Class"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-md">
              <span className="text-sm text-gray-600">Class ID:</span>
              <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {classroom.shortId}
              </code>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(classroom.shortId, classroom.id);
                }}
                className="ml-auto text-gray-500 hover:text-gray-700 relative group"
                title="Copy"
              >
                {copyFeedback.visible && copyFeedback.id === classroom.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copyFeedback.visible && copyFeedback.id === classroom.id && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">{classroom.students.length}</span> students
              </div>
              <div>
                Total Points:{' '}
                <span className="font-medium">
                  {classroom.students.reduce((sum, student) => sum + student.points, 0)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/class/${classroom.id}`)}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Class
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddClassModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddClass}
        />
      )}

      {editingClass && (
        <EditClassModal
          initialName={editingClass.name}
          onClose={() => setEditingClass(null)}
          onSave={handleEditClass}
        />
      )}

      {deletingClass && (
        <ConfirmDeleteModal
          onClose={() => setDeletingClass(null)}
          onConfirm={handleDeleteClass}
        />
      )}
    </div>
  );
}