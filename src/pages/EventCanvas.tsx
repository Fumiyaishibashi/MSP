import React, { useContext, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/layout/Sidebar';
import DraggableIpSticky from '../components/canvas/DraggableIpSticky';
import DraggableIdeaSticky from '../components/canvas/DraggableIdeaSticky';
import Modal from '../components/ui/Modal';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Lightbulb, FilePlus } from 'lucide-react';
import type { PlacedIpItem, PlacedIdeaItem, IpAssetMaster } from '../types';
import { Rnd } from 'react-rnd';

const dummyAuthors = ['石橋', '田中', '佐藤', '鈴木', '高橋'];

const EventCanvas = () => {
  const { id: projectId } = useParams();
  const context = useContext(AppContext);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [newIpName, setNewIpName] = useState('');

  if (!context) {
    return <div>Context is not available.</div>;
  }

  const { projects, setProjects, ipAssets, setIpAssets } = context;
  const currentProject = projects.find((p) => p.id === projectId);

  const getRandomAuthor = () => dummyAuthors[Math.floor(Math.random() * dummyAuthors.length)];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('application/reactflow');
    if (!assetId || !dropAreaRef.current || !currentProject) return;

    const dropAreaBounds = dropAreaRef.current.getBoundingClientRect();
    const position = { x: e.clientX - dropAreaBounds.left, y: e.clientY - dropAreaBounds.top };
    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);

    const newItem: PlacedIpItem = { type: 'ip', uniqueId: uuidv4(), assetId, author: getRandomAuthor(), position, size: { width: 160, height: 192 }, zIndex: maxZIndex + 1, note: '' };
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
        <main ref={dropAreaRef} onDragOver={handleDragOver} onDrop={handleDrop} className="flex-1 relative overflow-hidden bg-dots">
          {currentProject.placedItems.map((item) => {
            if (item.type === 'ip') {
              const asset = ipAssets.find((m) => m.id === item.assetId);
              if (!asset) return null;
              return <DraggableIpSticky key={item.uniqueId} item={item} asset={asset} onStop={handleDragStop} onNoteChange={handleIpNoteChange} onResizeStop={handleResizeStop} />;
            }
            if (item.type === 'idea') {
              return <DraggableIdeaSticky key={item.uniqueId} item={item} onStop={handleDragStop} onTextChange={handleIdeaTextChange} onResizeStop={handleResizeStop} />;
            }
            return null;
          })}
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
    </div>
  );
};

export default EventCanvas;
