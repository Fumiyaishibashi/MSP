import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventCanvas from './pages/EventCanvas';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/event/:id" element={<EventCanvas />} />
      </Routes>
    </div>
  );
}

export default App;
