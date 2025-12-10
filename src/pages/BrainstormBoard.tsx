import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Plus, ArrowLeft, Grid3x3, List, ZoomIn, ZoomOut, Maximize, X, RotateCcw } from 'lucide-react';
import WishModal from '../components/modals/WishModal';
import TeamCreationModal from '../components/modals/TeamCreationModal';
import TeamChatModal from '../components/modals/TeamChatModal';
import BrainstormCanvas from '../components/canvas/BrainstormCanvas';
import type { MatchGroup, TeamMemberRecommendation, BrainstormTeam } from '../types';

type TabType = 'wishes' | 'matches' | 'teams';
type ViewMode = 'canvas' | 'list';

const BrainstormBoard = () => {
  const context = useContext(AppContext);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('wishes');
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [showWishModal, setShowWishModal] = useState(false);
  const [selectedMatchGroup, setSelectedMatchGroup] = useState<MatchGroup | null>(null);
  const [showTeamCreationModal, setShowTeamCreationModal] = useState(false);
  const [selectedMatchGroupForTeam, setSelectedMatchGroupForTeam] = useState<MatchGroup | null>(null);
  const [recommendedMembersForTeam, setRecommendedMembersForTeam] = useState<TeamMemberRecommendation[]>([]);
  const [showTeamChatModal, setShowTeamChatModal] = useState(false);
  const [selectedTeamForChat, setSelectedTeamForChat] = useState<BrainstormTeam | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeamForMemberAdd, setSelectedTeamForMemberAdd] = useState<BrainstormTeam | null>(null);

  // ズーム機能用state
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);

  if (!context) {
    return <div className="flex items-center justify-center h-screen">Context is not available.</div>;
  }

  // スムーズズームアニメーション
  useEffect(() => {
    if (zoom === targetZoom) return;

    const animationFrame = requestAnimationFrame(() => {
      setZoom((prev) => {
        const diff = targetZoom - prev;
        const nextZoom = prev + diff * 0.1; // スムーズな補間
        return Math.abs(diff) < 0.001 ? targetZoom : nextZoom;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [zoom, targetZoom]);

  // ズーム操作
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, targetZoom + delta));
    setTargetZoom(newZoom);
  };

  // ズームリセット
  const handleZoomReset = () => {
    setTargetZoom(1);
  };

  // マウスホイール処理（Shift + ホイール = ズーム）
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      // パッシブイベントの警告を避けるため、イベント処理のチェック後にpreventDefaultを呼ぶ
      try {
        e.preventDefault();
      } catch (err) {
        // パッシブイベントリスナーでのpreventDefault失敗を無視
      }
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      handleZoom(delta);
    }
  };

  // タッチパッド処理（2本指）
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (lastTouchDistance > 0) {
        const delta = (distance - lastTouchDistance) * 0.01;
        handleZoom(delta);
      }
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(0);
  };

  // Utility function to get company name from company ID
  const getCompanyName = (companyId: string): string => {
    const companyMap: { [key: string]: string } = {
      'mbs_tv': '株式会社毎日放送',
      'mbs_radio': '株式会社MBSラジオ',
      'mbs_goods': 'MBSラジオ/グッズ班',
      'gaora': 'GAORA',
      'mbs_planning': '株式会社MBS企画',
      'broadcast_film': '株式会社放送映画製作所',
      'mirika_music': 'ミリカ・ミュージック',
      'facilities': 'MBSファシリティーズ',
      'picori': 'ピコリ',
      'mbs_live': 'MBSライブエンターテインメント',
      'yami': '株式会社闇',
      'innovation': 'MBSイノベーション',
      'upland': 'アップランド',
      'toromi': 'TOROMI PRODUCE',
      'mg_sports': 'MG SPORTS',
      'zipang': 'ZIPANG',
      'vogaro': 'Vogaro',
      'hinata_life': 'ひなたライフ',
    };
    return companyMap[companyId] || companyId;
  };

  // Handler for opening team creation modal
  const handleOpenTeamCreationModal = (matchGroup: MatchGroup) => {
    setSelectedMatchGroupForTeam(matchGroup);
    const recommendedMembers = context.getRecommendedTeamMembers(matchGroup.id);
    setRecommendedMembersForTeam(recommendedMembers);
    setShowTeamCreationModal(true);
  };

  const { wishs = [], matchGroups = [], teams = [] } = context;

  const tabConfig = [
    { id: 'wishes', label: '願い（Wish）', icon: '🌟' },
    { id: 'matches', label: 'マッチング', icon: '🔗' },
    { id: 'teams', label: 'チーム', icon: '👥' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header
        className="sticky top-0 z-40 shadow-lg p-4 flex justify-between items-center text-gray-800"
        style={{ backgroundColor: '#ffff95ff' }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo_mbs_synergy.png"
            alt="MBS Synergy Logo"
            className="h-10 w-auto"
          />
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">2026年ブレストボード</h1>
            <p className="text-sm font-semibold mt-0.5">実現したいことを願いとして提出</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-purple-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex gap-2">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* View Mode Toggle & Action Buttons */}
        <div className="bg-white border-b border-purple-200 p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700">表示モード：</p>
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'canvas'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid3x3 size={16} />
              キャンバス
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={16} />
              リスト
            </button>

            {/* ズームボタン（キャンバス表示時のみ） */}
            {viewMode === 'canvas' && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-4">
                <button
                  onClick={() => handleZoom(-0.2)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="ズームアウト"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="px-2 text-sm font-semibold text-gray-700 min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => handleZoom(0.2)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="ズームイン"
                >
                  <ZoomIn size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                  onClick={handleZoomReset}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="ズームをリセット"
                >
                  <Maximize size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('デモデータをリロードします。現在の変更は失われます。よろしいですか？')) {
                  localStorage.removeItem('mbs_app_wishs');
                  localStorage.removeItem('mbs_app_match_groups');
                  localStorage.removeItem('mbs_app_brainstorm_teams');
                  localStorage.removeItem('mbs_app_team_messages');
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-1.5 rounded-lg text-sm border border-gray-300 transition-all"
            >
              <RotateCcw size={16} />
              デモリセット
            </button>
            <button
              onClick={() => setShowWishModal(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm shadow-md transition-all hover:scale-105"
            >
              <Plus size={16} />
              願いを追加
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeTab === 'wishes' && viewMode === 'canvas' && (
            <BrainstormCanvas wishs={wishs} zoom={zoom} />
          )}
          {activeTab === 'wishes' && viewMode === 'list' && (
            <div className="overflow-y-auto p-4">
              {wishs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-4xl mb-4">📝</p>
                  <p className="text-2xl font-bold mb-2">願いがまだありません</p>
                  <p className="text-base">上のボタンで願いを追加してね</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishs.map((wish) => (
                    <div
                      key={wish.id}
                      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-800">{wish.title}</h3>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">
                          {wish.companyId}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{wish.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {wish.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>👤 {wish.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'matches' && (
            <div className="overflow-y-auto p-4">
              {matchGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-4xl mb-4">🔗</p>
                  <p className="text-2xl font-bold mb-2">マッチングがまだありません</p>
                  <p className="text-base">願い同士を近づけてマッチングを作成してください</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">現在のマッチング</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchGroups.map((group) => {
                    // Get wish details for this group
                    const groupWishes = group.wishs.map((wishId) => wishs.find((w) => w.id === wishId)).filter(Boolean);

                    return (
                      <div
                        key={group.id}
                        onClick={() => setSelectedMatchGroup(group)}
                        className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-800">
                            {groupWishes.length}個の願いがマッチ
                          </h3>
                        </div>

                        {/* Related Wishes */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2">関連する願い</p>
                          <div className="space-y-1">
                            {groupWishes.slice(0, 3).map((wish) => (
                              <p key={wish!.id} className="text-xs text-gray-600 truncate">
                                ✓ {wish!.title}
                              </p>
                            ))}
                            {groupWishes.length > 3 && (
                              <p className="text-xs text-gray-400 italic">
                                +{groupWishes.length - 3}件
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTeamCreationModal(group);
                            }}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
                          >
                            👥 チーム作成
                          </button>
                          <button
                            onClick={() => setSelectedMatchGroup(group)}
                            className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-sm transition-colors"
                          >
                            詳細
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'teams' && (
            <div className="overflow-y-auto p-4">
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                  <p className="text-4xl mb-4">👥</p>
                  <p className="text-2xl font-bold mb-2">チームがまだありません</p>
                  <p className="text-base">マッチングタブからチームを作成してください</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-3">
                        <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(team.createdAt).toLocaleDateString('ja-JP')}作成
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          {team.members.length}名のメンバー
                        </p>
                        <div className="space-y-1">
                          {team.members.map((member) => {
                            const personMemo = context.personMemos.find(p => p.id === member.personId);
                            const isEmailInvited = member.reason === 'メールアドレスで招待';

                            // デモアプリ用：ダミーデータ
                            const dummyDepartment: { [key: string]: string } = {
                              'person_test': 'デジタル戦略部',
                              'person_kawamoto': '音楽事業部',
                              'person_matsuda': 'ライツ事業部',
                            };

                            const department = personMemo?.department || dummyDepartment[member.personId] || 'N/A';

                            return (
                              <div key={member.personId} className="text-xs text-gray-600 flex items-center gap-1 flex-wrap">
                                <span>✓</span>
                                <span>{member.name} ({department})</span>
                                {isEmailInvited && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                    📧
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          {team.wishs.length}個の願い
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedTeamForChat(team);
                              setShowTeamChatModal(true);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                          >
                            💬 チャット
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeamForMemberAdd(team);
                              setShowAddMemberModal(true);
                            }}
                            className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                          >
                            👤+ メンバー追加
                          </button>
                        </div>
                        <button
                          onClick={() => context.deleteTeam(team.id)}
                          className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold text-sm transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Match Group Detail Modal */}
      {selectedMatchGroup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={() => setSelectedMatchGroup(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-bold">マッチグループ詳細</h2>
              <button
                onClick={() => setSelectedMatchGroup(null)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Score Section */}
              <section className="space-y-2">
                <h3 className="font-bold text-gray-800 text-sm">📊 マッチスコア</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all"
                        style={{ width: `${Math.min(selectedMatchGroup.matchScore, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600 min-w-[60px] text-right">
                    {Math.round(selectedMatchGroup.matchScore)}%
                  </span>
                </div>
              </section>

              {/* Common Keywords */}
              <section className="space-y-2">
                <h3 className="font-bold text-gray-800 text-sm">🏷️ 共通キーワード</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatchGroup.commonKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </section>

              {/* Related Wishes */}
              <section className="space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">📋 マッチした願い</h3>
                <div className="space-y-3">
                  {selectedMatchGroup.wishs
                    .map((wishId) => wishs.find((w) => w.id === wishId))
                    .filter(Boolean)
                    .map((wish) => (
                      <div
                        key={wish!.id}
                        className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-gray-800 text-sm flex-1">
                            {wish!.title}
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">
                            {getCompanyName(wish!.companyId)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{wish!.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {wish!.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">👤 {wish!.author}</p>
                      </div>
                    ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setSelectedMatchGroup(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold text-sm transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wish Modal */}
      {showWishModal && (
        <WishModal
          onClose={() => setShowWishModal(false)}
          onSubmit={(wishData) => {
            context.addWish(wishData);
            setShowWishModal(false);
          }}
        />
      )}

      {/* Team Creation Modal */}
      {showTeamCreationModal && selectedMatchGroupForTeam && (
        <TeamCreationModal
          matchGroup={selectedMatchGroupForTeam}
          wishs={wishs}
          recommendedMembers={recommendedMembersForTeam}
          onClose={() => {
            setShowTeamCreationModal(false);
            setSelectedMatchGroupForTeam(null);
            setRecommendedMembersForTeam([]);
          }}
          onCreate={(request) => {
            const newTeam = context.createTeamFromMatchGroup(request);
            setShowTeamCreationModal(false);
            setSelectedMatchGroupForTeam(null);
            setRecommendedMembersForTeam([]);
            // チーム作成後、自動的にチームタブに切り替えてチャットを開く
            setActiveTab('teams');
            setSelectedTeamForChat(newTeam);
            setShowTeamChatModal(true);
          }}
        />
      )}

      {/* Team Chat Modal */}
      {showTeamChatModal && selectedTeamForChat && (
        <TeamChatModal
          team={selectedTeamForChat}
          isOpen={showTeamChatModal}
          onClose={() => {
            setShowTeamChatModal(false);
            setSelectedTeamForChat(null);
          }}
        />
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedTeamForMemberAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-lg font-bold">メンバー追加</h2>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedTeamForMemberAdd(null);
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                メールアドレスでメンバーを追加できます
              </p>
              <input
                type="text"
                placeholder="例: test@mbs.co.jp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget;
                    if (!input.value.trim()) return;

                    // デモアプリ: 簡単にメンバー追加
                    const demoIds = ['person_test', 'person_kawamoto', 'person_matsuda'];
                    const existingMemberIds = selectedTeamForMemberAdd.members.map(m => m.personId);
                    const availableId = demoIds.find(id => !existingMemberIds.includes(id));

                    if (!availableId) {
                      alert('追加可能なメンバーがいません');
                      return;
                    }

                    const dummyData: { [key: string]: { name: string, yearsOfService: number } } = {
                      'person_test': { name: '中村太一', yearsOfService: 5 },
                      'person_kawamoto': { name: '川本由美', yearsOfService: 7 },
                      'person_matsuda': { name: '松田誠', yearsOfService: 10 },
                    };

                    const newMember = {
                      personId: availableId,
                      name: dummyData[availableId].name,
                      reason: 'メールアドレスで招待',
                      yearsOfService: dummyData[availableId].yearsOfService,
                    };

                    context.updateTeam(selectedTeamForMemberAdd.id, {
                      members: [...selectedTeamForMemberAdd.members, newMember],
                    });

                    input.value = '';
                    alert(`${newMember.name}さんをチームに追加しました`);
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                Enterキーで追加
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainstormBoard;
