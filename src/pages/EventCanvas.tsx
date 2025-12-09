import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import DraggableIpSticky from '../components/canvas/DraggableIpSticky';
import DraggableIdeaSticky from '../components/canvas/DraggableIdeaSticky';
import DraggablePersonSticky from '../components/canvas/DraggablePersonSticky';
import DraggableCompanySticky from '../components/canvas/DraggableCompanySticky';
import Modal from '../components/ui/Modal';
import PersonMemoModal from '../components/modals/PersonMemoModal';
import CompanyMemoModal from '../components/modals/CompanyMemoModal';
import ChatModal from '../components/modals/ChatModal';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Lightbulb, FilePlus, MessageSquare, ZoomIn, ZoomOut, Maximize, Users, Building2 } from 'lucide-react';
import type { PlacedIpItem, PlacedIdeaItem, PlacedPersonMemoItem, PlacedCompanyMemoItem, IpAssetMaster, PersonMemo, CompanyMemo } from '../types';

const EventCanvas = () => {
  const { id: projectId } = useParams();
  const context = useContext(AppContext);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [newIpName, setNewIpName] = useState('');
  const [newIpProducer, setNewIpProducer] = useState('');
  const [newIpDirector, setNewIpDirector] = useState('');
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [selectedPersonMemo, setSelectedPersonMemo] = useState<PersonMemo | null>(null);
  const [selectedPersonMemoAuthor, setSelectedPersonMemoAuthor] = useState<string>('');
  const [selectedCompanyMemo, setSelectedCompanyMemo] = useState<CompanyMemo | null>(null);
  const [selectedCompanyMemoAuthor, setSelectedCompanyMemoAuthor] = useState<string>('');
  const [chatMemo, setChatMemo] = useState<{ type: 'person' | 'company'; memo: PersonMemo | CompanyMemo } | null>(null);

  // 新規人付箋用のform state
  const [newPersonForm, setNewPersonForm] = useState({
    name: '',
    department: '',
    expertise: [] as string[],
    email: '',
    phone: '',
    pastProjects: [] as string[],
  });

  // 新規会社付箋用のform state
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    specialty: [] as string[],
    pastProjects: [] as string[],
  });

  // ズーム機能用state
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);

  if (!context) {
    return <div>Context is not available.</div>;
  }

  const { projects, setProjects, ipAssets, setIpAssets, personMemos, companyMemos, currentUser } = context;
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
    const author = currentUser.name;

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
    const newItem: PlacedIdeaItem = { type: 'idea', uniqueId: uuidv4(), text: '新しいアイデア', author: currentUser.name, position: { x: 100, y: 100 }, size: { width: 192, height: 160 }, zIndex: maxZIndex + 1 };
    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);
  };

  const handleCreatePersonSticky = () => {
    if (!newPersonForm.name.trim() || !newPersonForm.email.trim() || !currentProject) return;

    const newPerson: PersonMemo = {
      id: `person_custom_${uuidv4()}`,
      name: newPersonForm.name,
      department: newPersonForm.department,
      company: 'mbs_tv',
      yearsOfService: 3,
      expertise: newPersonForm.expertise.filter((e) => e.trim()),
      email: newPersonForm.email,
      phone: newPersonForm.phone,
      pastProjects: newPersonForm.pastProjects.filter((p) => p.trim()),
    };

    context.setPersonMemos((prev) => [...prev, newPerson]);

    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const newItem: PlacedPersonMemoItem = {
      type: 'person',
      uniqueId: uuidv4(),
      memoId: newPerson.id,
      author: currentUser.name,
      position: { x: 150, y: 150 },
      size: { width: 160, height: 200 },
      zIndex: maxZIndex + 1,
    };

    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);

    setNewPersonForm({
      name: '',
      department: '',
      expertise: [],
      email: '',
      phone: '',
      pastProjects: [],
    });
    setIsAddPersonModalOpen(false);
  };

  const handleCreateCompanySticky = () => {
    if (!newCompanyForm.name.trim() || !currentProject) return;

    const newCompany: CompanyMemo = {
      id: `company_custom_${uuidv4()}`,
      name: newCompanyForm.name,
      specialty: newCompanyForm.specialty.filter((s) => s.trim()),
      pastProjects: newCompanyForm.pastProjects.filter((p) => p.trim()),
      pointOfContact: [],
    };

    context.setCompanyMemos((prev) => [...prev, newCompany]);

    const maxZIndex = currentProject.placedItems.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const newItem: PlacedCompanyMemoItem = {
      type: 'company',
      uniqueId: uuidv4(),
      memoId: newCompany.id,
      author: currentUser.name,
      position: { x: 200, y: 200 },
      size: { width: 160, height: 200 },
      zIndex: maxZIndex + 1,
    };

    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);

    setNewCompanyForm({
      name: '',
      specialty: [],
      pastProjects: [],
    });
    setIsAddCompanyModalOpen(false);
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

    // プロデューサー・ディレクター情報をnoteに保存
    let noteText = '';
    if (newIpProducer.trim() || newIpDirector.trim()) {
      const parts = [];
      if (newIpProducer.trim()) parts.push(`プロデューサー：${newIpProducer}`);
      if (newIpDirector.trim()) parts.push(`ディレクター：${newIpDirector}`);
      noteText = parts.join('\n');
    }

    const newItem: PlacedIpItem = { type: 'ip', uniqueId: uuidv4(), assetId: newAsset.id, author: currentUser.name, position: { x: 150, y: 150 }, size: { width: 160, height: 192 }, zIndex: maxZIndex + 1, note: noteText };
    const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, placedItems: [...p.placedItems, newItem] } : p));
    setProjects(updatedProjects);

    setNewIpName('');
    setNewIpProducer('');
    setNewIpDirector('');
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
      <div className="flex-1 flex flex-col">
        <header className="shadow-sm p-4 border-b border-gray-200 flex justify-between items-center" style={{ backgroundColor: '#ffff95ff' }}>
          <div className="flex items-center gap-4">
            <img
              src="/assets/logo_mbs_synergy.png"
              alt="MBS Synergy Logo"
              className="h-10 w-auto"
            />
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
              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1.5 px-3 rounded text-sm shadow-md transition-all duration-200"
            >
              <MessageSquare size={16} />
              チャット
            </Link>
            <button
              onClick={() => setIsIpModalOpen(true)}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-3 rounded text-sm shadow-md transition-all duration-200"
            >
              <FilePlus size={16} />
              IP追加
            </button>
            <button
              onClick={handleAddNewIdea}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-1.5 px-3 rounded text-sm shadow-md transition-all duration-200"
            >
              <Lightbulb size={16} />
              アイデア追加
            </button>
            <button
              onClick={() => setIsAddPersonModalOpen(true)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded text-sm shadow-md transition-all duration-200"
            >
              <Users size={16} />
              人追加
            </button>
            <button
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded text-sm shadow-md transition-all duration-200"
            >
              <Building2 size={16} />
              会社追加
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
              return <DraggableIpSticky key={item.uniqueId} item={item} asset={asset} authorEmail={currentUser.email} onStop={handleDragStop} onNoteChange={handleIpNoteChange} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} />;
            }
            if (item.type === 'idea') {
              return <DraggableIdeaSticky key={item.uniqueId} item={item} authorEmail={currentUser.email} onStop={handleDragStop} onTextChange={handleIdeaTextChange} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} />;
            }
            if (item.type === 'person') {
              const memo = personMemos.find((m) => m.id === item.memoId);
              if (!memo) return null;
              return <DraggablePersonSticky key={item.uniqueId} item={item} memo={memo} onStop={handleDragStop} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} onOpen={(memo) => { setSelectedPersonMemo(memo); setSelectedPersonMemoAuthor(item.author); }} onOpenChat={(memo) => setChatMemo({ type: 'person', memo })} />;
            }
            if (item.type === 'company') {
              const memo = companyMemos.find((m) => m.id === item.memoId);
              if (!memo) return null;
              return <DraggableCompanySticky key={item.uniqueId} item={item} memo={memo} onStop={handleDragStop} onResizeStop={handleResizeStop} onDelete={handleDeleteItem} onOpen={(memo) => { setSelectedCompanyMemo(memo); setSelectedCompanyMemoAuthor(item.author); }} onOpenChat={(memo) => setChatMemo({ type: 'company', memo })} />;
            }
            return null;
          })}
          </div>
        </main>
      </div>
      <Modal isOpen={isIpModalOpen} onClose={() => setIsIpModalOpen(false)} title="新しいIP付箋を作成">
        <div className="space-y-4">
          <div>
            <label htmlFor="ip-name" className="block text-sm font-medium text-gray-700 mb-1">IP名</label>
            <input
              type="text"
              id="ip-name"
              value={newIpName}
              onChange={(e) => setNewIpName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例：新アニメ「〇〇」"
            />
          </div>
          <div>
            <label htmlFor="ip-producer" className="block text-sm font-medium text-gray-700 mb-1">プロデューサー</label>
            <input
              type="text"
              id="ip-producer"
              value={newIpProducer}
              onChange={(e) => setNewIpProducer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例：山田太郎"
            />
          </div>
          <div>
            <label htmlFor="ip-director" className="block text-sm font-medium text-gray-700 mb-1">ディレクター</label>
            <input
              type="text"
              id="ip-director"
              value={newIpDirector}
              onChange={(e) => setNewIpDirector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例：田中花子"
            />
          </div>
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

      <Modal isOpen={isAddPersonModalOpen} onClose={() => setIsAddPersonModalOpen(false)} title="新しい人付箋を作成">
        <div className="space-y-4">
          <div>
            <label htmlFor="person-name" className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input
              type="text"
              id="person-name"
              value={newPersonForm.name}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="山田太郎"
            />
          </div>
          <div>
            <label htmlFor="person-dept" className="block text-sm font-medium text-gray-700 mb-1">部門</label>
            <input
              type="text"
              id="person-dept"
              value={newPersonForm.department}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="営業部"
            />
          </div>
          <div>
            <label htmlFor="person-expertise" className="block text-sm font-medium text-gray-700 mb-1">専門領域（カンマ区切り）</label>
            <input
              type="text"
              id="person-expertise"
              value={newPersonForm.expertise.join(', ')}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, expertise: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="営業戦略, ビジネス開発"
            />
          </div>
          <div>
            <label htmlFor="person-email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              id="person-email"
              value={newPersonForm.email}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="yamada@example.com"
            />
          </div>
          <div>
            <label htmlFor="person-phone" className="block text-sm font-medium text-gray-700 mb-1">電話番号（任意）</label>
            <input
              type="tel"
              id="person-phone"
              value={newPersonForm.phone}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="090-1234-5678"
            />
          </div>
          <div>
            <label htmlFor="person-projects" className="block text-sm font-medium text-gray-700 mb-1">過去実績（カンマ区切り）</label>
            <textarea
              id="person-projects"
              value={newPersonForm.pastProjects.join(', ')}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, pastProjects: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="プロジェクトA, プロジェクトB"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddPersonModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              キャンセル
            </button>
            <button
              onClick={handleCreatePersonSticky}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              作成
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isAddCompanyModalOpen} onClose={() => setIsAddCompanyModalOpen(false)} title="新しい会社付箋を作成">
        <div className="space-y-4">
          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
            <input
              type="text"
              id="company-name"
              value={newCompanyForm.name}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="株式会社〇〇"
            />
          </div>
          <div>
            <label htmlFor="company-specialty" className="block text-sm font-medium text-gray-700 mb-1">得意分野（カンマ区切り）</label>
            <input
              type="text"
              id="company-specialty"
              value={newCompanyForm.specialty.join(', ')}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, specialty: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="映像制作, 4K撮影, ドローン撮影"
            />
          </div>
          <div>
            <label htmlFor="company-projects" className="block text-sm font-medium text-gray-700 mb-1">過去実績（カンマ区切り）</label>
            <textarea
              id="company-projects"
              value={newCompanyForm.pastProjects.join(', ')}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, pastProjects: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="プロジェクトA, プロジェクトB"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddCompanyModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              キャンセル
            </button>
            <button
              onClick={handleCreateCompanySticky}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              作成
            </button>
          </div>
        </div>
      </Modal>

      <PersonMemoModal
        memo={selectedPersonMemo}
        authorName={selectedPersonMemoAuthor}
        authorEmail={currentUser.email}
        isOpen={selectedPersonMemo !== null}
        onClose={() => { setSelectedPersonMemo(null); setSelectedPersonMemoAuthor(''); }}
        onOpenChat={(memo) => setChatMemo({ type: 'person', memo })}
        onDelete={(memoId) => {
          const updatedProject = {
            ...currentProject,
            placedItems: currentProject!.placedItems.filter((item: any) => item.type !== 'person' || item.memoId !== memoId),
          };
          setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
          setSelectedPersonMemo(null);
          setSelectedPersonMemoAuthor('');
        }}
      />

      <CompanyMemoModal
        memo={selectedCompanyMemo}
        authorName={selectedCompanyMemoAuthor}
        authorEmail={currentUser.email}
        isOpen={selectedCompanyMemo !== null}
        onClose={() => { setSelectedCompanyMemo(null); setSelectedCompanyMemoAuthor(''); }}
        onOpenChat={(memo) => setChatMemo({ type: 'company', memo })}
        onDelete={(memoId) => {
          const updatedProject = {
            ...currentProject,
            placedItems: currentProject!.placedItems.filter((item: any) => item.type !== 'company' || item.memoId !== memoId),
          };
          setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
          setSelectedCompanyMemo(null);
          setSelectedCompanyMemoAuthor('');
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
