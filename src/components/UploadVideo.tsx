import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { extractYouTubeVideoId } from '../utils/youtube';

export default function UploadVideo() {
  const { user, addVideo, updateCoins } = useAuth();
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        setError('Please enter a valid YouTube URL');
        setLoading(false);
        return;
      }

      if (!title.trim()) {
        setError('Please enter a video title');
        setLoading(false);
        return;
      }

      // Check if user has free upload or enough coins
      if (!user.hasFreePlatform && user.coins < 5) {
        setError('You need at least 5 coins to upload a video');
        setLoading(false);
        return;
      }

      // Add video
      addVideo({
        userId: user.id,
        title: title.trim(),
        youtubeUrl,
        videoId
      });

      // Deduct coins if not free upload
      if (!user.hasFreePlatform) {
        updateCoins(-5);
      } else {
        // Use free upload
        const updatedUser = { ...user, hasFreePlatform: false };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Video</h1>
            <p className="text-gray-600">Share your YouTube video and get it promoted</p>
          </div>

          {/* Upload Cost Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Upload Cost</p>
                <p className="text-sm text-gray-600">
                  {user.hasFreePlatform ? 'Free upload available!' : '5 coins per video'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">
                  {user.hasFreePlatform ? 'FREE' : '-5 coins'}
                </p>
                <p className="text-sm text-gray-600">Your balance: {user.coins} coins</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your video"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!user.hasFreePlatform && user.coins < 5)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Tips for Success:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use an engaging and descriptive title</li>
              <li>• Make sure your video is public on YouTube</li>
              <li>• Videos with good content get more engagement</li>
              <li>• Promote your video across social media</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}