import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import type { EventProject, IpAssetMaster } from '../types';
import { demoProjects } from '../data/demoProjects';
import { ipAssetMasters as initialIpAssets } from '../data/masterData';

const PROJECTS_STORAGE_KEY = 'mbs_app_data_projects';
const ASSETS_STORAGE_KEY = 'mbs_app_assets';

interface AppContextType {
  projects: EventProject[];
  setProjects: Dispatch<SetStateAction<EventProject[]>>;
  ipAssets: IpAssetMaster[];
  setIpAssets: Dispatch<SetStateAction<IpAssetMaster[]>>;
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

  return (
    <AppContext.Provider value={{ projects, setProjects, ipAssets, setIpAssets }}>
      {children}
    </AppContext.Provider>
  );
};
