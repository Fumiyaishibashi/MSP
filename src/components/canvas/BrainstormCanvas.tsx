import React, { useContext, useState, useMemo } from 'react';
import type { Wish } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Trash2 } from 'lucide-react';
import { Rnd } from 'react-rnd';
import WishDetailPanel from '../modals/WishDetailPanel';
import MatchConfirmationModal from '../modals/MatchConfirmationModal';
import { calculateDistance, calculateDistanceToBounds, PROXIMITY_MATCH_DISTANCE } from '../../utils/distance';

// companyIdから会社ロゴ画像パスへのマッピング
const getCompanyLogoPath = (companyId: string): string => {
  const logoMap: { [key: string]: string } = {
    mbs_tv: '/assets/company_logos/毎日放送.jpg',
    mbs_radio: '/assets/company_logos/MBSラジオ.jpg',
    mbs_planning: '/assets/company_logos/MBS企画.jpg',
    broadcast_film: '/assets/company_logos/放送映画.jpg',
    mirika_music: '/assets/company_logos/ミリカ・ミュージック.jpg',
    yami: '/assets/company_logos/闇.jpg',
    innovation: '/assets/company_logos/MBSイノベーションドライブ.jpg',
    toromi: '/assets/company_logos/TOROMI PRODUCE.jpg',
    hinata_life: '/assets/company_logos/ひなたライフ.jpg',
    appland: '/assets/company_logos/アップランド.jpg',
    mbs_anime: '/assets/company_logos/毎日放送.jpg',
    mbs_goods: '/assets/company_logos/MBSラジオ.jpg', // MBSラジオ/グッズ班
    gaora: '/assets/company_logos/GAORA.jpg',
    facilities: '/assets/company_logos/MBSファシリティーズ.jpg',
    picori: '/assets/company_logos/ピコリ.jpg',
    mbs_live: '/assets/company_logos/MBSライブエンターテイメント.jpg',
    upland: '/assets/company_logos/アップランド.jpg',
    mg_sports: '/assets/company_logos/毎日放送.jpg',
    zipang: '/assets/company_logos/毎日放送.jpg',
    vogaro: '/assets/company_logos/Vogaro.jpg',
  };
  return logoMap[companyId] || '/assets/company_logos/毎日放送.jpg'; // デフォルトはMBS
};

interface BrainstormCanvasProps {
  wishs: Wish[];
  zoom?: number;
  // matchGroups?: MatchGroup[]; // コメントアウト中
}

