import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import type { EventProject, IpAssetMaster, PersonMemo, CompanyMemo, Message } from '../types';
import { demoProjects } from '../data/demoProjects';
import { ipAssetMasters as initialIpAssets } from '../data/masterData';
import { masterPersonData } from '../data/masterPersonData';
import { masterCompanyData } from '../data/masterCompanyData';

const PROJECTS_STORAGE_KEY = 'mbs_app_data_projects';
const ASSETS_STORAGE_KEY = 'mbs_app_assets';
const PERSON_MEMOS_STORAGE_KEY = 'mbs_app_person_memos';
const COMPANY_MEMOS_STORAGE_KEY = 'mbs_app_company_memos';
const MESSAGES_STORAGE_KEY = 'mbs_app_messages';

interface AppContextType {
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
  // Message utilities
  addMessage: (memoType: 'person' | 'company', memoId: string, author: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  getMessagesForMemo: (memoType: 'person' | 'company', memoId: string) => Message[];
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

  // Messages State
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedData = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (!savedData) return [];
      const parsed = JSON.parse(savedData);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

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

  return (
    <AppContext.Provider
      value={{
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
        addMessage,
        deleteMessage,
        getMessagesForMemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
