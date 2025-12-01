import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventCanvas from './pages/EventCanvas';
import ProjectChatPage from './pages/ProjectChatPage';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/event/:id" element={<EventCanvas />} />
        <Route path="/projects/:id" element={<EventCanvas />} />
        <Route path="/projects/:id/chat" element={<ProjectChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
