import { GraduationCap, LayoutGrid, BarChart, StickyNote, Settings, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-16 bg-indigo-600 flex flex-col items-center py-4 fixed h-full">
      <div className="space-y-4">
        <button
          onClick={() => navigate('/classes')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="Classes"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('/all-students')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="All Students"
        >
          <GraduationCap className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('/reports')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="Reports"
        >
          <BarChart className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('/notes')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="My Notes"
        >
          <StickyNote className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigate('/about')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-500 text-white/80 hover:text-white transition-colors"
          title="Hakkında"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}