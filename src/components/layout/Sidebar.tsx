import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import type { IpAssetMaster, PersonMemo, CompanyMemo } from '../../types';
import { Camera, ChevronDown, Shirt, Truck, Users, Building2 } from 'lucide-react';

// アイコン名とコンポーネントのマッピング
const iconComponents = {
  Camera: Camera,
  Shirt: Shirt,
  Truck: Truck,
};

const Sidebar = () => {
  const context = useContext(AppContext);
  const ipAssets = context?.ipAssets || [];
  const personMemos = context?.personMemos || [];
  const companyMemos = context?.companyMemos || [];

  // セクション（IP、人メモ、会社メモ）の開閉状態を管理
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'IP アセット': true,
    '人メモ': true,
    '会社メモ': true,
  });

  // カテゴリごとの開閉状態を管理（IP資産内）
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    '番組IP': true,
    'キャラクター/タレント': true,
    '技術/リソース': true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, assetId: string) => {
    e.dataTransfer.setData('application/reactflow', assetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePersonMemoDragStart = (e: React.DragEvent<HTMLDivElement>, memoId: string) => {
    const dragData = JSON.stringify({ type: 'person', memoId });
    e.dataTransfer.setData('application/reactflow', dragData);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCompanyMemoDragStart = (e: React.DragEvent<HTMLDivElement>, memoId: string) => {
    const dragData = JSON.stringify({ type: 'company', memoId });
    e.dataTransfer.setData('application/reactflow', dragData);
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
      <div className="space-y-4">
        {/* IP アセット セクション */}
        <div>
          <button onClick={() => toggleSection('IP アセット')} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-200">
            <h3 className="text-lg font-bold text-gray-700">IP アセット</h3>
            <ChevronDown size={20} className={`transition-transform ${openSections['IP アセット'] ? 'rotate-180' : ''}`} />
          </button>
          {openSections['IP アセット'] && (
            <div className="space-y-2 mt-2">
              {Object.entries(groupedAssets).map(([category, assets]) => (
                <div key={category}>
                  <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-200">
                    <h4 className="font-bold text-gray-600">{category}</h4>
                    <ChevronDown size={16} className={`transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} />
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
          )}
        </div>

        {/* 人メモ セクション */}
        <div>
          <button onClick={() => toggleSection('人メモ')} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-200">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-700">人メモ</h3>
            </div>
            <ChevronDown size={20} className={`transition-transform ${openSections['人メモ'] ? 'rotate-180' : ''}`} />
          </button>
          {openSections['人メモ'] && (
            <div className="space-y-2 mt-2">
              {personMemos.map((person) => (
                <div
                  key={person.id}
                  draggable
                  onDragStart={(e) => handlePersonMemoDragStart(e, person.id)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 shadow-sm border border-blue-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-blue-100 transition-all"
                >
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-200 rounded-full">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{person.name}</p>
                    <p className="text-xs text-gray-600 truncate">{person.department}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 会社メモ セクション */}
        <div>
          <button onClick={() => toggleSection('会社メモ')} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-200">
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-700">会社メモ</h3>
            </div>
            <ChevronDown size={20} className={`transition-transform ${openSections['会社メモ'] ? 'rotate-180' : ''}`} />
          </button>
          {openSections['会社メモ'] && (
            <div className="space-y-2 mt-2">
              {companyMemos.map((company) => (
                <div
                  key={company.id}
                  draggable
                  onDragStart={(e) => handleCompanyMemoDragStart(e, company.id)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-green-50 shadow-sm border border-green-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-green-100 transition-all"
                >
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-green-200 rounded">
                    <Building2 size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{company.name}</p>
                    <p className="text-xs text-gray-600 truncate">{company.specialty.join('、')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
