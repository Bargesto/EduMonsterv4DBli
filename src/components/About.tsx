import { Book, Users, Star, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Application</h1>

      <div className="space-y-8">
        {/* Main Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            EduMonster - Education Management System
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EduMonster is a modern educational platform designed to simplify classroom management
            and enhance student motivation through an engaging point-based system.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Classroom Management</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Easy class creation and organization</li>
              <li>• Student roster management</li>
              <li>• Point-based motivation system</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Student Tracking</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Detailed student profiles</li>
              <li>• Behavior and performance notes</li>
              <li>• Individual progress monitoring</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reward System</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Customizable point system</li>
              <li>• Automated achievement tracking</li>
              <li>• Motivational rewards</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Detailed performance graphs</li>
              <li>• Class and student-based reports</li>
              <li>• Progress analysis</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <p className="text-gray-600">
            Get in touch with us for any questions or suggestions.
          </p>
          <p className="text-gray-600 mt-2">
            Email: info@edumonster.com
          </p>
        </div>
      </div>
    </div>
  );
}