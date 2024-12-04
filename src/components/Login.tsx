import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadState, saveState, isStorageWorking } from '../utils/storage';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isStorageWorking()) {
      setError('Local storage is disabled in your browser. Please enable it.');
      return;
    }

    const state = loadState();
    const teacher = state.teachers.find(
      (t) => t.email === email && t.password === password
    );

    if (teacher) {
      state.currentTeacher = teacher;
      saveState(state);
      navigate('/');
    } else {
      setError('Invalid email or password!');
      
      if (state.teachers.length === 0) {
        setError('No registered teachers found. Please register first.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-blue-900">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Welcome Text Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to
          </h1>
          <h2 className="text-4xl font-bold text-blue-200 tracking-wider drop-shadow-lg">
            Virtual Classroom
          </h2>
        </div>

        {/* Login Box */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-8">
          <div>
            <h3 className="text-center text-2xl font-bold text-gray-900">
              EduMonster
            </h3>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register for free
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}