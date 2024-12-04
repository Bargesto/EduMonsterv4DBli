export interface Teacher {
  id: string;
  email: string;
  password: string;
  schoolName: string;
}

export interface PointHistory {
  date: string;
  points: number;
  reason: string;
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  notes: string;
  pointHistory: PointHistory[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'teacher' | 'parent';
  content: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface ClassRoom {
  id: string;
  shortId: string;
  name: string;
  teacherId: string;
  students: Student[];
  messages: Message[];
}

export interface Todo {
  id: string;
  teacherId: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface AppState {
  teachers: Teacher[];
  classes: ClassRoom[];
  currentTeacher: Teacher | null;
  todos: Todo[];
  settings: {
    language: 'en' | 'tr';
  };
}