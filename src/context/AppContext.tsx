import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { EventProject, IpAssetMaster, PersonMemo, CompanyMemo, Message, ProjectMessage, ProjectChat, ProjectChatParticipant, MemoChat, MemoChatParticipant } from '../types';
import { demoProjects } from '../data/demoProjects';
import { ipAssetMasters as initialIpAssets } from '../data/masterData';
import { masterPersonData } from '../data/masterPersonData';
import { masterCompanyData } from '../data/masterCompanyData';

const PROJECTS_STORAGE_KEY = 'mbs_app_data_projects';
const ASSETS_STORAGE_KEY = 'mbs_app_assets';
const PERSON_MEMOS_STORAGE_KEY = 'mbs_app_person_memos';
const COMPANY_MEMOS_STORAGE_KEY = 'mbs_app_company_memos';
const MESSAGES_STORAGE_KEY = 'mbs_app_messages';
const PROJECT_CHATS_STORAGE_KEY = 'mbs_app_project_chats';
const MEMO_CHATS_STORAGE_KEY = 'mbs_app_memo_chats';

// デモ用ログインユーザー
const demoCurrentUser: PersonMemo = {
  id: 'person_suzuki',
  name: '鈴木太郎',
  department: 'グッズ制作部',
  expertise: ['グッズ制作', 'ブランディング'],
  email: 'suzuki.taro@mbs.co.jp',
  phone: '090-1234-5678',
  pastProjects: ['ごぶごぶ FES', 'ヤンタン周年グッズ'],
};

