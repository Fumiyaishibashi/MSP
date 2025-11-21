import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { IpAssetMaster } from '../../types';
import { Camera, ChevronDown, Shirt, Truck } from 'lucide-react';

// アイコン名とコンポーネントのマッピング
const iconComponents = {
  Camera: Camera,
  Shirt: Shirt,
  Truck: Truck,
};

const Sidebar = () => {
  const context = useContext(AppContext);
  const ipAssets = context?.ipAssets || [];

  // カテゴリごとの開閉状態を管理
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    '番組IP': true,
    'キャラクター/タレント': true,
    '技術/リソース': true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, assetId: string) => {
    e.dataTransfer.setData('application/reactflow', assetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // アセットをカテゴリごとにグループ化
  const groupedAssets = ipAssets.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(asset);
    return acc;
  }, {} as Record<string, IpAssetMaster[]>);

  return (
    <aside className="w-72 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-700 px-2">IP アセット一覧</h2>
      <div className="space-y-2">
        {Object.entries(groupedAssets).map(([category, assets]) => (
          <div key={category}>
            <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-200">
              <h3 className="font-bold text-gray-600">{category}</h3>
              <ChevronDown size={20} className={`transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} />
            </button>
            {openCategories[category] && (
              <div className="space-y-2 mt-2 ml-2">
                {assets.map((asset) => {
                  const IconComponent = asset.iconName ? iconComponents[asset.iconName as keyof typeof iconComponents] : null;
                  return (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.id)}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-300 transition-all"
                    >
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded">
                        {IconComponent ? <IconComponent className="text-gray-600" /> : <img src={asset.imagePath || '/assets/placeholder.svg'} alt={asset.name} className="w-full h-full object-contain" />}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{asset.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
