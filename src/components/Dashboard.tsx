import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadState } from '../utils/storage';
import { ClassRoom } from '../types';

export default function Dashboard() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [teacher, setTeacher] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const state = loadState();
    setClasses(state.classes.filter(c => c.teacherId === state.currentTeacher?.id));
    setTeacher(state.currentTeacher?.schoolName || '');
  }, []);

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] -mt-8 -mx-8 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jhqjwoNOA1gCQ4KORRDVW9V7lkyydtvUrA&usqp=CAU")',
      }}
    >
      {/* Welcome Text Section */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold text-indigo-900 mb-4 drop-shadow-lg">
          Welcome to
        </h1>
        <h2 className="text-4xl font-bold text-indigo-700 tracking-wider drop-shadow-lg">
          Virtual Classroom
        </h2>
        {teacher && (
          <p className="mt-4 text-xl text-indigo-800">
            {teacher}
          </p>
        )}
      </div>

      {/* Classes Grid */}
      {classes.length > 0 && (
        <div className="w-full max-w-5xl px-4 relative z-10">
          <h3 className="text-xl font-semibold text-indigo-900 mb-6 text-center">
            Your Classes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classroom) => (
              <div
                key={classroom.id}
                onClick={() => navigate(`/class/${classroom.id}`)}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:bg-white/90 transition-all cursor-pointer border border-indigo-100 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-indigo-900 mb-2">
                  {classroom.name}
                </h2>
                <p className="text-indigo-700">
                  {classroom.students.length} students
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}