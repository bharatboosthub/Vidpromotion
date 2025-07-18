import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Play, Coins, Video, Eye, Heart, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const { user, getUserVideos } = useAuth();
  const navigate = useNavigate();
  const userVideos = getUserVideos();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-600">Manage your videos and earn coins by engaging with content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Coins</p>
                <p className="text-2xl font-bold text-blue-600">{user.coins}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Videos Uploaded</p>
                <p className="text-2xl font-bold text-green-600">{userVideos.length}</p>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{userVideos.reduce((sum, v) => sum + v.views, 0)}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Free Upload</p>
                <p className="text-2xl font-bold text-orange-600">{user.hasFreePlatform ? '1' : '0'}</p>
              </div>
              <Upload className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Upload Video</h2>
              <p className="text-gray-600 mb-6">Share your YouTube video and get it promoted by other users</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Upload Video
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Watch & Earn</h2>
              <p className="text-gray-600 mb-6">Watch videos from other users and earn coins for engagement</p>
              <button
                onClick={() => navigate('/watch')}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Watching
              </button>
            </div>
          </div>
        </div>

        {/* Coin System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Coin System</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Watch 3 minutes</p>
              <p className="font-semibold text-blue-600">+5 coins</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Like video</p>
              <p className="font-semibold text-red-600">+10 coins</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <UserPlus className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Subscribe</p>
              <p className="font-semibold text-green-600">+15 coins</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Upload className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload video</p>
              <p className="font-semibold text-orange-600">-5 coins</p>
            </div>
          </div>
        </div>

        {/* My Videos */}
        {userVideos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">My Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                    <span>{video.subscribes} subs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}