import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Globe, 
  Clock,
  Award,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements'>('overview');

  const handleSave = () => {
    if (user) {
      updateUser(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const mockStats = {
    decisionsCompleted: 12,
    goalsAchieved: 8,
    mentorSessions: 5,
    assessmentsTaken: 3,
    resourcesViewed: 47,
    streakDays: 15
  };

  const mockAchievements = [
    { id: '1', title: 'Decision Master', description: 'Completed 10 decision frameworks', icon: Target, earned: true },
    { id: '2', title: 'Goal Crusher', description: 'Achieved 5 personal goals', icon: TrendingUp, earned: true },
    { id: '3', title: 'Mentor Seeker', description: 'Had 3 mentor sessions', icon: Users, earned: true },
    { id: '4', title: 'Knowledge Hunter', description: 'Read 25 resources', icon: BookOpen, earned: false },
    { id: '5', title: 'Consistency King', description: 'Maintain 30-day streak', icon: Calendar, earned: false }
  ];

  const mockActivity = [
    { id: '1', type: 'decision', title: 'Completed "Career Change Decision"', date: '2 days ago', icon: Target },
    { id: '2', type: 'goal', title: 'Updated goal progress: Learn Python', date: '3 days ago', icon: TrendingUp },
    { id: '3', type: 'mentor', title: 'Session with Sarah Chen', date: '1 week ago', icon: Users },
    { id: '4', type: 'assessment', title: 'Completed Career Assessment', date: '2 weeks ago', icon: User },
    { id: '5', type: 'resource', title: 'Read "Decision Matrix Framework"', date: '2 weeks ago', icon: BookOpen }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={editedUser.avatar || user.avatar}
                    alt={editedUser.name || user.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-gray-100"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="mt-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl font-semibold text-gray-900 text-center border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  )}
                  
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Add your location"
                        className="text-sm border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                      />
                    ) : (
                      <span className="text-sm">{user.location || 'Location not set'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{user.timezone || 'UTC'}</span>
                  </div>
                </div>

                <div className="mt-6">
                  {isEditing ? (
                    <textarea
                      value={editedUser.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {user.bio || 'No bio added yet. Click edit to add one!'}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {/* Subscription Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.subscription === 'premium' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscription === 'premium' ? '⭐ Premium' : '🆓 Free'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockStats.decisionsCompleted}</div>
                  <div className="text-xs text-gray-600">Decisions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockStats.goalsAchieved}</div>
                  <div className="text-xs text-gray-600">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockStats.mentorSessions}</div>
                  <div className="text-xs text-gray-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mockStats.streakDays}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'activity', label: 'Recent Activity', icon: Clock },
                    { id: 'achievements', label: 'Achievements', icon: Award }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{user.email}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {new Date(user.lastLoginAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subscription</label>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">
                            {user.subscription}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Target className="h-8 w-8 text-blue-600" />
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{mockStats.decisionsCompleted}</div>
                              <div className="text-sm text-blue-800">Decisions Completed</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <div>
                              <div className="text-2xl font-bold text-green-600">{mockStats.goalsAchieved}</div>
                              <div className="text-sm text-green-800">Goals Achieved</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-purple-600" />
                            <div>
                              <div className="text-2xl font-bold text-purple-600">{mockStats.mentorSessions}</div>
                              <div className="text-sm text-purple-800">Mentor Sessions</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <div className="space-y-3">
                      {mockActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="bg-white p-2 rounded-lg">
                            <activity.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-600">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mockAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 ${
                            achievement.earned
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <achievement.icon className={`h-5 w-5 ${
                                achievement.earned ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium ${
                                  achievement.earned ? 'text-green-900' : 'text-gray-700'
                                }`}>
                                  {achievement.title}
                                </h4>
                                {achievement.earned && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <p className={`text-sm ${
                                achievement.earned ? 'text-green-700' : 'text-gray-600'
                              }`}>
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;