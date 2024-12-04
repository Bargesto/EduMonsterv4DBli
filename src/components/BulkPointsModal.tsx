import { useState } from 'react';
import { X } from 'lucide-react';
import { ClassRoom } from '../types';
import { loadState, saveState } from '../utils/storage';

interface BulkPointsModalProps {
  classroom: ClassRoom;
  onClose: () => void;
  onUpdate: (updatedClass: ClassRoom) => void;
}

export default function BulkPointsModal({ classroom, onClose, onUpdate }: BulkPointsModalProps) {
  const [points, setPoints] = useState<number>(0);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === classroom.students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(classroom.students.map(s => s.id));
    }
  };

  const handleSubmit = () => {
    if (points === 0 || selectedStudents.length === 0) return;

    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === classroom.id);
    
    const updatedStudents = classroom.students.map(student => ({
      ...student,
      points: student.points + (selectedStudents.includes(student.id) ? points : 0)
    }));

    const updatedClass = {
      ...classroom,
      students: updatedStudents
    };

    state.classes[classIndex] = updatedClass;
    saveState(state);
    onUpdate(updatedClass);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {classroom.name} - Toplu Puan Ver
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verilecek Puan
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Öğrenciler</h4>
            <button
              onClick={toggleAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {selectedStudents.length === classroom.students.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {classroom.students.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="flex-1">{student.name}</span>
                <span className="text-sm text-gray-500">
                  Mevcut: {student.points} puan
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={points === 0 || selectedStudents.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Puanları Ver
          </button>
        </div>
      </div>
    </div>
  );
}