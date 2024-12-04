import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, Trash2, Shuffle, Users, MessageCircle } from 'lucide-react';
import { loadState, saveState } from '../utils/storage';
import { ClassRoom, Student } from '../types';
import AddStudentModal from './AddStudentModal';
import PointsModal from './PointsModal';
import RandomStudentModal from './RandomStudentModal';
import BulkPointsModal from './BulkPointsModal';
import ClassChat from './ClassChat';

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

function ConfirmDeleteModal({ onClose, onConfirm, message }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-4">{message}</p>
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

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<ClassRoom | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [randomStudent, setRandomStudent] = useState<Student | null>(null);
  const [showBulkPoints, setShowBulkPoints] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{show: boolean, studentId?: string, message: string}>({
    show: false,
    message: ''
  });

  useEffect(() => {
    const state = loadState();
    if (!state.currentTeacher) {
      navigate('/login');
      return;
    }
    const found = state.classes.find(c => c.id === id);
    if (!found) {
      navigate('/');
      return;
    }
    // Sort students by points in descending order
    const sortedStudents = [...found.students].sort((a, b) => b.points - a.points);
    setClassroom({
      ...found,
      students: sortedStudents,
      messages: found.messages || [] // Ensure messages array exists
    });
  }, [id, navigate]);

  const handlePoints = (studentId: string, amount: number) => {
    if (!classroom) return;

    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === classroom.id);
    const studentIndex = state.classes[classIndex].students.findIndex(s => s.id === studentId);
    state.classes[classIndex].students[studentIndex].points += amount;
    saveState(state);

    // Update the classroom state with sorted students
    const updatedStudents = classroom.students.map(s =>
      s.id === studentId ? { ...s, points: s.points + amount } : s
    );
    const sortedStudents = [...updatedStudents].sort((a, b) => b.points - a.points);

    setClassroom({
      ...classroom,
      students: sortedStudents,
    });
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    if (!classroom) return;

    const updatedStudents = classroom.students.map(s =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    const sortedStudents = [...updatedStudents].sort((a, b) => b.points - a.points);

    setClassroom({
      ...classroom,
      students: sortedStudents,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setShowDeleteModal({
      show: true,
      studentId,
      message: 'Are you sure you want to delete this student? This action cannot be undone.'
    });
  };

  const confirmDeleteStudent = () => {
    if (!classroom || !showDeleteModal.studentId) return;

    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === classroom.id);
    state.classes[classIndex].students = state.classes[classIndex].students.filter(
      s => s.id !== showDeleteModal.studentId
    );
    saveState(state);

    setClassroom({
      ...classroom,
      students: classroom.students.filter(s => s.id !== showDeleteModal.studentId),
    });
    setShowDeleteModal({ show: false, message: '' });
  };

  const handleAddStudent = (newStudent: Student) => {
    if (!classroom || !id) return;

    const state = loadState();
    const classIndex = state.classes.findIndex(c => c.id === id);
    state.classes[classIndex].students.push(newStudent);
    saveState(state);

    // Add new student and sort the list
    const updatedStudents = [...classroom.students, newStudent];
    const sortedStudents = updatedStudents.sort((a, b) => b.points - a.points);

    setClassroom({
      ...classroom,
      students: sortedStudents,
    });
    setShowAddStudent(false);
  };

  const handleRandomStudent = () => {
    if (!classroom || classroom.students.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * classroom.students.length);
    setRandomStudent(classroom.students[randomIndex]);
  };

  if (!classroom) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{classroom.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChat(true)}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            title="Sınıf Haberleri"
          >
            <MessageCircle className="w-5 h-5" />
            Sınıf Haberleri
          </button>
          <button
            onClick={() => setShowBulkPoints(true)}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
            title="Award Bulk Points"
          >
            <Users className="w-5 h-5" />
            Bulk Points
          </button>
          <button
            onClick={handleRandomStudent}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            title="Pick Random Student"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddStudent(true)}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            title="Add Student"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classroom.students.map((student) => (
          <div
            key={student.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {student.name}
                </h2>
                <p className="text-gray-500">Points: {student.points}</p>
                {student.notes && (
                  <p className="text-gray-400 text-sm mt-1 truncate">
                    {student.notes}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStudent(student.id);
                }}
                className="text-gray-400 hover:text-red-600"
                title="Delete Student"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}

      {showDeleteModal.show && (
        <ConfirmDeleteModal
          onClose={() => setShowDeleteModal({ show: false, message: '' })}
          onConfirm={confirmDeleteStudent}
          message={showDeleteModal.message}
        />
      )}

      {selectedStudent && (
        <PointsModal
          student={selectedStudent}
          classId={classroom.id}
          onClose={() => setSelectedStudent(null)}
          onAwardPoints={(points) => handlePoints(selectedStudent.id, points)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {randomStudent && (
        <RandomStudentModal
          student={randomStudent}
          onClose={() => setRandomStudent(null)}
        />
      )}

      {showBulkPoints && classroom && (
        <BulkPointsModal
          classroom={classroom}
          onClose={() => setShowBulkPoints(false)}
          onUpdate={(updatedClass) => {
            setClassroom(updatedClass);
            setShowBulkPoints(false);
          }}
        />
      )}

      {showChat && classroom && (
        <ClassChat
          classroom={classroom}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}