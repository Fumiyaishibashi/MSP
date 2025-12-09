import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { EventProject, IpAssetMaster, PersonMemo, CompanyMemo, Message, ProjectMessage, ProjectChat, ProjectChatParticipant, MemoChat, MemoChatParticipant, Wish, WishComment, MatchGroup, BrainstormTeam, TeamCreationRequest, TeamMemberRecommendation, TeamMessage } from '../types';
import { demoProjects } from '../data/demoProjects';
import { ipAssetMasters as initialIpAssets } from '../data/masterData';
import { masterPersonData } from '../data/masterPersonData';
import { masterCompanyData } from '../data/masterCompanyData';
import { demoWishs } from '../data/demoWishs';
import { demoMatchGroups } from '../data/demoMatchGroups';
import { demoTeams } from '../data/demoTeams';
import { demoTeamMessages } from '../data/demoTeamMessages';

const PROJECTS_STORAGE_KEY = 'mbs_app_data_projects';
const ASSETS_STORAGE_KEY = 'mbs_app_assets';
const PERSON_MEMOS_STORAGE_KEY = 'mbs_app_person_memos';
const COMPANY_MEMOS_STORAGE_KEY = 'mbs_app_company_memos';
const MESSAGES_STORAGE_KEY = 'mbs_app_messages';
const PROJECT_CHATS_STORAGE_KEY = 'mbs_app_project_chats';
const MEMO_CHATS_STORAGE_KEY = 'mbs_app_memo_chats';
const WISHS_STORAGE_KEY = 'mbs_app_wishs';
const MATCH_GROUPS_STORAGE_KEY = 'mbs_app_match_groups';
const TEAMS_STORAGE_KEY = 'mbs_app_brainstorm_teams';
const TEAM_MESSAGES_STORAGE_KEY = 'mbs_app_team_messages';

