import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Video, WatchSession } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateCoins: (amount: number) => void;
  getUserVideos: () => Video[];
  getAllVideos: () => Video[];
  addVideo: (video: Omit<Video, 'id' | 'uploadedAt' | 'views' | 'likes' | 'subscribes'>) => void;
  addWatchSession: (session: Omit<WatchSession, 'id' | 'createdAt'>) => void;
  getWatchSession: (videoId: string) => WatchSession | null;
  updateVideoStats: (videoId: string, type: 'view' | 'like' | 'subscribe') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchSessions, setWatchSessions] = useState<WatchSession[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    const savedVideos = localStorage.getItem('videos');
    const savedWatchSessions = localStorage.getItem('watchSessions');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedVideos) setVideos(JSON.parse(savedVideos));
    if (savedWatchSessions) setWatchSessions(JSON.parse(savedWatchSessions));
  }, []);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('videos', JSON.stringify(videos));
    localStorage.setItem('watchSessions', JSON.stringify(watchSessions));
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }, [users, videos, watchSessions, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      coins: 50, // Starting coins
      createdAt: new Date(),
      hasFreePlatform: true
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateCoins = (amount: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, coins: user.coins + amount };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const getUserVideos = (): Video[] => {
    if (!user) return [];
    return videos.filter(v => v.userId === user.id);
  };

  const getAllVideos = (): Video[] => {
    if (!user) return [];
    return videos.filter(v => v.userId !== user.id);
  };

  const addVideo = (video: Omit<Video, 'id' | 'uploadedAt' | 'views' | 'likes' | 'subscribes'>) => {
    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
      uploadedAt: new Date(),
      views: 0,
      likes: 0,
      subscribes: 0
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const addWatchSession = (session: Omit<WatchSession, 'id' | 'createdAt'>) => {
    const newSession: WatchSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setWatchSessions(prev => [...prev, newSession]);
  };

  const getWatchSession = (videoId: string): WatchSession | null => {
    if (!user) return null;
    return watchSessions.find(s => s.userId === user.id && s.videoId === videoId) || null;
  };

  const updateVideoStats = (videoId: string, type: 'view' | 'like' | 'subscribe') => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          [type === 'view' ? 'views' : type === 'like' ? 'likes' : 'subscribes']: 
            v[type === 'view' ? 'views' : type === 'like' ? 'likes' : 'subscribes'] + 1
        };
      }
      return v;
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateCoins,
      getUserVideos,
      getAllVideos,
      addVideo,
      addWatchSession,
      getWatchSession,
      updateVideoStats
    }}>
      {children}
    </AuthContext.Provider>
  );
}