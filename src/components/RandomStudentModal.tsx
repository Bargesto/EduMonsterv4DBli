import { X } from 'lucide-react';
import { Student } from '../types';

interface RandomStudentModalProps {
  student: Student;
  onClose: () => void;
}

export default function RandomStudentModal({ student, onClose }: RandomStudentModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Seçilen Öğrenci
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={student.avatarUrl}
            alt={student.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
          <p className="text-gray-500">Puan: {student.points}</p>
        </div>
      </div>
    </div>
  );
}