import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, RotateCcw } from 'lucide-react';
import EventStickyCard from '../components/canvas/EventStickyCard';

const Dashboard = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { projects, setProjects } = context;

  const handleAddNewProject = () => {
    const newProject = {
      id: uuidv4(),
      title: `新規イベント ${projects.length + 1}`,
      location: '未定',
      date: new Date().toLocaleDateString('ja-JP'),
      placedItems: [],
      status: '企画中' as const,
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleResetDemo = () => {
    if (window.confirm('現在の配置情報はすべてリセットされます。よろしいですか？')) {
      localStorage.removeItem('mbs_app_data');
      window.location.reload();
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">MBS Synergy Platform</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            <RotateCcw size={20} />
            デモをリセット
          </button>
          <button
            onClick={handleAddNewProject}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            <Plus size={20} />
            新規イベント作成
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <EventStickyCard key={project.id} project={project} />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
