import React from 'react';

interface AvatarProps {
  name: string;
}

const colors = [
  'bg-red-200 text-red-800',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-purple-200 text-purple-800',
  'bg-pink-300 text-pink-900',
  'bg-indigo-200 text-indigo-800',
  'bg-teal-200 text-teal-800',
];

// 文字列からハッシュを計算して色を決定する
const getColorByName = (name: string) => {
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const firstLetter = name ? name.charAt(0) : '?';
  const colorClass = getColorByName(name);

  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
