import type { Wish } from '../types';

/**
 * マッチング判定の距離閾値（px）
 * メモの端と端がこの距離以下に接近したらマッチ候補として提案
 * 20px = メモが接触している or 近い状態
 */
export const PROXIMITY_MATCH_DISTANCE = 20;

/**
 * 2つの願いメモ間の端と端の距離を計算（AABB距離）
 * メモの中心ではなく、最も近い端同士の距離を計算するため
 * メモを重ねずに近づけるだけでマッチング可能
 * @param wish1 - 最初の願い
 * @param wish2 - 2番目の願い
 * @returns ユークリッド距離（px）。0 = 接触、負 = 重なっている
 */
export const calculateDistance = (wish1: Wish, wish2: Wish): number => {
  // サイズをnumberに確実に変換
  const width1 = typeof wish1.size.width === 'string'
    ? parseInt(wish1.size.width, 10)
    : wish1.size.width;
  const height1 = typeof wish1.size.height === 'string'
    ? parseInt(wish1.size.height, 10)
    : wish1.size.height;

  const width2 = typeof wish2.size.width === 'string'
    ? parseInt(wish2.size.width, 10)
    : wish2.size.width;
  const height2 = typeof wish2.size.height === 'string'
    ? parseInt(wish2.size.height, 10)
    : wish2.size.height;

  // AABB（軸並行境界ボックス）の矩形領域を定義
  const rect1 = {
    left: wish1.position.x,
    top: wish1.position.y,
    right: wish1.position.x + width1,
    bottom: wish1.position.y + height1,
  };

  const rect2 = {
    left: wish2.position.x,
    top: wish2.position.y,
    right: wish2.position.x + width2,
    bottom: wish2.position.y + height2,
  };

  // X軸方向の距離を計算
  let distX = 0;
  if (rect1.right < rect2.left) {
    // rect1が左側、rect2が右側
    distX = rect2.left - rect1.right;
  } else if (rect2.right < rect1.left) {
    // rect2が左側、rect1が右側
    distX = rect1.left - rect2.right;
  }
  // そうでなければ X軸方向で重なっている（distX = 0）

  // Y軸方向の距離を計算
  let distY = 0;
  if (rect1.bottom < rect2.top) {
    // rect1が上側、rect2が下側
    distY = rect2.top - rect1.bottom;
  } else if (rect2.bottom < rect1.top) {
    // rect2が上側、rect1が下側
    distY = rect1.top - rect2.bottom;
  }
  // そうでなければ Y軸方向で重なっている（distY = 0）

  const distance = Math.hypot(distX, distY);

  console.log(`[calculateDistance] "${wish1.title}" vs "${wish2.title}"`);
  console.log(`  wish1: pos=(${wish1.position.x}, ${wish1.position.y}) size=(${width1}, ${height1}) rect=(${rect1.left}, ${rect1.top}, ${rect1.right}, ${rect1.bottom})`);
  console.log(`  wish2: pos=(${wish2.position.x}, ${wish2.position.y}) size=(${width2}, ${height2}) rect=(${rect2.left}, ${rect2.top}, ${rect2.right}, ${rect2.bottom})`);
  console.log(`  distX=${distX.toFixed(2)}, distY=${distY.toFixed(2)}, distance=${distance.toFixed(2)}`);

  // ユークリッド距離を計算：√(distX² + distY²)
  // 0 = メモが接触 or 重なっている
  // > 0 = メモが離れている
  return distance;
};

/**
 * 願いメモと境界ボックス（矩形領域）との距離を計算
 * @param wish - 願いメモ
 * @param bounds - 境界ボックス { x, y, width, height }
 * @returns ユークリッド距離（px）。0 = 接触、負 = 重なっている
 */
export const calculateDistanceToBounds = (
  wish: Wish,
  bounds: { x: number; y: number; width: number; height: number }
): number => {
  // サイズをnumberに確実に変換
  const width = typeof wish.size.width === 'string'
    ? parseInt(wish.size.width, 10)
    : wish.size.width;
  const height = typeof wish.size.height === 'string'
    ? parseInt(wish.size.height, 10)
    : wish.size.height;

  // AABB（軸並行境界ボックス）の矩形領域を定義
  const wishRect = {
    left: wish.position.x,
    top: wish.position.y,
    right: wish.position.x + width,
    bottom: wish.position.y + height,
  };

  const boundsRect = {
    left: bounds.x,
    top: bounds.y,
    right: bounds.x + bounds.width,
    bottom: bounds.y + bounds.height,
  };

  // X軸方向の距離を計算
  let distX = 0;
  if (wishRect.right < boundsRect.left) {
    distX = boundsRect.left - wishRect.right;
  } else if (boundsRect.right < wishRect.left) {
    distX = wishRect.left - boundsRect.right;
  }

  // Y軸方向の距離を計算
  let distY = 0;
  if (wishRect.bottom < boundsRect.top) {
    distY = boundsRect.top - wishRect.bottom;
  } else if (boundsRect.bottom < wishRect.top) {
    distY = wishRect.top - boundsRect.bottom;
  }

  return Math.hypot(distX, distY);
};
