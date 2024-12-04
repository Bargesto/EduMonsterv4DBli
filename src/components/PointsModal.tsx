import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Student } from '../types';
import { loadState, saveState } from '../utils/storage';

interface Behavior {
  id: string;
  description: string;
  points: number;
  type: 'positive' | 'negative';
}

const behaviors: Behavior[] = [
  { id: '1', description: 'Active participation', points: 2, type: 'positive' },
  { id: '2', description: 'Completed homework', points: 1, type: 'positive' },
  { id: '3', description: 'Helping others', points: 2, type: 'positive' },
  { id: '4', description: 'Following rules', points: 1, type: 'positive' },
  { id: '5', description: 'Late to class', points: -1, type: 'negative' },
  { id: '6', description: 'Missing homework', points: -1, type: 'negative' },
  { id: '7', description: 'Disrupting class', points: -2, type: 'negative' },
  { id: '8', description: 'Disrespectful behavior', points: -2, type: 'negative' },
];

interface PointsModalProps {
  student: Student;
  classId: string;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export default function PointsModal({ student, classId, onClose, onAwardPoints, onUpdateStudent }: PointsModalProps) {
  const [notes, setNotes] = useState(student.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = () => {
    setIsSaving(true);
    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === classId);
    const studentIndex = state.classes[classIndex].students.findIndex(s => s.id === student.id);
    
    state.classes[classIndex].students[studentIndex].notes = notes;
    saveState(state);
    
    const updatedStudent = { ...student, notes };
    onUpdateStudent(updatedStudent);
    
    setIsSaving(false);
  };

  const handleAwardPoints = (behavior: Behavior) => {
    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === classId);
    const studentIndex = state.classes[classIndex].students.findIndex(s => s.id === student.id);
    
    // Add point history
    const pointHistory = state.classes[classIndex].students[studentIndex].pointHistory || [];
    pointHistory.push({
      date: new Date().toISOString(),
      points: behavior.points,
      reason: behavior.description
    });
    
    state.classes[classIndex].students[studentIndex].pointHistory = pointHistory;
    saveState(state);
    
    onAwardPoints(behavior.points);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500">Current Points: {student.points}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-green-600 mb-4">Positive Behaviors</h4>
            <div className="space-y-2">
              {behaviors.filter(b => b.type === 'positive').map((behavior) => (
                <button
                  key={behavior.id}
                  onClick={() => handleAwardPoints(behavior)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>{behavior.description}</span>
                    <span className="text-green-600 font-medium">+{behavior.points}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-red-600 mb-4">Negative Behaviors</h4>
            <div className="space-y-2">
              {behaviors.filter(b => b.type === 'negative').map((behavior) => (
                <button
                  key={behavior.id}
                  onClick={() => handleAwardPoints(behavior)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>{behavior.description}</span>
                    <span className="text-red-600 font-medium">{behavior.points}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium text-gray-900">Student Notes</h4>
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes about the student..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
}