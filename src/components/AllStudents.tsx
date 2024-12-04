import { useState, useEffect } from 'react';
import { loadState } from '../utils/storage';
import { Student, ClassRoom } from '../types';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';

interface StudentWithClass extends Student {
  className: string;
}

type SortField = 'name' | 'className' | 'points';
type SortDirection = 'asc' | 'desc';

export default function AllStudents() {
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const state = loadState();
    if (!state.currentTeacher) return;

    // Get all classes for the current teacher
    const teacherClasses = state.classes.filter(
      c => c.teacherId === state.currentTeacher?.id
    );

    // Collect all students from all classes and add class name
    const allStudents = teacherClasses.flatMap(classroom =>
      classroom.students.map(student => ({
        ...student,
        className: classroom.name
      }))
    );

    // Initial sort by points in descending order
    const sortedStudents = sortStudents(allStudents, 'points', 'desc');
    setStudents(sortedStudents);
  }, []);

  const sortStudents = (
    studentsToSort: StudentWithClass[],
    field: SortField,
    direction: SortDirection
  ) => {
    return [...studentsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'className':
          comparison = a.className.localeCompare(b.className);
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (field: SortField) => {
    const newDirection = 
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(newDirection);
    setStudents(sortStudents(students, field, newDirection));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpNarrowWide className="w-4 h-4" />
      : <ArrowDownNarrowWide className="w-4 h-4" />;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All My Students</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Student
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('className')}
                >
                  <div className="flex items-center gap-2">
                    Class
                    <SortIcon field="className" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('points')}
                >
                  <div className="flex items-center gap-2">
                    Points
                    <SortIcon field="points" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.avatarUrl}
                          alt={student.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.className}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{student.points}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}