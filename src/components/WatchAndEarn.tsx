import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, UserPlus, Clock, Coins, RefreshCw } from 'lucide-react';

export default function WatchAndEarn() {
  const { user, getAllVideos, addWatchSession, getWatchSession, updateCoins, updateVideoStats } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState(() => getAllVideos());
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  useEffect(() => {
    if (currentVideo) {
      const session = getWatchSession(currentVideo.id);
      if (session) {
        setWatchTime(session.watchTime);
        setHasLiked(session.hasLiked);
        setHasSubscribed(session.hasSubscribed);
      }
    }
  }, [currentVideo, getWatchSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentVideo) {
      interval = setInterval(() => {
        setWatchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentVideo]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleVideoSelect = (video: any) => {
    setCurrentVideo(video);
    setWatchTime(0);
    setHasLiked(false);
    setHasSubscribed(false);
    updateVideoStats(video.id, 'view');
  };

  const handleLike = () => {
    if (!hasLiked && currentVideo) {
      setHasLiked(true);
      updateCoins(10);
      updateVideoStats(currentVideo.id, 'like');
      
      addWatchSession({
        userId: user.id,
        videoId: currentVideo.id,
        watchTime,
        hasLiked: true,
        hasSubscribed,
        coinsEarned: 10
      });
    }
  };

  const handleSubscribe = () => {
    if (!hasSubscribed && currentVideo) {
      setHasSubscribed(true);
      updateCoins(15);
      updateVideoStats(currentVideo.id, 'subscribe');
      
      addWatchSession({
        userId: user.id,
        videoId: currentVideo.id,
        watchTime,
        hasLiked,
        hasSubscribed: true,
        coinsEarned: 15
      });
    }
  };

  const handleWatchComplete = () => {
    if (currentVideo && watchTime >= 180 && !watchedVideos.includes(currentVideo.id)) {
      setWatchedVideos(prev => [...prev, currentVideo.id]);
      updateCoins(5);
      
      addWatchSession({
        userId: user.id,
        videoId: currentVideo.id,
        watchTime,
        hasLiked,
        hasSubscribed,
        coinsEarned: 5
      });
    }
  };

  const refreshVideos = () => {
    setVideos(getAllVideos());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Watch & Earn</h1>
            <p className="text-gray-600">Watch videos from other users and earn coins</p>
          </div>
          <button
            onClick={refreshVideos}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Videos Available</h3>
            <p className="text-gray-500">No videos to watch right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Available Videos</h3>
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        currentVideo?.id === video.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{video.views} views</span>
                        <span>{video.likes} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="lg:col-span-2">
              {currentVideo ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="aspect-video mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                      title={currentVideo.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>

                  <h2 className="text-xl font-bold mb-4">{currentVideo.title}</h2>

                  {/* Watch Progress */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Watch Progress</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((watchTime / 180) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {watchTime >= 180 ? 'Completed!' : `${Math.max(0, 180 - watchTime)}s remaining for reward`}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={handleLike}
                      disabled={hasLiked}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        hasLiked
                          ? 'bg-red-100 text-red-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transform hover:scale-105'
                      }`}
                    >
                      <Heart className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} />
                      <span>{hasLiked ? 'Liked!' : 'Like'}</span>
                      <Coins className="w-4 h-4" />
                      <span>10</span>
                    </button>

                    <button
                      onClick={handleSubscribe}
                      disabled={hasSubscribed}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        hasSubscribed
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transform hover:scale-105'
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>{hasSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
                      <Coins className="w-4 h-4" />
                      <span>15</span>
                    </button>

                    <button
                      onClick={handleWatchComplete}
                      disabled={watchTime < 180 || watchedVideos.includes(currentVideo.id)}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        watchTime >= 180 && !watchedVideos.includes(currentVideo.id)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                      <span>
                        {watchedVideos.includes(currentVideo.id) ? 'Watched!' : 'Watch 3min'}
                      </span>
                      <Coins className="w-4 h-4" />
                      <span>5</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Video</h3>
                  <p className="text-gray-500">Choose a video from the list to start watching and earning coins</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}