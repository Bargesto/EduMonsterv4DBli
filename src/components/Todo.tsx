import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { loadState, saveState } from '../utils/storage';
import { Todo } from '../types';

export default function NotesPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const state = loadState();
    if (state.currentTeacher) {
      const teacherTodos = (state.todos || []).filter(
        todo => todo.teacherId === state.currentTeacher?.id
      );
      setTodos(teacherTodos);
    }
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const state = loadState();
    if (!state.currentTeacher) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      teacherId: state.currentTeacher.id,
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    state.todos = [...(state.todos || []), newTodo];
    saveState(state);
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
  };

  const toggleTodo = (todoId: string) => {
    const state = loadState();
    const updatedTodos = (state.todos || []).map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    state.todos = updatedTodos;
    saveState(state);
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId: string) => {
    const state = loadState();
    state.todos = (state.todos || []).filter(todo => todo.id !== todoId);
    saveState(state);
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Notes</h1>

      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add new note..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-md ${
            filter === 'active' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md ${
            filter === 'completed' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              todo.completed 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-300'
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                todo.completed 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {todo.completed && <Check className="w-4 h-4 text-white" />}
            </button>
            <span
              className={`flex-1 ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No notes found
          </div>
        )}
      </div>
    </div>
  );
}