// デモ用ログインユーザー
const demoCurrentUser: PersonMemo = {
  id: 'person_suzuki',
  name: '鈴木太郎',
  department: 'グッズ制作部',
  company: 'mbs_goods',
  yearsOfService: 8,
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
  // Wish utilities (Brainstorm Board)
  wishs: Wish[];
  setWishs: Dispatch<SetStateAction<Wish[]>>;
  addWish: (wish: Wish) => void;
  updateWish: (wishId: string, updatedWish: Wish) => void;
  deleteWish: (wishId: string) => void;
  addWishComment: (wishId: string, authorId: string, authorName: string, content: string) => void;
  deleteWishComment: (wishId: string, commentId: string) => void;
  getWishComments: (wishId: string) => WishComment[];
  // Matching utilities (Brainstorm Matching)
  matchGroups: MatchGroup[];
  setMatchGroups: Dispatch<SetStateAction<MatchGroup[]>>;
  generateMatchGroups: (wishes: Wish[]) => MatchGroup[];
  createMatchGroupFromProximity: (wish1Id: string, wish2Id: string) => void;
  addWishToMatchGroup: (wishId: string, groupId: string) => void;
  // Team utilities (Brainstorm Team - Phase 3)
  teams: BrainstormTeam[];
  setTeams: Dispatch<SetStateAction<BrainstormTeam[]>>;
  getRecommendedTeamMembers: (matchGroupId: string) => TeamMemberRecommendation[];
  createTeamFromMatchGroup: (request: TeamCreationRequest) => BrainstormTeam;
  deleteTeam: (teamId: string) => void;
  updateTeam: (teamId: string, updates: Partial<BrainstormTeam>) => void;
  // Team Chat utilities
  teamMessages: TeamMessage[];
  setTeamMessages: Dispatch<SetStateAction<TeamMessage[]>>;
  addTeamMessage: (teamId: string, author: string, content: string) => void;
  getTeamMessages: (teamId: string) => TeamMessage[];
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

  // Wishes State (Brainstorm Board)
  const [wishs, setWishs] = useState<Wish[]>(() => {
    try {
      const savedData = localStorage.getItem(WISHS_STORAGE_KEY);
      if (!savedData) return demoWishs;
      const parsed = JSON.parse(savedData);
      // Convert timestamp strings back to Date objects
      return parsed.map((wish: any) => ({
        ...wish,
        createdAt: new Date(wish.createdAt),
        comments: wish.comments?.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
        })) || [],
      }));
    } catch (error) {
      console.error("Failed to parse wishs from localStorage", error);
      return demoWishs;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHS_STORAGE_KEY, JSON.stringify(wishs));
    } catch (error) {
      console.error("Failed to save wishs to localStorage", error);
    }
  }, [wishs]);

  // Match Groups State (Brainstorm Matching)
  const [matchGroups, setMatchGroups] = useState<MatchGroup[]>(() => {
    try {
      const savedData = localStorage.getItem(MATCH_GROUPS_STORAGE_KEY);
      if (!savedData) return demoMatchGroups; // デモデータを使用
      const parsed = JSON.parse(savedData);
      return parsed.map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt),
      }));
    } catch (error) {
      console.error("Failed to parse matchGroups from localStorage", error);
      return demoMatchGroups; // エラー時もデモデータを使用
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MATCH_GROUPS_STORAGE_KEY, JSON.stringify(matchGroups));
    } catch (error) {
      console.error("Failed to save matchGroups to localStorage", error);
    }
  }, [matchGroups]);

  // Teams State (Brainstorm Team - Phase 3)
  const [teams, setTeams] = useState<BrainstormTeam[]>(() => {
    try {
      const savedData = localStorage.getItem(TEAMS_STORAGE_KEY);
      if (!savedData) return demoTeams; // デモデータを初期値として使用
      const parsed = JSON.parse(savedData);
      return parsed.map((team: any) => ({
        ...team,
        createdAt: new Date(team.createdAt),
      }));
    } catch (error) {
      console.error("Failed to parse teams from localStorage", error);
      return demoTeams; // エラー時もデモデータを返す
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    } catch (error) {
      console.error("Failed to save teams to localStorage", error);
    }
  }, [teams]);

  // Team Messages State
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>(() => {
    try {
      const savedData = localStorage.getItem(TEAM_MESSAGES_STORAGE_KEY);
      if (!savedData) return demoTeamMessages; // デモデータを初期値として使用
      const parsed = JSON.parse(savedData);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error("Failed to parse teamMessages from localStorage", error);
      return demoTeamMessages; // エラー時もデモデータを返す
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEAM_MESSAGES_STORAGE_KEY, JSON.stringify(teamMessages));
    } catch (error) {
      console.error("Failed to save teamMessages to localStorage", error);
    }
  }, [teamMessages]);

  // 自動キーワードマッチング無効化 - 物理的近接マッチングのみ使用
  // Generate match groups on app initialization
  // useEffect(() => {
  //   if (matchGroups.length === 0 && wishs.length > 0) {
  //     const initialGroups = generateMatchGroups(wishs);
  //     setMatchGroups(initialGroups);
  //   }
  // }, []);

  // 自動位置調整無効化 - ユーザーが手動で配置
  // マッチグループが生成された後に、願いの位置を自動調整
  // useEffect(() => {
  //   if (matchGroups.length > 0 && wishs.length > 0) {
  //     // デモなので常に願いを整理する
  //     const rearrangedWishs = arrangeWishsByGroups(wishs, matchGroups);
  //     setWishs(rearrangedWishs);
  //   }
  // }, [matchGroups]);

  // 自動位置調整無効化 - ユーザーが手動で配置
  // マッチグループに基づいて願いの位置を自動調整
  // const arrangeWishsByGroups = (wishes: Wish[], groups: MatchGroup[]): Wish[] => {
  //   const groupMap = new Map<string, number>(); // wish_id -> group_index

  //   // 最初の8個の wish をデモ用（左上綺麗配置）として扱う
  //   const demoWishIdSet = new Set(wishes.slice(0, 8).map((w) => w.id));
  //   // 残りの wish は散らばせる
  //   const scatterWishIdSet = new Set(wishes.slice(8).map((w) => w.id));

  //   // マップを構築: どの願いがどのグループに属しているか
  //   groups.forEach((group, groupIndex) => {
  //     group.wishs.forEach((wishId) => {
  //       groupMap.set(wishId, groupIndex);
  //     });
  //   });

  //   // グループを分類
  //   const demoGroupIndices = new Set<number>();
  //   const scatterGroupIndices = new Set<number>();

  //   groups.forEach((group, groupIndex) => {
  //     const hasDemoWish = group.wishs.some((id) => demoWishIdSet.has(id));
  //     const hasScatterWish = group.wishs.some((id) => scatterWishIdSet.has(id));

  //     if (hasDemoWish) {
  //       demoGroupIndices.add(groupIndex);
  //     }
  //     if (hasScatterWish) {
  //       scatterGroupIndices.add(groupIndex);
  //     }
  //   });

  //   // ========== メモサイズを考慮した配置計算 ==========
  //   const avgMemoWidth = 270;
  //   const avgMemoHeight = 180;
  //   const memoMargin = 40;
  //   const minSpacingX = avgMemoWidth + memoMargin;    // 310px
  //   const minSpacingY = avgMemoHeight + memoMargin;   // 220px

  //   const groupPositions: { x: number; y: number }[] = [];

  //   // ========== デモグループ: 左上に綺麗に配置 ==========
  //   const demoGroupArray = Array.from(demoGroupIndices);
  //   const demoGroupStartX = 150;
  //   const demoGroupStartY = 200;
  //   const demoGroupVerticalSpacing = 700;

  //   demoGroupArray.forEach((groupIndex, idx) => {
  //     groupPositions[groupIndex] = {
  //       x: demoGroupStartX,
  //       y: demoGroupStartY + idx * demoGroupVerticalSpacing,
  //     };
  //   });

  //   // ========== 散らばせグループ: キャンバス全体に散らばせ ==========
  //   // スクリーン全体を使用（2000x1600 の広いキャンバスを想定）
  //   const scatterGroupArray = Array.from(scatterGroupIndices);
  //   const canvasWidth = 2000;
  //   const canvasHeight = 1600;

  //   scatterGroupArray.forEach((groupIndex, idx) => {
  //     // 散らばせの位置計算（ランダム寄りだが、グリッド的に配置）
  //     const gridCols = Math.ceil(Math.sqrt(scatterGroupArray.length));
  //     const gridRows = Math.ceil(scatterGroupArray.length / gridCols);

  //     const row = Math.floor(idx / gridCols);
  //     const col = idx % gridCols;

  //     // グループの基本位置
  //     const baseX = (canvasWidth / gridCols) * col + 200;
  //     const baseY = (canvasHeight / gridRows) * row + 150;

  //     // 左上（デモグループ）のエリアを避ける
  //     const avoidMinX = 550;
  //     const avoidMinY = 950;

  //     // もし左上エリアと被ったら右にずらす
  //     const finalX = baseX < avoidMinX && baseY < avoidMinY ? baseX + 800 : baseX;
  //     const finalY = baseX < avoidMinX && baseY < avoidMinY ? baseY + 800 : baseY;

  //     groupPositions[groupIndex] = {
  //       x: Math.max(100, Math.min(canvasWidth - 500, finalX)),
  //       y: Math.max(100, Math.min(canvasHeight - 500, finalY)),
  //     };
  //   });

  //   // ========== 願いの位置を調整（メモサイズを考慮） ==========
  //   return wishes.map((wish) => {
  //     const groupIndex = groupMap.get(wish.id);

  //     if (groupIndex === undefined) {
  //       // グループに属さない願い（単独）は元の位置を保持
  //       return wish;
  //     }

  //     const groupPos = groupPositions[groupIndex];
  //     const wishIndexInGroup = groups[groupIndex].wishs.indexOf(wish.id);
  //     const wishCountInGroup = groups[groupIndex].wishs.length;

  //     // グループ内でのグリッド配置
  //     const isDemo = Array.from(demoGroupIndices).includes(groupIndex);
  //     const colsInGroup = isDemo
  //       ? Math.min(2, wishCountInGroup)
  //       : Math.max(1, Math.ceil(Math.sqrt(wishCountInGroup)));

  //     const row = Math.floor(wishIndexInGroup / colsInGroup);
  //     const col = wishIndexInGroup % colsInGroup;

  //     // グリッドセル内での配置
  //     const cellWidth = minSpacingX;
  //     const cellHeight = minSpacingY;
  //     const offsetX = col * cellWidth + (cellWidth - avgMemoWidth) / 2;
  //     const offsetY = row * cellHeight + (cellHeight - avgMemoHeight) / 2;

  //     return {
  //       ...wish,
  //       position: {
  //         x: Math.max(50, groupPos.x + offsetX),
  //         y: Math.max(50, groupPos.y + offsetY),
  //       },
  //     };
  //   });
  // };

  // Matching Algorithm
  const calculateMatchScore = (wish1: Wish, wish2: Wish): number => {
    const keywords1 = new Set(wish1.keywords);
    const keywords2 = new Set(wish2.keywords);

    let commonCount = 0;
    for (const keyword of keywords1) {
      if (keywords2.has(keyword)) {
        commonCount++;
      }
    }

    const minLength = Math.min(keywords1.size, keywords2.size);
    if (minLength === 0) return 0;

    const score = (commonCount / minLength) * 100;
    return score;
  };

  // Generate match groups from wishes using DFS for transitive relationships
  // ブレストは全部つながるわけじゃなく、浮いたメモもある
  const generateMatchGroups = (wishes: Wish[]): MatchGroup[] => {
    const groups: MatchGroup[] = [];
    const processed = new Set<string>();

    // Build adjacency graph of matching wishes (厳しい閾値: 50%以上)
    const graph = new Map<string, Set<string>>();

    for (let i = 0; i < wishes.length; i++) {
      graph.set(wishes[i].id, new Set());

      for (let j = i + 1; j < wishes.length; j++) {
        const score = calculateMatchScore(wishes[i], wishes[j]);
        // 50%以上のマッチスコアのみグループ化（浮いたメモが出やすくなる）
        if (score >= 50) {
          // Add bidirectional edges
          graph.get(wishes[i].id)!.add(wishes[j].id);
          if (!graph.has(wishes[j].id)) {
            graph.set(wishes[j].id, new Set());
          }
          graph.get(wishes[j].id)!.add(wishes[i].id);
        }
      }
    }

    // DFS to find connected components
    const dfs = (wishId: string, component: Set<string>) => {
      if (processed.has(wishId)) return;
      processed.add(wishId);
      component.add(wishId);

      const neighbors = graph.get(wishId) || new Set();
      for (const neighborId of neighbors) {
        if (!processed.has(neighborId)) {
          dfs(neighborId, component);
        }
      }
    };

    // Find all connected components
    for (const wish of wishes) {
      if (!processed.has(wish.id)) {
        const component = new Set<string>();
        dfs(wish.id, component);

        // Only create group if it has multiple wishes (単独の浮いたメモは無視)
        if (component.size > 1) {
          const groupWishIds = Array.from(component);
          const groupWishes = groupWishIds.map((id) => wishes.find((w) => w.id === id)!);

          // Calculate common keywords (keywords shared by all wishes in the group)
          const allKeywordSets = groupWishes.map((w) => new Set(w.keywords));
          const commonKeywords = new Set<string>();

          if (allKeywordSets.length > 0) {
            const firstKeywords = allKeywordSets[0];
            for (const keyword of firstKeywords) {
              if (allKeywordSets.every((set) => set.has(keyword))) {
                commonKeywords.add(keyword);
              }
            }
          }

          // デモアプリなので、50%以上でランダムにばらけさせる
          const randomScore = 50 + Math.random() * 50; // 50-100%のランダムスコア

          groups.push({
            id: `match_group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            wishs: groupWishIds,
            commonKeywords: Array.from(commonKeywords),
            matchScore: randomScore,
            createdAt: new Date(),
          });
        }
      }
    }

    return groups;
  };

  // Wish Utilities
  const addWish = (wish: Wish) => {
    const newWishs = [...wishs, wish];
    setWishs(newWishs);
    // 自動キーワードマッチング無効化 - 物理的近接マッチングのみ使用
    // const newMatchGroups = generateMatchGroups(newWishs);
    // setMatchGroups(newMatchGroups);
  };

  const updateWish = (wishId: string, updatedWish: Wish) => {
    setWishs(wishs.map((w) => (w.id === wishId ? updatedWish : w)));
  };

  const deleteWish = (wishId: string) => {
    const newWishs = wishs.filter((w) => w.id !== wishId);
    setWishs(newWishs);
    // 自動キーワードマッチング無効化 - 物理的近接マッチングのみ使用
    // const newMatchGroups = generateMatchGroups(newWishs);
    // setMatchGroups(newMatchGroups);
  };

  // 物理的近接性に基づくマッチング（手動でドラッグして近づけたメモをマッチ）
  const createMatchGroupFromProximity = (wish1Id: string, wish2Id: string) => {
    console.log('[createMatchGroupFromProximity] 呼び出し:', wish1Id, wish2Id);
    console.log('[createMatchGroupFromProximity] 現在のmatchGroups:', matchGroups);

    // 既に同じグループに属しているか確認
    const alreadyMatched = matchGroups.some(
      g => g.wishs.includes(wish1Id) && g.wishs.includes(wish2Id)
    );

    if (alreadyMatched) {
      console.log('[createMatchGroupFromProximity] Already matched:', wish1Id, wish2Id);
      return;
    }

    // 新しいマッチグループを作成
    const newGroup: MatchGroup = {
      id: `match_proximity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wishs: [wish1Id, wish2Id],
      commonKeywords: [], // 物理的マッチなので共通キーワードは計算しない
      matchScore: 100, // 物理的マッチは確実度100%
      createdAt: new Date(),
    };

    console.log('[createMatchGroupFromProximity] 新しいグループ作成:', newGroup);
    setMatchGroups([...matchGroups, newGroup]);
    console.log('[createMatchGroupFromProximity] setMatchGroups完了');
  };

  // 既存のマッチグループに願いを追加
  const addWishToMatchGroup = (wishId: string, groupId: string) => {
    console.log('[addWishToMatchGroup] 呼び出し:', wishId, groupId);

    // 既にこのグループに属しているか確認
    const group = matchGroups.find(g => g.id === groupId);
    if (!group) {
      console.log('[addWishToMatchGroup] グループが見つかりません:', groupId);
      return;
    }

    if (group.wishs.includes(wishId)) {
      console.log('[addWishToMatchGroup] 既にグループに含まれています:', wishId);
      return;
    }

    // 他のグループに属していないか確認
    const existingGroup = matchGroups.find(g => g.wishs.includes(wishId));
    if (existingGroup) {
      console.log('[addWishToMatchGroup] 他のグループに既に属しています:', existingGroup.id);
      // 既存グループから削除して、新しいグループに追加
      const updatedGroups = matchGroups.map(g => {
        if (g.id === existingGroup.id) {
          // 古いグループから削除
          return { ...g, wishs: g.wishs.filter(id => id !== wishId) };
        } else if (g.id === groupId) {
          // 新しいグループに追加
          return { ...g, wishs: [...g.wishs, wishId] };
        }
        return g;
      }).filter(g => g.wishs.length > 0); // 空になったグループは削除

      setMatchGroups(updatedGroups);
      console.log('[addWishToMatchGroup] グループ移動完了');
      return;
    }

    // グループに追加
    const updatedGroups = matchGroups.map(g =>
      g.id === groupId ? { ...g, wishs: [...g.wishs, wishId] } : g
    );

    setMatchGroups(updatedGroups);
    console.log('[addWishToMatchGroup] グループに追加完了');
  };

  // Wish Comment Utilities
  const addWishComment = (wishId: string, authorId: string, authorName: string, content: string) => {
    const newComment: WishComment = {
      id: `wish_comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wishId,
      authorId,
      authorName,
      content,
      timestamp: new Date(),
    };
    setWishs(
      wishs.map((w) =>
        w.id === wishId
          ? { ...w, comments: [...(w.comments || []), newComment] }
          : w
      )
    );
  };

  const deleteWishComment = (wishId: string, commentId: string) => {
    setWishs(
      wishs.map((w) =>
        w.id === wishId
          ? { ...w, comments: (w.comments || []).filter((c) => c.id !== commentId) }
          : w
      )
    );
  };

  const getWishComments = (wishId: string): WishComment[] => {
    const wish = wishs.find((w) => w.id === wishId);
    if (!wish || !wish.comments) return [];
    return wish.comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

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

  // Team Utilities (Brainstorm Team - Phase 3)
  const getRecommendedTeamMembers = (matchGroupId: string): TeamMemberRecommendation[] => {
    const matchGroup = matchGroups.find((g) => g.id === matchGroupId);
    if (!matchGroup) return [];

    const personRecommendations = new Map<string, {
      reasons: { type: 'wish_author' | 'wish_commenter' | 'expertise_match'; wishId: string; wishTitle: string; details: string }[];
      isWishAuthor: boolean;
    }>();

    // マッチグループ内の願いから全てのキーワードを収集
    const allKeywords = new Set<string>();
    matchGroup.wishs.forEach((wishId) => {
      const wish = wishs.find((w) => w.id === wishId);
      if (wish) {
        wish.keywords?.forEach((kw) => allKeywords.add(kw.toLowerCase()));
      }
    });

    // Collect reasons from wishes in match group
    matchGroup.wishs.forEach((wishId) => {
      const wish = wishs.find((w) => w.id === wishId);
      if (!wish) return;

      // Add wish author as recommendation
      const authorName = wish.author;
      const authorPerson = personMemos.find((p) => p.name === authorName);

      if (authorPerson) {
        if (!personRecommendations.has(authorPerson.id)) {
          personRecommendations.set(authorPerson.id, { reasons: [], isWishAuthor: false });
        }
        personRecommendations.get(authorPerson.id)!.reasons.push({
          type: 'wish_author',
          wishId: wish.id,
          wishTitle: wish.title,
          details: `願い「${wish.title}」の著者`,
        });
        personRecommendations.get(authorPerson.id)!.isWishAuthor = true;
      }

      // Add wish commenters as recommendations
      wish.comments?.forEach((comment) => {
        const commentPerson = personMemos.find((p) => p.id === comment.authorId);
        if (commentPerson) {
          if (!personRecommendations.has(commentPerson.id)) {
            personRecommendations.set(commentPerson.id, { reasons: [], isWishAuthor: false });
          }
          personRecommendations.get(commentPerson.id)!.reasons.push({
            type: 'wish_commenter',
            wishId: wish.id,
            wishTitle: wish.title,
            details: `「${wish.title}」にコメント`,
          });
        }
      });
    });

    // 専門知識に基づいた推奨メンバーを追加
    personMemos.forEach((person) => {
      // 既に願いの著者やコメント者として追加されている場合はスキップ
      if (personRecommendations.has(person.id)) return;

      // 専門知識がマッチグループのキーワードと一致する場合
      const matchingExpertise = person.expertise.filter((exp) =>
        Array.from(allKeywords).some((kw) =>
          exp.toLowerCase().includes(kw) || kw.includes(exp.toLowerCase())
        )
      );

      if (matchingExpertise.length > 0) {
        if (!personRecommendations.has(person.id)) {
          personRecommendations.set(person.id, { reasons: [], isWishAuthor: false });
        }
        personRecommendations.get(person.id)!.reasons.push({
          type: 'expertise_match',
          wishId: '',
          wishTitle: '',
          details: `専門知識: ${matchingExpertise.join(', ')}`,
        });
      }
    });

    // Convert to TeamMemberRecommendation array
    let recommendations = Array.from(personRecommendations.entries()).map(
      ([personId, data]) => {
        const person = personMemos.find((p) => p.id === personId);
        return {
          personId,
          name: person?.name || 'Unknown',
          department: person?.department || '',
          expertise: person?.expertise || [],
          yearsOfService: person?.yearsOfService || 0,
          recommendationReasons: data.reasons,
          isSelected: data.isWishAuthor, // 願いを書いた人のみ自動選択
        };
      }
    );

    // Fallback: 推奨メンバーが0人の場合、全員を表示（願いの著者がいなければ最初の3名を選択）
    if (recommendations.length === 0) {
      console.log('[getRecommendedTeamMembers] 推奨メンバーが0人のため、全員を表示します');
      recommendations = personMemos.map((person, index) => ({
        personId: person.id,
        name: person.name,
        department: person.department,
        expertise: person.expertise,
        yearsOfService: person.yearsOfService,
        recommendationReasons: [
          {
            type: 'wish_author' as const,
            wishId: matchGroup.wishs[0] || '',
            wishTitle: 'マッチグループ',
            details: '利用可能なメンバー',
          },
        ],
        isSelected: index < 3, // 最初の3名を自動選択
      }));
    }

    // Sort by: wish authors first (selected), then commenters, then expertise matches
    return recommendations.sort((a, b) => {
      const aAuthors = a.recommendationReasons.filter((r) => r.type === 'wish_author').length;
      const bAuthors = b.recommendationReasons.filter((r) => r.type === 'wish_author').length;

      // 願いの著者が最優先
      if (aAuthors !== bAuthors) return bAuthors - aAuthors;

      // 次にコメント者
      const aCommenters = a.recommendationReasons.filter((r) => r.type === 'wish_commenter').length;
      const bCommenters = b.recommendationReasons.filter((r) => r.type === 'wish_commenter').length;
      if (aCommenters !== bCommenters) return bCommenters - aCommenters;

      // 最後に専門知識マッチ
      return b.recommendationReasons.length - a.recommendationReasons.length;
    });
  };

  const createTeamFromMatchGroup = (request: TeamCreationRequest): BrainstormTeam => {
    const matchGroup = matchGroups.find((g) => g.id === request.matchGroupId);
    if (!matchGroup) throw new Error(`Match group ${request.matchGroupId} not found`);

    // デモアプリ用：ダミーデータ
    const dummyPersonData: { [key: string]: { name: string, yearsOfService: number } } = {
      'person_test': { name: '中村太一', yearsOfService: 5 },
      'person_kawamoto': { name: '川本由美', yearsOfService: 7 },
      'person_matsuda': { name: '松田誠', yearsOfService: 10 },
    };

    const teamMembers = request.selectedMemberIds.map((personId) => {
      const person = personMemos.find((p) => p.id === personId);
      const reasonsForPerson = request.recommendationReasons.find((r) => r.personId === personId);
      const reason = reasonsForPerson?.reason || 'Team member';

      // personMemos にあればそれを使う、なければダミーデータ
      if (person) {
        return {
          personId,
          name: person.name,
          reason,
          yearsOfService: person.yearsOfService,
        };
      } else if (dummyPersonData[personId]) {
        // デモアプリ：ダミーデータを使用
        return {
          personId,
          name: dummyPersonData[personId].name,
          reason,
          yearsOfService: dummyPersonData[personId].yearsOfService,
        };
      } else {
        throw new Error(`Person ${personId} not found`);
      }
    });

    const newTeam: BrainstormTeam = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: request.teamName,
      wishs: matchGroup.wishs,
      matchGroupId: request.matchGroupId,
      members: teamMembers,
      createdAt: new Date(),
    };

    setTeams([...teams, newTeam]);
    return newTeam;
  };

  const deleteTeam = (teamId: string) => {
    setTeams(teams.filter((t) => t.id !== teamId));
  };

  const updateTeam = (teamId: string, updates: Partial<BrainstormTeam>) => {
    setTeams(
      teams.map((t) =>
        t.id === teamId ? { ...t, ...updates } : t
      )
    );
  };

  // Team Chat Utilities
  const addTeamMessage = (teamId: string, author: string, content: string) => {
    const newMessage: TeamMessage = {
      id: `team_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId,
      author,
      content,
      timestamp: new Date(),
    };
    setTeamMessages([...teamMessages, newMessage]);
  };

  const getTeamMessages = (teamId: string): TeamMessage[] => {
    return teamMessages.filter((msg) => msg.teamId === teamId);
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
        wishs,
        setWishs,
        addWish,
        updateWish,
        deleteWish,
        addWishComment,
        deleteWishComment,
        getWishComments,
        matchGroups,
        setMatchGroups,
        generateMatchGroups,
        createMatchGroupFromProximity,
        addWishToMatchGroup,
        teams,
        setTeams,
        getRecommendedTeamMembers,
        createTeamFromMatchGroup,
        deleteTeam,
        updateTeam,
        teamMessages,
        setTeamMessages,
        addTeamMessage,
        getTeamMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
