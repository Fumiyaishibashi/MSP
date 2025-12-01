import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/layout/Sidebar';
import DraggableIpSticky from '../components/canvas/DraggableIpSticky';
import DraggableIdeaSticky from '../components/canvas/DraggableIdeaSticky';
import DraggablePersonSticky from '../components/canvas/DraggablePersonSticky';
import DraggableCompanySticky from '../components/canvas/DraggableCompanySticky';
import Modal from '../components/ui/Modal';
import PersonMemoModal from '../components/modals/PersonMemoModal';
import CompanyMemoModal from '../components/modals/CompanyMemoModal';
import ChatModal from '../components/modals/ChatModal';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Lightbulb, FilePlus, MessageSquare, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { PlacedIpItem, PlacedIdeaItem, PlacedPersonMemoItem, PlacedCompanyMemoItem, IpAssetMaster, PersonMemo, CompanyMemo } from '../types';

const dummyAuthors = ['石橋', '田中', '佐藤', '鈴木', '高橋'];

const EventCanvas = () => {
  const { id: projectId } = useParams();
  const context = useContext(AppContext);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [newIpName, setNewIpName] = useState('');
  const [selectedPersonMemo, setSelectedPersonMemo] = useState<PersonMemo | null>(null);
  const [selectedCompanyMemo, setSelectedCompanyMemo] = useState<CompanyMemo | null>(null);
  const [chatMemo, setChatMemo] = useState<{ type: 'person' | 'company'; memo: PersonMemo | CompanyMemo } | null>(null);

  // ズーム機能用state
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);

  if (!context) {
    return <div>Context is not available.</div>;
  }

  const { projects, setProjects, ipAssets, setIpAssets, personMemos, companyMemos } = context;
  const currentProject = projects.find((p) => p.id === projectId);

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

  const getRandomAuthor = () => dummyAuthors[Math.floor(Math.random() * dummyAuthors.length)];

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
  // macOSのマジックパッド対応
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      e.preventDefault();
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
        const delta = (distance - lastTouchDistance) * 0.01; // 係数を大きくしてズーム感度を上げた
        handleZoom(delta);
      }
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('application/reactflow');
    if (!rawData || !dropAreaRef.current || !currentProject) return;

    const dropAreaBounds = dropAreaRef.current.getBoundingClientRect();
    const position = { x: e.clientX - dropAreaBounds.left, y: e.clientY - dropAreaBounds.top };
    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const author = getRandomAuthor();

    try {
      // Try to parse as JSON for person/company memos
      const dragData = JSON.parse(rawData);

      if (dragData.type === 'person' && dragData.memoId) {
        const newItem: PlacedPersonMemoItem = {
          type: 'person',
          uniqueId: uuidv4(),
          memoId: dragData.memoId,
          author,
          position,
          size: { width: 160, height: 200 },
          zIndex: maxZIndex + 1,
        };
        const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
        setProjects(updatedProjects);
        return;
      }

      if (dragData.type === 'company' && dragData.memoId) {
        const newItem: PlacedCompanyMemoItem = {
          type: 'company',
          uniqueId: uuidv4(),
          memoId: dragData.memoId,
          author,
          position,
          size: { width: 160, height: 200 },
          zIndex: maxZIndex + 1,
        };
        const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
        setProjects(updatedProjects);
        return;
      }
    } catch {
      // Not JSON, so it's an IP asset ID (string)
    }

    // IP asset (string)
    const assetId = rawData;
    const newItem: PlacedIpItem = {
      type: 'ip',
      uniqueId: uuidv4(),
      assetId,
      author,
      position,
      size: { width: 160, height: 192 },
      zIndex: maxZIndex + 1,
      note: '',
    };
    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);
  };

  const handleAddNewIdea = () => {
    if (!currentProject) return;
    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const newItem: PlacedIdeaItem = { type: 'idea', uniqueId: uuidv4(), text: '新しいアイデア', author: getRandomAuthor(), position: { x: 100, y: 100 }, size: { width: 192, height: 160 }, zIndex: maxZIndex + 1 };
    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);
  };

  const handleCreateNewIpAsset = () => {
    if (!newIpName.trim() || !currentProject) return;

    const newAsset: IpAssetMaster = {
      id: `ip_custom_${uuidv4()}`,
      name: newIpName,
      category: '番組IP',
      imagePath: '', // No image for custom IP
      ownerName: '（未設定）',
      contact: '（未設定）',
    };
    setIpAssets(prev => [...prev, newAsset]);

    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const newItem: PlacedIpItem = { type: 'ip', uniqueId: uuidv4(), assetId: newAsset.id, author: getRandomAuthor(), position: { x: 150, y: 150 }, size: { width: 160, height: 192 }, zIndex: maxZIndex + 1, note: '' };
    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);

    setNewIpName('');
    setIsIpModalOpen(false);
  };

  const handleDragStop = (uniqueId: string, d: { x: number; y: number }) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedItems = p.placedItems.map((item) => (item.uniqueId === uniqueId ? { ...item, position: { x: d.x, y: d.y } } : item));
        return { ...p, placedItems: updatedItems };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleResizeStop = (uniqueId: string, size: { width: string | number; height: string | number }) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedItems = p.placedItems.map((item) => (item.uniqueId === uniqueId ? { ...item, size } : item));
        return { ...p, placedItems: updatedItems };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleIdeaTextChange = (uniqueId: string, text: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedItems = p.placedItems.map((item) => (item.uniqueId === uniqueId && item.type === 'idea' ? { ...item, text } : item));
        return { ...p, placedItems: updatedItems };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleIpNoteChange = (uniqueId: string, note: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedItems = p.placedItems.map((item) => (item.uniqueId === uniqueId && item.type === 'ip' ? { ...item, note } : item));
        return { ...p, placedItems: updatedItems };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleDeleteItem = (uniqueId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const updatedItems = p.placedItems.filter((item) => item.uniqueId !== uniqueId);
        return { ...p, placedItems: updatedItems };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">プロジェクトが見つかりません</h2>
        <Link to="/" className="text-blue-500 hover:underline">ダッシュボードに戻る</Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{currentProject.title}</h1>
              <p className="text-sm text-gray-500">{currentProject.location} / {currentProject.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
            <Link
              to={`/projects/${projectId}/chat`}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
            >
              <MessageSquare size={20} />
              プロジェクトチャット
            </Link>
            <button
              onClick={() => setIsIpModalOpen(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
            >
              <FilePlus size={20} />
              IP付箋を追加
            </button>
            <button
              onClick={handleAddNewIdea}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
            >
              <Lightbulb size={20} />
              アイデア付箋を追加
            </button>
          </div>
        </header>
        <main
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 relative overflow-auto bg-dots"
          style={{}}
        >
          <div
            ref={dropAreaRef}
            className="w-full h-full relative"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
            }}
          >
          {currentProject.placedItems.map((item) => {
            if (item.type === 'ip') {
              const asset = ipAssets.find((m) => m.id === item.assetId);
              if (!asset) return null;
              return <DraggableIpSticky key={item.uniqueId} item={item} asset={asset} onStop={handleDragStop} onNoteChange={handleIpNoteChange} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} />;
            }
            if (item.type === 'idea') {
              return <DraggableIdeaSticky key={item.uniqueId} item={item} onStop={handleDragStop} onTextChange={handleIdeaTextChange} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} />;
            }
            if (item.type === 'person') {
              const memo = personMemos.find((m) => m.id === item.memoId);
              if (!memo) return null;
              return <DraggablePersonSticky key={item.uniqueId} item={item} memo={memo} onStop={handleDragStop} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} onOpen={setSelectedPersonMemo} />;
            }
            if (item.type === 'company') {
              const memo = companyMemos.find((m) => m.id === item.memoId);
              if (!memo) return null;
              return <DraggableCompanySticky key={item.uniqueId} item={item} memo={memo} onStop={handleDragStop} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} onOpen={setSelectedCompanyMemo} />;
            }
            return null;
          })}
          </div>
        </main>
      </div>
      <Modal isOpen={isIpModalOpen} onClose={() => setIsIpModalOpen(false)} title="新しいIP付箋を作成">
        <div className="space-y-4">
          <label htmlFor="ip-name" className="block text-sm font-medium text-gray-700">IP名</label>
          <input
            type="text"
            id="ip-name"
            value={newIpName}
            onChange={(e) => setNewIpName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例：新アニメ「〇〇」"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreateNewIpAsset}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              作成
            </button>
          </div>
        </div>
      </Modal>

      <PersonMemoModal
        memo={selectedPersonMemo}
        isOpen={selectedPersonMemo !== null}
        onClose={() => setSelectedPersonMemo(null)}
        onOpenChat={(memo) => setChatMemo({ type: 'person', memo })}
        onDelete={(memoId) => {
          const updatedProject = {
            ...currentProject,
            placedItems: currentProject!.placedItems.filter((item: any) => item.type !== 'person' || item.memoId !== memoId),
          };
          setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
          setSelectedPersonMemo(null);
        }}
      />

      <CompanyMemoModal
        memo={selectedCompanyMemo}
        isOpen={selectedCompanyMemo !== null}
        onClose={() => setSelectedCompanyMemo(null)}
        onOpenChat={(memo) => setChatMemo({ type: 'company', memo })}
        onDelete={(memoId) => {
          const updatedProject = {
            ...currentProject,
            placedItems: currentProject!.placedItems.filter((item: any) => item.type !== 'company' || item.memoId !== memoId),
          };
          setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
          setSelectedCompanyMemo(null);
        }}
      />

      <ChatModal
        memoType={chatMemo?.type || null}
        memo={chatMemo?.memo || null}
        isOpen={chatMemo !== null}
        onClose={() => setChatMemo(null)}
      />
    </div>
  );
};

export default EventCanvas;
