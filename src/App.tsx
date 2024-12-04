import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClassDetail from './components/ClassDetail';
import AllStudents from './components/AllStudents';
import Classes from './components/Classes';
import Reports from './components/Reports';
import Notes from './components/Todo';
import Settings from './components/Settings';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/class/:id" element={<ClassDetail />} />
          <Route path="/all-students" element={<AllStudents />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;