import { AppState, Teacher, ClassRoom, Student } from '../types';

const STORAGE_KEY = 'classdojo_clone_state';

const defaultTeacher: Teacher = {
  id: 'default-teacher',
  email: 'teacher@school.com',
  password: 'password',
  schoolName: 'My School'
};

const defaultState: AppState = {
  teachers: [defaultTeacher],
  classes: [],
  currentTeacher: defaultTeacher,
  todos: [],
  settings: {
    language: 'en'
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      // Initialize with default state if not exists
      saveState(defaultState);
      return defaultState;
    }
    const state = JSON.parse(serializedState);
    // Ensure there's always a current teacher
    if (!state.currentTeacher) {
      state.currentTeacher = defaultTeacher;
      if (!state.teachers.length) {
        state.teachers = [defaultTeacher];
      }
      saveState(state);
    }
    // Ensure todos array exists
    if (!state.todos) {
      state.todos = [];
      saveState(state);
    }
    // Ensure settings exists
    if (!state.settings) {
      state.settings = { language: 'en' };
      saveState(state);
    }
    return state;
  } catch (err) {
    // Reset to default state if there's an error
    saveState(defaultState);
    return defaultState;
  }
};

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

// Helper function to check if storage is working
export const isStorageWorking = (): boolean => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};