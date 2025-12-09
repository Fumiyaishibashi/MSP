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
      // すべてのMBSアプリデータをクリア
      localStorage.removeItem('mbs_app_data');
      localStorage.removeItem('mbs_app_data_projects');
      localStorage.removeItem('mbs_app_assets');
      localStorage.removeItem('mbs_app_person_memos');
      localStorage.removeItem('mbs_app_company_memos');
      localStorage.removeItem('mbs_app_messages');
      localStorage.removeItem('mbs_app_project_chats');
      localStorage.removeItem('mbs_app_memo_chats');
      localStorage.removeItem('mbs_app_wishs');
      localStorage.removeItem('mbs_app_match_groups');
      localStorage.removeItem('mbs_app_brainstorm_teams');
      localStorage.removeItem('mbs_app_team_messages');
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
        {/* Brainstorm Boards Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">ブレストテーマ一覧</h2>
              <p className="text-gray-600">
                テーマごとに願いを投稿し、マッチング・チーム形成を行いましょう
              </p>
            </div>
            <button
              onClick={() => alert('新規テーマ作成機能は開発中です')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus size={18} />
              新規テーマ作成
            </button>
          </div>

          {/* Brainstorm Boards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* 2026年 ブレストボード */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">2026年 ブレストボード</h3>
                    <p className="text-gray-700 text-sm">
                      MBSグループが実現したい企画を願いとして提出
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-amber-300/50">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>願い: 30件</span>
                    <span>マッチング: 1組</span>
                    <span>チーム: 1</span>
                  </div>
                  <Link
                    to="/brainstorm"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full"
                  >
                    <Lightbulb size={18} />
                    ブレストを開く
                  </Link>
                </div>
              </div>
            </div>

            {/* 2030年までに実現したいもの ブレストボード */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">2030年までに実現したいもの</h3>
                    <p className="text-gray-700 text-sm">
                      中長期的なビジョンとアイデアを共有しましょう
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-purple-300/50">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>願い: 0件</span>
                    <span>マッチング: 0組</span>
                    <span>チーム: 0</span>
                  </div>
                  <button
                    onClick={() => alert('このテーマはデモ用です。ブレストボードには遷移しません')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full"
                  >
                    <Lightbulb size={18} />
                    ブレストを開く
                  </button>
                </div>
              </div>
            </div>
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