const BrainstormCanvas: React.FC<BrainstormCanvasProps> = ({ wishs, zoom = 1 }) => {
  const context = useContext(AppContext);
  const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
  const [showWishDetail, setShowWishDetail] = useState(false);
  const [matchConfirmationState, setMatchConfirmationState] = useState<{
    wish1: Wish;
    wish2?: Wish;
    distance: number;
    mode: 'new-match' | 'add-to-group';
    groupId?: string;
    groupWishCount?: number;
  } | null>(null);

  if (!context) return null;

  const { updateWish, deleteWish, currentUser, matchGroups, addWishToMatchGroup } = context;

  const handleDragStop = (id: string, x: number, y: number) => {
    const draggedWish = wishs.find((w) => w.id === id);
    if (!draggedWish) return;

    // ドラッグ後の新しい位置を反映したメモオブジェクトを作成
    const updatedDraggedWish = {
      ...draggedWish,
      position: { x, y },
    };

    // 位置を更新（state に反映される）
    updateWish(id, updatedDraggedWish);

    console.log('[handleDragStop] ドラッグ終了:', updatedDraggedWish.title);

    // このメモが既にどこかのグループに属しているかチェック
    const currentGroup = matchGroups.find(g => g.wishs.includes(id));

    if (currentGroup) {
      console.log('[handleDragStop] 既にグループに属しているメモの移動:', currentGroup.id);
      // マッチング済みのメモを動かしている場合は確認モーダルを表示しない
      return;
    }

    // STEP 1: 既存のマッチグループの境界ボックスと接触しているか確認
    const matchingGroups = matchGroupBounds
      .map(bounds => ({
        bounds,
        distance: calculateDistanceToBounds(updatedDraggedWish, bounds)
      }))
      .filter(g => g.distance < PROXIMITY_MATCH_DISTANCE)
      .sort((a, b) => a.distance - b.distance);

    console.log('[handleDragStop] マッチグループ境界チェック:', matchingGroups.length, '件');
    matchingGroups.forEach((g, i) => {
      console.log(`  グループ${i}: ID=${g.bounds.id} 距離=${g.distance.toFixed(2)}px`);
    });

    // 既存のグループと接触している場合、確認モーダルを表示
    if (matchingGroups.length > 0) {
      const closestGroup = matchingGroups[0];
      const group = matchGroups.find(g => g.id === closestGroup.bounds.id);
      console.log('[handleDragStop] 既存グループへの追加提案:', closestGroup.bounds.id);

      setMatchConfirmationState({
        wish1: updatedDraggedWish,
        distance: closestGroup.distance,
        mode: 'add-to-group',
        groupId: closestGroup.bounds.id,
        groupWishCount: group?.wishs.length || 0,
      });
      return;
    }

    // STEP 2: 既存グループと接触していない場合、個別のメモとの距離をチェック
    const candidates = wishs
      .filter(w => w.id !== id)
      .map(w => ({
        wish: w,
        distance: calculateDistance(updatedDraggedWish, w)
      }))
      .filter(c => c.distance < PROXIMITY_MATCH_DISTANCE)
      .sort((a, b) => a.distance - b.distance);

    console.log('[handleDragStop] 個別メモ候補:', candidates.length, '件');
    candidates.forEach((c, i) => {
      console.log(`  候補${i}: "${c.wish.title}" 距離=${c.distance.toFixed(2)}px`);
    });

    // 最も近いマッチ候補を提案（1対1マッチング）
    if (candidates.length > 0) {
      const closest = candidates[0];
      console.log('[handleDragStop] 1対1マッチング提案:', updatedDraggedWish.title, '←→', closest.wish.title, `(距離=${closest.distance.toFixed(2)}px)`);
      setMatchConfirmationState({
        wish1: updatedDraggedWish,
        wish2: closest.wish,
        distance: closest.distance,
        mode: 'new-match',
      });
    }
  };

  const handleResizeStop = (id: string, width: number, height: number) => {
    const wish = wishs.find((w) => w.id === id);
    if (wish) {
      updateWish(id, {
        ...wish,
        size: { width, height },
      });
    }
  };

  const handleConfirmMatch = () => {
    if (matchConfirmationState) {
      if (matchConfirmationState.mode === 'add-to-group' && matchConfirmationState.groupId) {
        // 既存グループに追加
        console.log('[handleConfirmMatch] グループに追加:', matchConfirmationState.wish1.id, '→', matchConfirmationState.groupId);
        addWishToMatchGroup(matchConfirmationState.wish1.id, matchConfirmationState.groupId);
      } else if (matchConfirmationState.mode === 'new-match' && matchConfirmationState.wish2) {
        // 新しい1対1マッチング
        console.log('[handleConfirmMatch] 新規マッチング:', matchConfirmationState.wish1.id, '←→', matchConfirmationState.wish2.id);
        context.createMatchGroupFromProximity(
          matchConfirmationState.wish1.id,
          matchConfirmationState.wish2.id
        );
      }
      setMatchConfirmationState(null);
    }
  };

  const handleCancelMatch = () => {
    setMatchConfirmationState(null);
  };

  const getCompanyColor = (companyId: string) => {
    const colorMap: { [key: string]: string } = {
      'mbs_tv': 'bg-red-200',          // 赤
      'mbs_radio': 'bg-cyan-200',      // シアン
      'mbs_planning': 'bg-pink-200',   // ピンク
      'broadcast_film': 'bg-purple-200', // 紫
      'mirika_music': 'bg-orange-200', // オレンジ（変更: bg-rose-200から変更）
      'yami': 'bg-slate-400',          // グレー
      'innovation': 'bg-green-200',    // 緑
      'toromi': 'bg-indigo-200',       // インディゴ
      'hinata_life': 'bg-yellow-200',  // 黄色
      'appland': 'bg-blue-200',        // 青
      'mbs_anime': 'bg-amber-200',     // アンバー
      'mbs_goods': 'bg-teal-200',      // ティール
      // 以下は念のため
      'gaora': 'bg-sky-200',
      'facilities': 'bg-rose-100',
      'picori': 'bg-fuchsia-200',
      'mbs_live': 'bg-lime-200',
      'upland': 'bg-red-300',
      'mg_sports': 'bg-emerald-200',
      'zipang': 'bg-violet-200',
      'vogaro': 'bg-rose-300',
    };
    return colorMap[companyId] || 'bg-gray-200';
  };

  const getCompanyName = (companyId: string): string => {
    const companyMap: { [key: string]: string } = {
      'mbs_tv': '株式会社毎日放送',
      'mbs_radio': '株式会社MBSラジオ',
      'mbs_goods': '株式会社MBSラジオ / グッズ班',
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

  const getAuthorDepartment = (authorName: string): string => {
    const { personMemos } = context;
    const person = personMemos.find((p) => p.name === authorName);
    return person ? person.department : '';
  };


  const handleWishClick = (wishId: string) => {
    setSelectedWishId(wishId);
    setShowWishDetail(true);
  };

  // マッチグループのボックス色を定義
  const groupColors = [
    'rgba(59, 130, 246, 0.2)', // blue
    'rgba(168, 85, 247, 0.2)', // purple
    'rgba(236, 72, 153, 0.2)', // pink
    'rgba(34, 197, 94, 0.2)',  // green
    'rgba(249, 115, 22, 0.2)', // orange
    'rgba(14, 165, 233, 0.2)', // sky
    'rgba(239, 68, 68, 0.2)',  // red
    'rgba(20, 184, 166, 0.2)', // teal
  ];

  const groupBorderColors = [
    '#3B82F6', // blue
    '#A855F7', // purple
    '#EC4899', // pink
    '#22C55E', // green
    '#F97316', // orange
    '#0EA5E9', // sky
    '#EF4444', // red
    '#14B8A6', // teal
  ];

  // マッチグループの境界ボックスを計算（凸包アルゴリズムを使用）
  const matchGroupBounds = useMemo(() => {
    console.log('[DEBUG] Recalculating matchGroupBounds', { groupCount: matchGroups.length, wishCount: wishs.length });

    // 凸包を計算する関数（Graham Scan アルゴリズム）
    const calculateConvexHull = (points: { x: number; y: number }[]) => {
      if (points.length < 3) return points;

      // 最も下（y最小）で左（x最小）の点を見つける
      let lowest = points[0];
      for (const p of points) {
        if (p.y < lowest.y || (p.y === lowest.y && p.x < lowest.x)) {
          lowest = p;
        }
      }

      // 極座標でソート
      const sortedPoints = points.slice().sort((a, b) => {
        if (a === lowest) return -1;
        if (b === lowest) return 1;

        const angleA = Math.atan2(a.y - lowest.y, a.x - lowest.x);
        const angleB = Math.atan2(b.y - lowest.y, b.x - lowest.x);

        if (angleA !== angleB) return angleA - angleB;

        // 同じ角度なら距離が近い方を優先
        const distA = Math.hypot(a.x - lowest.x, a.y - lowest.y);
        const distB = Math.hypot(b.x - lowest.x, b.y - lowest.y);
        return distA - distB;
      });

      // Graham Scan
      const hull: { x: number; y: number }[] = [sortedPoints[0], sortedPoints[1]];

      for (let i = 2; i < sortedPoints.length; i++) {
        let top = hull[hull.length - 1];
        let nextTop = hull[hull.length - 2];

        while (
          hull.length >= 2 &&
          crossProduct(nextTop, top, sortedPoints[i]) <= 0
        ) {
          hull.pop();
          top = hull[hull.length - 1];
          nextTop = hull[hull.length - 2];
        }

        hull.push(sortedPoints[i]);
      }

      return hull;
    };

    // 外積計算（反時計回りかチェック）
    const crossProduct = (
      o: { x: number; y: number },
      a: { x: number; y: number },
      b: { x: number; y: number }
    ) => {
      return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    };

    return matchGroups
      .map((group, groupIndex) => {
        // 各グループのメモを現在の位置情報で取得
        const groupWishes: Wish[] = [];
        for (const wishId of group.wishs) {
          const wish = wishs.find((w) => w.id === wishId);
          if (wish) {
            groupWishes.push(wish);
          }
        }

        if (groupWishes.length === 0) return null;

        // 各メモの4隅の座標を収集
        const padding = 10;
        const allCorners: { x: number; y: number }[] = [];

        for (const wish of groupWishes) {
          const x = wish.position.x;
          const y = wish.position.y;
          const w = (wish.size.width as number) || 200;
          const h = (wish.size.height as number) || 150;

          // 4隅 + パディング
          allCorners.push(
            { x: x - padding, y: y - padding },           // 左上
            { x: x + w + padding, y: y - padding },       // 右上
            { x: x + w + padding, y: y + h + padding },   // 右下
            { x: x - padding, y: y + h + padding }        // 左下
          );
        }

        // 凸包を計算
        const hull = calculateConvexHull(allCorners);

        // 境界ボックスも計算（距離判定用）
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const point of hull) {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        }

        return {
          id: group.id,
          hull,  // 凸包の点列
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          color: groupColors[groupIndex % groupColors.length],
          borderColor: groupBorderColors[groupIndex % groupBorderColors.length],
        };
      })
      .filter((b): b is NonNullable<typeof b> => b !== null);
  }, [matchGroups, wishs]);

  return (
    <div className="relative w-full h-full bg-white overflow-auto">
      {/* Canvas Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Wishes Container */}
      <div
        className="relative w-full h-full min-h-screen"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Match Group Bounding Boxes - 凸包に沿った点線 */}
        {matchGroupBounds.map((bounds) => {
          // SVG パスを生成（凸包の点を結ぶ）
          const pathData = bounds.hull.length > 0
            ? `M ${bounds.hull.map(p => `${p.x},${p.y}`).join(' L ')} Z`
            : '';

          return (
            <svg
              key={bounds.id}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {/* 塗りつぶし */}
              <path
                d={pathData}
                fill={bounds.color}
                stroke="none"
              />
              {/* 点線の枠 */}
              <path
                d={pathData}
                fill="none"
                stroke={bounds.borderColor}
                strokeWidth="2"
                strokeDasharray="8,4"
              />
            </svg>
          );
        })}
        {wishs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-2xl font-bold mb-2">願いがまだありません</p>
              <p className="text-base">願いを追加してキャンバスに配置しましょう</p>
            </div>
          </div>
        ) : (
          wishs.map((wish) => (
            <Rnd
              key={wish.id}
              default={{
                x: wish.position.x,
                y: wish.position.y,
                width: wish.size.width,
                height: wish.size.height,
              }}
              onDragStop={(_e, d) => handleDragStop(wish.id, d.x, d.y)}
              onResizeStop={(_e, _direction, ref) => {
                handleResizeStop(
                  wish.id,
                  parseInt(ref.style.width),
                  parseInt(ref.style.height)
                );
              }}
              dragHandleClassName="wish-drag-handle"
              style={{ zIndex: wish.zIndex }}
            >
              <div
                onDoubleClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  handleWishClick(wish.id);
                }}
                className={`w-full h-full cursor-pointer select-none rounded-lg shadow-md hover:shadow-lg transition-shadow p-3 ${
                  wish.stickyColor || getCompanyColor(wish.companyId)
                } border-2 border-gray-300 flex flex-col overflow-hidden`}
                style={{
                  minWidth: '200px',
                  minHeight: '150px',
                }}
              >
                {/* Drag Handle */}
                <div className="wish-drag-handle cursor-move mb-1 pb-1 border-b-2 border-gray-400 flex-shrink-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {/* 人材メモの場合はアバター写真を表示 */}
                      {wish.isPersonalOffer && wish.avatarImage && (
                        <img
                          src={wish.avatarImage}
                          alt={wish.author}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-800 line-clamp-2">
                          {wish.title}
                        </h3>
                        {wish.isPersonalOffer && (
                          <span className="inline-block text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-semibold mt-0.5">
                            👤 人材メモ
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1">
                      {wish.comments && wish.comments.length > 0 && (
                        <span className="text-xs bg-blue-400 text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                          💬 {wish.comments.length}
                        </span>
                      )}
                      <button
                        onClick={() => deleteWish(wish.id)}
                        className="p-1 hover:bg-red-300 rounded transition-colors flex-shrink-0"
                        title="削除"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {getCompanyName(wish.companyId)} {getAuthorDepartment(wish.author) && `/ ${getAuthorDepartment(wish.author)}`}
                  </p>
                </div>

                {/* Content */}
                <p className="text-xs text-gray-700 line-clamp-2 mb-2 flex-shrink-0">
                  {wish.description}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1 mb-2 flex-shrink-0 overflow-hidden">
                  {wish.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white bg-opacity-70 text-gray-700 px-1.5 py-0.5 rounded whitespace-nowrap"
                    >
                      #{keyword}
                    </span>
                  ))}
                  {wish.keywords.length > 3 && (
                    <span className="text-xs text-gray-600">+{wish.keywords.length - 3}</span>
                  )}
                </div>

                {/* Footer */}
                <div className="relative flex justify-between items-end text-xs text-gray-600 border-t border-gray-300 pt-1 mt-auto flex-shrink-0">
                  <span className="truncate">👤 {wish.author}</span>
                  {/* 会社メモの場合は会社ロゴを右下に表示 */}
                  {wish.isCompanyWish && (
                    <img
                      src={getCompanyLogoPath(wish.companyId)}
                      alt="Company Logo"
                      className="absolute bottom-0 right-0 w-20 h-16 object-cover"
                    />
                  )}
                  {/* 人メモの場合も会社ロゴを右下に表示（wishのcompanyIdを直接使用） */}
                  {wish.isPersonalOffer && (
                    <img
                      src={getCompanyLogoPath(wish.companyId)}
                      alt="Company Logo"
                      className="absolute bottom-0 right-0 w-20 h-16 object-cover"
                    />
                  )}
                </div>
              </div>
            </Rnd>
          ))
        )}
      </div>

      {/* Wish Detail Panel */}
      {showWishDetail && selectedWishId && (
        <WishDetailPanel
          wish={wishs.find((w) => w.id === selectedWishId)!}
          currentUser={currentUser}
          onClose={() => {
            setShowWishDetail(false);
            setSelectedWishId(null);
          }}
          onDeleteWish={(wishId) => {
            deleteWish(wishId);
            setShowWishDetail(false);
            setSelectedWishId(null);
          }}
        />
      )}

      {/* Match Confirmation Modal */}
      {matchConfirmationState && (
        <MatchConfirmationModal
          wish1={matchConfirmationState.wish1}
          wish2={matchConfirmationState.wish2}
          distance={matchConfirmationState.distance}
          onConfirm={handleConfirmMatch}
          onCancel={handleCancelMatch}
          mode={matchConfirmationState.mode}
          groupWishCount={matchConfirmationState.groupWishCount}
        />
      )}
    </div>
  );
};

export default BrainstormCanvas;
