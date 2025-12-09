import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, RotateCcw, User, Lightbulb } from 'lucide-react';
import EventStickyCard from '../components/canvas/EventStickyCard';

const Dashboard = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { projects, setProjects, currentUser } = context;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="sticky top-0 z-40 border-b border-gray-200/50 shadow-sm" style={{ backgroundColor: '#ffff95ff' }}>
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo_mbs_synergy.png"
                alt="MBS Synergy Logo"
                className="h-12 w-auto"
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl border border-blue-100/50 hover:border-blue-200/80 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">ログイン中</p>
                  <p className="font-bold text-gray-800 text-sm">{currentUser.name}</p>
                </div>
                <div className="ml-3 pl-3 border-l border-gray-300/50 text-right text-xs">
                  <p className="text-gray-600">{currentUser.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Brainstorm Board CTA */}
        <div className="mb-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Lightbulb size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">2026年 ブレストボード</h3>
                <p className="text-gray-700">
                  MBSグループが実現したい企画を願いとして提出し、マッチング・チーム形成しましょう
                </p>
              </div>
            </div>
            <Link
              to="/brainstorm"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              <Lightbulb size={20} />
              ブレストを開く
            </Link>
          </div>
        </div>

        {/* Page Title & Actions */}
        <div className="mb-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                イベント企画一覧
              </h2>
              <p className="text-gray-600">
                IP資産とのシナジーを創出し、新しいビジネス機会を発見しましょう
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetDemo}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 border border-gray-300/50"
              >
                <RotateCcw size={18} />
                リセット
              </button>
              <button
                onClick={handleAddNewProject}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus size={18} />
                新規作成
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <EventStickyCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