interface AppContextType {
  currentUser: PersonMemo;
  projects: EventProject[];
  setProjects: Dispatch<SetStateAction<EventProject[]>>;
  ipAssets: IpAssetMaster[];
  setIpAssets: Dispatch<SetStateAction<IpAssetMaster[]>>;
  personMemos: PersonMemo[];
  setPersonMemos: Dispatch<SetStateAction<PersonMemo[]>>;
  companyMemos: CompanyMemo[];
  setCompanyMemos: Dispatch<SetStateAction<CompanyMemo[]>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  projectChats: ProjectChat[];
  setProjectChats: Dispatch<SetStateAction<ProjectChat[]>>;
  memoChats: MemoChat[];
  setMemoChats: Dispatch<SetStateAction<MemoChat[]>>;
  // Message utilities
  addMessage: (memoType: 'person' | 'company', memoId: string, author: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  getMessagesForMemo: (memoType: 'person' | 'company', memoId: string) => Message[];
  // Memo Chat utilities
  getOrCreateMemoChat: (memoType: 'person' | 'company', memoId: string) => MemoChat;
  addMemoChatParticipant: (memoType: 'person' | 'company', memoId: string, participant: MemoChatParticipant) => void;
  getMemoChatParticipants: (memoType: 'person' | 'company', memoId: string) => MemoChatParticipant[];
  removeMemoChatParticipant: (memoType: 'person' | 'company', memoId: string, personId: string) => void;
  // Project Chat utilities
  getOrCreateProjectChat: (projectId: string) => ProjectChat;
  addProjectMessage: (projectId: string, author: string, content: string) => void;
  getProjectMessages: (projectId: string) => ProjectMessage[];
  getProjectChatParticipants: (projectId: string) => ProjectChatParticipant[];
  addProjectChatParticipant: (projectId: string, participant: ProjectChatParticipant) => void;
  removeProjectChatParticipant: (projectId: string, personId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Projects State
  const [projects, setProjects] = useState<EventProject[]>(() => {
    try {
      const savedData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : demoProjects;
    } catch (error) {
      console.error("Failed to parse projects from localStorage", error);
      return demoProjects;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
    }
  }, [projects]);

  // IP Assets State
  const [ipAssets, setIpAssets] = useState<IpAssetMaster[]>(() => {
    try {
      const savedData = localStorage.getItem(ASSETS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : initialIpAssets;
    } catch (error) {
      console.error("Failed to parse ipAssets from localStorage", error);
      return initialIpAssets;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(ipAssets));
    } catch (error) {
      console.error("Failed to save ipAssets to localStorage", error);
    }
  }, [ipAssets]);

  // Person Memos State
  const [personMemos, setPersonMemos] = useState<PersonMemo[]>(() => {
    try {
      const savedData = localStorage.getItem(PERSON_MEMOS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : masterPersonData;
    } catch (error) {
      console.error("Failed to parse personMemos from localStorage", error);
      return masterPersonData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PERSON_MEMOS_STORAGE_KEY, JSON.stringify(personMemos));
    } catch (error) {
      console.error("Failed to save personMemos to localStorage", error);
    }
  }, [personMemos]);

  // Company Memos State
  const [companyMemos, setCompanyMemos] = useState<CompanyMemo[]>(() => {
    try {
      const savedData = localStorage.getItem(COMPANY_MEMOS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : masterCompanyData;
    } catch (error) {
      console.error("Failed to parse companyMemos from localStorage", error);
      return masterCompanyData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_MEMOS_STORAGE_KEY, JSON.stringify(companyMemos));
    } catch (error) {
      console.error("Failed to save companyMemos to localStorage", error);
    }
  }, [companyMemos]);

  // Demo messages for ごぶごぶフェス
  const demoMessages: Message[] = [
    {
      id: 'demo_msg_1',
      memoType: 'person',
      memoId: 'person_suzuki',
      author: '鈴木太郎',
      content: 'ごぶごぶフェス、楽しみですね！グッズ製作のアイデアいろいろあります',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 'demo_msg_2',
      memoType: 'person',
      memoId: 'person_suzuki',
      author: '田中花子',
      content: '4K撮影チーム、リハーサル日程調整中です。来週水曜でどうでしょう？',
      timestamp: new Date(Date.now() - 2400000),
    },
    {
      id: 'demo_msg_3',
      memoType: 'person',
      memoId: 'person_suzuki',
      author: '佐藤次郎',
      content: '撮影機材の搬入、事前チェックリスト作成しました。確認お願いします！',
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: 'demo_msg_4',
      memoType: 'person',
      memoId: 'person_suzuki',
      author: '山本美咲',
      content: 'イベント運営パートナー、3社から提案いただきました。費用感も良好です👍',
      timestamp: new Date(Date.now() - 1200000),
    },
    {
      id: 'demo_msg_5',
      memoType: 'person',
      memoId: 'person_suzuki',
      author: '鈴木太郎',
      content: '素晴らしい！では来週月曜の企画会議で最終決定しましょう。みんなお疲れ〜',
      timestamp: new Date(Date.now() - 600000),
    },
  ];

  // Messages State
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedData = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (!savedData) return demoMessages;
      const parsed = JSON.parse(savedData);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
      return demoMessages;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

  // Demo project chat for ごぶごぶフェス
  const demoProjectChats: ProjectChat[] = [
    {
      projectId: 'proj_gobugobu_fes',
      participants: [
        { personId: 'person_suzuki', name: '鈴木太郎', role: 'person_memo', reason: 'グッズ制作部 責任者' },
        { personId: 'person_tanaka', name: '田中花子', role: 'person_memo', reason: 'ラジオ制作部 責任者' },
        { personId: 'person_satoh', name: '佐藤次郎', role: 'person_memo', reason: 'テレビ制作部 責任者' },
        { personId: 'person_yamamoto', name: '山本美咲', role: 'person_memo', reason: '事業局 企画担当' },
        { personId: 'person_itoh', name: '伊藤健一', role: 'person_memo', reason: '技術局 技術統括' },
      ],
      messages: [
        { id: 'proj_msg_1', projectId: 'proj_gobugobu_fes', author: '鈴木太郎', content: 'ごぶごぶフェス2025、企画を本格化させましょう！🎉', timestamp: new Date(Date.now() - 7200000), role: 'person_memo' },
        { id: 'proj_msg_2', projectId: 'proj_gobugobu_fes', author: '山本美咲', content: '会場は京セラドーム大阪で確定しました。収容数8000人です。すごい！', timestamp: new Date(Date.now() - 6900000), role: 'person_memo' },
        { id: 'proj_msg_3', projectId: 'proj_gobugobu_fes', author: '田中花子', content: '4K撮影チーム、舞台中央と客席両方からの映像を計画してます。迫力満点！📹', timestamp: new Date(Date.now() - 6600000), role: 'person_memo' },
        { id: 'proj_msg_4', projectId: 'proj_gobugobu_fes', author: '佐藤次郎', content: 'グッズ制作、ラインナップが決まりました。推し芸人グッズとコラボグッズで20種類！', timestamp: new Date(Date.now() - 6300000), role: 'person_memo' },
        { id: 'proj_msg_5', projectId: 'proj_gobugobu_fes', author: '伊藤健一', content: 'ステージ機材、リハーサルスケジュール作成完了。来週木曜から開始予定。', timestamp: new Date(Date.now() - 6000000), role: 'person_memo' },
        { id: 'proj_msg_6', projectId: 'proj_gobugobu_fes', author: '鈴木太郎', content: '来週の打ち合わせで詳細スケジュール決めましょう。金曜の14時でどう？', timestamp: new Date(Date.now() - 5700000), role: 'person_memo' },
        { id: 'proj_msg_7', projectId: 'proj_gobugobu_fes', author: '田中花子', content: 'OK！金曜14時で参加します。放送部門との調整も進めます。', timestamp: new Date(Date.now() - 5400000), role: 'person_memo' },
        { id: 'proj_msg_8', projectId: 'proj_gobugobu_fes', author: '山本美咲', content: '金曜14時、事業局からも参加します！', timestamp: new Date(Date.now() - 5100000), role: 'person_memo' },
        { id: 'proj_msg_9', projectId: 'proj_gobugobu_fes', author: '伊藤健一', content: '技術局も参加します。音響・照明・映像システムの最終確認をしましょう。', timestamp: new Date(Date.now() - 4800000), role: 'person_memo' },
        { id: 'proj_msg_10', projectId: 'proj_gobugobu_fes', author: '佐藤次郎', content: 'グッズ制作部も参加可能です。グッズ販売コーナーのレイアウトも詰めたいです。', timestamp: new Date(Date.now() - 4500000), role: 'person_memo' },
        { id: 'proj_msg_11', projectId: 'proj_gobugobu_fes', author: '鈴木太郎', content: 'ありがとう！みんなで最高のフェスにしよう。ちなみにチケット販売開始は来月1日です。', timestamp: new Date(Date.now() - 4200000), role: 'person_memo' },
        { id: 'proj_msg_12', projectId: 'proj_gobugobu_fes', author: '山本美咲', content: 'チケット販売の告知、全メディアで連動で発表しましょう！SNS・ラジオ・テレビで盛り上げます。', timestamp: new Date(Date.now() - 3900000), role: 'person_memo' },
        { id: 'proj_msg_13', projectId: 'proj_gobugobu_fes', author: '田中花子', content: 'ラジオ枠で毎日プロモ番組やります！リスナーの盛り上がり楽しみだな〜😊', timestamp: new Date(Date.now() - 3600000), role: 'person_memo' },
        { id: 'proj_msg_14', projectId: 'proj_gobugobu_fes', author: '佐藤次郎', content: 'グッズの先行販売も考えてます。フェス限定グッズは販売数限定にしましょう。', timestamp: new Date(Date.now() - 3300000), role: 'person_memo' },
        { id: 'proj_msg_15', projectId: 'proj_gobugobu_fes', author: '伊藤健一', content: 'テスト配信も予定中です。配信品質チェック重要ですね。', timestamp: new Date(Date.now() - 3000000), role: 'person_memo' },
        { id: 'proj_msg_16', projectId: 'proj_gobugobu_fes', author: '鈴木太郎', content: '配信は？ぜひやりましょう。全国のファンが見られるようにしたいです！', timestamp: new Date(Date.now() - 2700000), role: 'person_memo' },
        { id: 'proj_msg_17', projectId: 'proj_gobugobu_fes', author: '山本美咲', content: '配信もプレミアム会員向けライブ配信で検討中。ファンとの繋がりが深まります。', timestamp: new Date(Date.now() - 2400000), role: 'person_memo' },
        { id: 'proj_msg_18', projectId: 'proj_gobugobu_fes', author: '田中花子', content: 'ラジオ＋テレビ＋配信で三つ巴！これぞメディアミックス！🎬', timestamp: new Date(Date.now() - 2100000), role: 'person_memo' },
        { id: 'proj_msg_19', projectId: 'proj_gobugobu_fes', author: '佐藤次郎', content: 'グッズもオンラインストアで販売します。物販コーナーと連動させましょう。', timestamp: new Date(Date.now() - 1800000), role: 'person_memo' },
        { id: 'proj_msg_20', projectId: 'proj_gobugobu_fes', author: '伊藤健一', content: 'WiFi環境も整備します。会場でSNS発信しやすくしましょう。📱', timestamp: new Date(Date.now() - 1500000), role: 'person_memo' },
        { id: 'proj_msg_21', projectId: 'proj_gobugobu_fes', author: '鈴木太郎', content: 'いいね！会場内でSNS盛り上がったら、ネット広告にもなる。最高！', timestamp: new Date(Date.now() - 1200000), role: 'person_memo' },
        { id: 'proj_msg_22', projectId: 'proj_gobugobu_fes', author: '山本美咲', content: 'インフルエンサーとのコラボも考えてます。当日会場に来てもらえるか打診中です。', timestamp: new Date(Date.now() - 900000), role: 'person_memo' },
        { id: 'proj_msg_23', projectId: 'proj_gobugobu_fes', author: '田中花子', content: '本当にこのフェス盛り上がりそう...。放送もお力添えします！', timestamp: new Date(Date.now() - 600000), role: 'person_memo' },
        { id: 'proj_msg_24', projectId: 'proj_gobugobu_fes', author: '佐藤次郎', content: 'グッズ制作も本気出す。8000人分以上用意できるようにします！', timestamp: new Date(Date.now() - 300000), role: 'person_memo' },
        { id: 'proj_msg_25', projectId: 'proj_gobugobu_fes', author: '伊藤健一', content: 'みんなの気合い伝わってきた。技術面でも全力サポートします！💪', timestamp: new Date(Date.now() - 120000), role: 'person_memo' },
      ],
    },
  ];

  // Project Chats State
  const [projectChats, setProjectChats] = useState<ProjectChat[]>(() => {
    try {
      const savedData = localStorage.getItem(PROJECT_CHATS_STORAGE_KEY);
      if (!savedData) return demoProjectChats;
      const parsed = JSON.parse(savedData);
      // Convert timestamp strings back to Date objects
      return parsed.map((chat: any) => ({
        ...chat,
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error("Failed to parse projectChats from localStorage", error);
      return demoProjectChats;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROJECT_CHATS_STORAGE_KEY, JSON.stringify(projectChats));
    } catch (error) {
      console.error("Failed to save projectChats to localStorage", error);
    }
  }, [projectChats]);

  // Demo memo chat with participants for ごぶごぶフェス
  const demoMemoChats: MemoChat[] = [
    {
      memoType: 'person',
      memoId: 'person_suzuki',
      participants: [
        { personId: 'person_suzuki', name: '鈴木太郎' },
        { personId: 'person_tanaka', name: '田中花子' },
        { personId: 'person_satoh', name: '佐藤次郎' },
        { personId: 'person_yamamoto', name: '山本美咲' },
        { personId: 'person_itoh', name: '伊藤健一' },
      ],
    },
  ];

  // Memo Chats State
  const [memoChats, setMemoChats] = useState<MemoChat[]>(() => {
    try {
      const savedData = localStorage.getItem(MEMO_CHATS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : demoMemoChats;
    } catch (error) {
      console.error("Failed to parse memoChats from localStorage", error);
      return demoMemoChats;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MEMO_CHATS_STORAGE_KEY, JSON.stringify(memoChats));
    } catch (error) {
      console.error("Failed to save memoChats to localStorage", error);
    }
  }, [memoChats]);

  // Message Utilities
  const addMessage = (memoType: 'person' | 'company', memoId: string, author: string, content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memoType,
      memoId,
      author,
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  const getMessagesForMemo = (memoType: 'person' | 'company', memoId: string): Message[] => {
    return messages
      .filter((msg) => msg.memoType === memoType && msg.memoId === memoId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  // Memo Chat Utilities
  const getOrCreateMemoChat = (memoType: 'person' | 'company', memoId: string): MemoChat => {
    let chat = memoChats.find((c) => c.memoType === memoType && c.memoId === memoId);
    if (!chat) {
      chat = {
        memoType,
        memoId,
        participants: [],
      };
      setMemoChats([...memoChats, chat]);
    }
    return chat;
  };

  const addMemoChatParticipant = (memoType: 'person' | 'company', memoId: string, participant: MemoChatParticipant) => {
    const updatedChats = memoChats.map((c) => {
      if (c.memoType === memoType && c.memoId === memoId) {
        // 既に参加者が存在するかチェック
        if (!c.participants.find((p) => p.personId === participant.personId)) {
          return { ...c, participants: [...c.participants, participant] };
        }
      }
      return c;
    });

    // チャットが存在しない場合は新規作成
    if (!memoChats.find((c) => c.memoType === memoType && c.memoId === memoId)) {
      updatedChats.push({
        memoType,
        memoId,
        participants: [participant],
      });
    }

    setMemoChats(updatedChats);
  };

  const getMemoChatParticipants = (memoType: 'person' | 'company', memoId: string): MemoChatParticipant[] => {
    const chat = memoChats.find((c) => c.memoType === memoType && c.memoId === memoId);
    return chat ? chat.participants : [];
  };

  const removeMemoChatParticipant = (memoType: 'person' | 'company', memoId: string, personId: string) => {
    const updatedChats = memoChats.map((c) =>
      c.memoType === memoType && c.memoId === memoId
        ? { ...c, participants: c.participants.filter((p) => p.personId !== personId) }
        : c
    );
    setMemoChats(updatedChats);
  };

  // Project Chat Utilities
  const getOrCreateProjectChat = (projectId: string): ProjectChat => {
    let chat = projectChats.find((c) => c.projectId === projectId);
    if (!chat) {
      const project = projects.find((p) => p.id === projectId);
      if (!project) {
        return { projectId, participants: [], messages: [] };
      }
      chat = {
        projectId,
        participants: [],
        messages: [],
      };
      setProjectChats([...projectChats, chat]);
    }
    return chat;
  };

  const getProjectChatParticipants = (projectId: string): ProjectChatParticipant[] => {
    // First check if there's a demo project chat for this projectId
    const demoChat = demoProjectChats.find((c) => c.projectId === projectId);
    if (demoChat && demoChat.participants.length > 0) {
      return demoChat.participants;
    }

    // Then check projectChats
    const chat = projectChats.find((c) => c.projectId === projectId);
    if (chat && chat.participants.length > 0) {
      return chat.participants;
    }

    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];

    const participants: ProjectChatParticipant[] = [];
    const addedPersonIds = new Set<string>();

    // 1. Person memoを置いた人を取得
    project.placedItems.forEach((item) => {
      if (item.type === 'person') {
        const person = personMemos.find((p) => p.id === item.memoId);
        if (person && !addedPersonIds.has(person.id)) {
          participants.push({
            personId: person.id,
            name: person.name,
            role: 'person_memo',
            reason: `${person.name}として参加（置かれた人メモ）`,
          });
          addedPersonIds.add(person.id);
        }
      }
    });

    // 2. アイデアを書いた人を取得
    project.placedItems.forEach((item) => {
      if (item.type === 'idea' || item.type === 'ip') {
        const authorName = item.author;
        const person = personMemos.find((p) => p.name === authorName);
        if (person && !addedPersonIds.has(person.id)) {
          participants.push({
            personId: person.id,
            name: person.name,
            role: 'idea_author',
            reason: `${person.name}として参加（アイデア/企画の著者）`,
          });
          addedPersonIds.add(person.id);
        }
      }
    });

    // 3. Company memoを置いた人を取得
    project.placedItems.forEach((item) => {
      if (item.type === 'company') {
        const company = companyMemos.find((c) => c.id === item.memoId);
        if (company) {
          const authorName = item.author;
          const person = personMemos.find((p) => p.name === authorName);
          if (person && !addedPersonIds.has(person.id)) {
            participants.push({
              personId: person.id,
              name: person.name,
              role: 'company_introducer',
              reason: `${person.name}として参加（${company.name}の紹介者）`,
            });
            addedPersonIds.add(person.id);
          }
        }
      }
    });

    return participants;
  };

  const addProjectMessage = (projectId: string, author: string, content: string) => {
    const newMessage: ProjectMessage = {
      id: `pmsg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      author,
      content,
      timestamp: new Date(),
    };

    const updatedChats = projectChats.map((chat) => {
      if (chat.projectId === projectId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });

    // If chat doesn't exist, create it
    if (!updatedChats.some((c) => c.projectId === projectId)) {
      const participants = getProjectChatParticipants(projectId);
      updatedChats.push({
        projectId,
        participants,
        messages: [newMessage],
      });
    }

    setProjectChats(updatedChats);
  };

  const getProjectMessages = (projectId: string): ProjectMessage[] => {
    // First check if there's a demo project chat for this projectId
    const demoChat = demoProjectChats.find((c) => c.projectId === projectId);
    if (demoChat && demoChat.messages.length > 0) {
      return demoChat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    // Then check projectChats
    const chat = projectChats.find((c) => c.projectId === projectId);
    if (!chat) return [];
    return chat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const addProjectChatParticipant = (projectId: string, participant: ProjectChatParticipant) => {
    const updatedChats = projectChats.map((chat) => {
      if (chat.projectId === projectId) {
        // Check if participant already exists
        const exists = chat.participants.find((p) => p.personId === participant.personId);
        if (!exists) {
          return { ...chat, participants: [...chat.participants, participant] };
        }
      }
      return chat;
    });
    setProjectChats(updatedChats);
  };

  const removeProjectChatParticipant = (projectId: string, personId: string) => {
    const updatedChats = projectChats.map((chat) => {
      if (chat.projectId === projectId) {
        return { ...chat, participants: chat.participants.filter((p) => p.personId !== personId) };
      }
      return chat;
    });
    setProjectChats(updatedChats);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: demoCurrentUser,
        projects,
        setProjects,
        ipAssets,
        setIpAssets,
        personMemos,
        setPersonMemos,
        companyMemos,
        setCompanyMemos,
        messages,
        setMessages,
        projectChats,
        setProjectChats,
        memoChats,
        setMemoChats,
        addMessage,
        deleteMessage,
        getMessagesForMemo,
        getOrCreateMemoChat,
        addMemoChatParticipant,
        getMemoChatParticipants,
        removeMemoChatParticipant,
        getOrCreateProjectChat,
        addProjectMessage,
        getProjectMessages,
        getProjectChatParticipants,
        addProjectChatParticipant,
        removeProjectChatParticipant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
