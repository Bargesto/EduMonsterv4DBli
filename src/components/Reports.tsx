import { useState, useEffect } from 'react';
import { loadState } from '../utils/storage';
import { ClassRoom, Student } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const colors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#36A2EB',
];

type ViewMode = 'class' | 'student';

export default function Reports() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('class');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const state = loadState();
    if (state.currentTeacher) {
      const teacherClasses = state.classes.filter(
        c => c.teacherId === state.currentTeacher?.id
      );
      setClasses(teacherClasses);
      if (teacherClasses.length > 0) {
        setSelectedClass(teacherClasses[0].id);
        setStudents(teacherClasses[0].students);
        if (teacherClasses[0].students.length > 0) {
          setSelectedStudent(teacherClasses[0].students[0].id);
        }
      }
    }
  }, []);

  useEffect(() => {
    const selectedClassroom = classes.find(c => c.id === selectedClass);
    if (selectedClassroom) {
      setStudents(selectedClassroom.students);
      if (selectedClassroom.students.length > 0) {
        setSelectedStudent(selectedClassroom.students[0].id);
      }
    }
  }, [selectedClass]);

  const getChartData = () => {
    const selectedClassroom = classes.find(c => c.id === selectedClass);
    if (!selectedClassroom) return null;

    // Generate last 7 days
    const labels = Array.from({ length: 7 }, (_, i) => {
      return format(subDays(new Date(), i), 'MMM d', { locale: enUS });
    }).reverse();

    if (viewMode === 'student') {
      const student = selectedClassroom.students.find(s => s.id === selectedStudent);
      if (!student) return null;

      const data = labels.map(label => {
        const dayPoints = student.pointHistory?.filter(history =>
          format(new Date(history.date), 'MMM d', { locale: enUS }) === label
        ).reduce((sum, history) => sum + history.points, 0) || 0;
        return dayPoints;
      });

      return {
        labels,
        datasets: [{
          label: student.name,
          data,
          borderColor: colors[0],
          backgroundColor: colors[0],
          tension: 0.4,
        }],
      };
    } else {
      // Class view (all students)
      const datasets = selectedClassroom.students.map((student, index) => {
        const data = labels.map(label => {
          const dayPoints = student.pointHistory?.filter(history =>
            format(new Date(history.date), 'MMM d', { locale: enUS }) === label
          ).reduce((sum, history) => sum + history.points, 0) || 0;
          return dayPoints;
        });

        return {
          label: student.name,
          data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          tension: 0.4,
        };
      });

      return {
        labels,
        datasets,
      };
    }
  };

  const chartData = getChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: viewMode === 'student' ? 'Student Point Progress' : 'Class Point Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Points'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Point Reports</h1>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            View Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'class'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Class View
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Student View
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {classes.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>

        {viewMode === 'student' && (
          <div>
            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {chartData ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <Line options={options} data={chartData} />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No data found for the selected {viewMode === 'student' ? 'student' : 'class'}.
        </div>
      )}
    </div>
  );
}