export interface User {
  id: string;
  email: string;
  username: string;
  coins: number;
  createdAt: Date;
  hasFreePlatform: boolean;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  uploadedAt: Date;
  views: number;
  likes: number;
  subscribes: number;
}

export interface WatchSession {
  id: string;
  userId: string;
  videoId: string;
  watchTime: number;
  hasLiked: boolean;
  hasSubscribed: boolean;
  coinsEarned: number;
  createdAt: Date;
}