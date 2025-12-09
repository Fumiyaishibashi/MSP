import React, { useState, useCallback, useContext } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import type { MatchGroup, TeamMemberRecommendation, TeamCreationRequest, Wish } from '../../types';
import { AppContext } from '../../context/AppContext';

interface TeamCreationModalProps {
  matchGroup: MatchGroup;
  wishs: Wish[];
  recommendedMembers: TeamMemberRecommendation[];
  onClose: () => void;
  onCreate: (request: TeamCreationRequest) => void;
}

export const TeamCreationModal: React.FC<TeamCreationModalProps> = ({
  matchGroup,
  wishs,
  recommendedMembers,
  onClose,
  onCreate,
}) => {
  const context = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(recommendedMembers.filter((m) => m.isSelected).map((m) => m.personId))
  );
  const [emailInput, setEmailInput] = useState('');
  const [emailInvitedIds, setEmailInvitedIds] = useState<Set<string>>(new Set());

  // Get wish details for match group
  const matchedWishes = wishs.filter((w) => matchGroup.wishs.includes(w.id));

  // メール招待で追加されたメンバー（デモアプリ用：必ず表示）
  const emailInvitedMembers = Array.from(emailInvitedIds).map((id) => {
    // デモアプリ：ハードコードされたダミーデータ
    const dummyData: { [key: string]: { name: string, department: string, expertise: string[], email: string } } = {
      'person_test': {
        name: '中村太一',
        department: 'デジタル戦略部',
        expertise: ['Webマーケティング', 'SNS運用', 'デジタル広告'],
        email: 'nakamura.taichi@mbs.co.jp'
      },
      'person_kawamoto': {
        name: '川本由美',
        department: '音楽事業部',
        expertise: ['音楽イベント企画', 'アーティストブッキング', '音響制作'],
        email: 'kawamoto.yumi@mbs.co.jp'
      },
      'person_matsuda': {
        name: '松田誠',
        department: 'ライツ事業部',
        expertise: ['コンテンツライセンス', '著作権管理', 'IP展開'],
        email: 'matsuda.makoto@mbs.co.jp'
      },
    };

    const person = context.personMemos.find((p) => p.id === id);
    const dummy = dummyData[id];

    // context.personMemos にあればそれを使う、なければダミーデータを使う
    const data = person || (dummy ? {
      id,
      name: dummy.name,
      department: dummy.department,
      expertise: dummy.expertise,
      email: dummy.email,
      yearsOfService: 5,
    } : null);

    if (!data) return null;

    return {
      personId: id,
      name: data.name,
      department: data.department,
      expertise: data.expertise,
      yearsOfService: data.yearsOfService || 5,
      email: data.email,
      recommendationReasons: [{
        type: 'wish_author' as const,
        wishId: '',
        wishTitle: '',
        details: 'メールアドレスで招待',
      }],
      isSelected: true,
    };
  }).filter((m): m is TeamMemberRecommendation & { email: string } => m !== null);

  const handleMemberToggle = useCallback((personId: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(personId)) {
        next.delete(personId);
      } else {
        next.add(personId);
      }
      return next;
    });
  }, []);

  const handleRemoveEmailInvitedMember = (personId: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      next.delete(personId);
      return next;
    });
    setEmailInvitedIds((prev) => {
      const next = new Set(prev);
      next.delete(personId);
      return next;
    });
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) return;

    // デモアプリ: 何でもいいから名前を出す
    // メール招待用メンバーのID配列
    const demoEmailInviteIds = ['person_test', 'person_kawamoto', 'person_matsuda'];

    // まだ選択されていないメンバーを探す
    let selectedId = demoEmailInviteIds.find(id => !selectedMembers.has(id));

    // 全員選択済みなら最初のを使う
    if (!selectedId) {
      selectedId = demoEmailInviteIds[0];
    }

    // 既に選択されているかチェック
    if (selectedMembers.has(selectedId)) {
      alert('全員追加済みです');
      setEmailInput('');
      return;
    }

    // メンバーとして追加
    setSelectedMembers(new Set([...selectedMembers, selectedId]));
    setEmailInvitedIds(new Set([...emailInvitedIds, selectedId]));
    setEmailInput('');
  };


  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      alert('チーム名を入力してください');
      return;
    }

    const totalMembers = selectedMembers.size;
    if (totalMembers < 2) {
      alert('最少2名のメンバーが必要です');
      return;
    }

    // 推奨メンバーの理由を構築
    const recommendedReasons = recommendedMembers
      .filter((m) => selectedMembers.has(m.personId))
      .map((m) => ({
        personId: m.personId,
        reason: emailInvitedIds.has(m.personId)
          ? 'メールアドレスで招待'
          : m.recommendationReasons.map((r) => r.details).join(', '),
      }));

    // メール招待メンバーの理由を構築
    const emailInvitedReasons = emailInvitedMembers
      .filter((m) => selectedMembers.has(m.personId))
      .map((m) => ({
        personId: m.personId,
        reason: 'メールアドレスで招待',
      }));

    const recommendationReasons = [...recommendedReasons, ...emailInvitedReasons];

    const request: TeamCreationRequest = {
      matchGroupId: matchGroup.id,
      teamName,
      selectedMemberIds: Array.from(selectedMembers),
      recommendationReasons,
    };

    onCreate(request);
  };

  const totalMembers = selectedMembers.size;
  const canProceed = currentStep === 1 || (currentStep === 2 && totalMembers >= 2) || currentStep === 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">チーム作成</h2>
            <p className="text-sm opacity-90 mt-1">
              Step {currentStep} / 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step <= currentStep
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-1 transition-all ${
                    step < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Match Group Overview */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  ✨ マッチした願い ({matchedWishes.length}個)
                </h3>
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  {matchedWishes.map((wish) => (
                    <div key={wish.id} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <div>
                        <p className="font-semibold text-gray-800">{wish.title}</p>
                        <p className="text-sm text-gray-600">{wish.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  🔗 マッチスコア
                </h3>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                        style={{ width: `${Math.min(matchGroup.matchScore, 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-lg text-purple-700 w-16 text-right">
                      {Math.round(matchGroup.matchScore)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    願い同士の共通キーワード: {matchGroup.commonKeywords.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Member Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  👥 チームメンバーを選択 ({selectedMembers.size}名)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  推奨メンバーが自動選択されています。必要に応じて変更してください。
                </p>
              </div>

              <div className="space-y-3">
                {recommendedMembers.map((member) => (
                  <div
                    key={member.personId}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.personId)}
                        onChange={() => handleMemberToggle(member.personId)}
                        className="w-5 h-5 text-purple-600 rounded mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-gray-800">{member.name}</p>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {member.department}
                          </span>
                          {emailInvitedIds.has(member.personId) && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                              📧 メール招待
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {member.expertise.join(', ')}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p className="font-semibold">推奨理由:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {member.recommendationReasons.map((reason, idx) => (
                              <li key={idx}>{reason.details}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* メール招待で追加されたメンバー */}
              {emailInvitedMembers.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-blue-700 mb-3">
                      📧 メールアドレスで追加されたメンバー ({emailInvitedMembers.length}名)
                    </p>
                  </div>
                  {emailInvitedMembers.map((member) => (
                    <div
                      key={member.personId}
                      className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-bold text-gray-800">{member.name}</p>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {member.department}
                            </span>
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1">
                              📧 メール招待
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {member.expertise.join(', ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveEmailInvitedMember(member.personId)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Email Invite Input Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  📧 メールアドレスでメンバーを招待
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  まだプラットフォームに書き込みがないけどスキルがある人を、メールアドレスで招待してチームに加えられます
                </p>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                    placeholder="例: test@mbs.co.jp"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAddEmail}
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    追加
                  </button>
                </div>
              </div>

              {totalMembers < 2 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    ⚠️ 最少2名のメンバーを選択してください
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Team Name & Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block font-bold text-gray-800 mb-2">
                  チーム名を入力
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="例: 2026年VR対応音楽フェス"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3">
                  チーム概要
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">願い数</p>
                    <p className="font-bold text-lg text-gray-800">{matchedWishes.length}個</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">メンバー数</p>
                    <p className="font-bold text-lg text-gray-800">
                      {totalMembers}名
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">マッチスコア</p>
                    <p className="font-bold text-lg text-gray-800">
                      {Math.round(matchGroup.matchScore)}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3">
                  選択メンバー
                </h3>
                <div className="space-y-2">
                  {recommendedMembers
                    .filter((m) => selectedMembers.has(m.personId))
                    .map((member) => (
                      <div
                        key={member.personId}
                        className="flex items-center gap-3 bg-blue-50 rounded-lg p-3"
                      >
                        <span className="text-blue-600">✓</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            {emailInvitedIds.has(member.personId) && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                                📧 メール招待
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{member.department}</p>
                        </div>
                      </div>
                    ))}
                  {emailInvitedMembers
                    .filter((m) => selectedMembers.has(m.personId))
                    .map((member) => (
                      <div
                        key={member.personId}
                        className="flex items-center gap-3 bg-blue-50 rounded-lg p-3"
                      >
                        <span className="text-blue-600">✓</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                              📧 メール招待
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{member.department}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {!teamName.trim() && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    ⚠️ チーム名を入力してください
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            <ChevronLeft size={18} />
            戻る
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              キャンセル
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  canProceed
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                次へ
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim() || totalMembers < 2}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  teamName.trim() && totalMembers >= 2
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                チーム作成
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCreationModal;
