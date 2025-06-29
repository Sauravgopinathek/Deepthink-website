import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Edit3,
  Camera,
  User,
  CreditCard,
  Shield as ShieldIcon,
  FileText,
  HelpCircle,
  Database,
  Zap,
  Clock,
  BarChart3,
  Target,
  Users,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'appearance' | 'data'>('account');
  const [settings, setSettings] = useState(user?.preferences || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      if (user) {
        updateUser({ preferences: settings });
        setHasChanges(false);
        showSuccessMessage('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      if (user) {
        updateUser(profileForm);
        setIsEditingProfile(false);
        showSuccessMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      showErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(user?.preferences || {});
    setHasChanges(false);
    showSuccessMessage('Settings reset to default values.');
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorMessage('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      showSuccessMessage('Password changed successfully!');
    } catch (error) {
      showErrorMessage('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const setup2FA = async () => {
    setShow2FASetup(true);
    setTimeout(() => {
      setShow2FASetup(false);
      showSuccessMessage('Two-factor authentication has been enabled!');
    }, 3000);
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      // Get all data from localStorage
      const goals = localStorage.getItem('deepthink_goals');
      const completedGoals = localStorage.getItem('deepthink_completed_goals');
      const archivedGoals = localStorage.getItem('deepthink_archived_goals');
      const goalHistory = localStorage.getItem('deepthink_goal_history');
      const decisions = localStorage.getItem('deepthink_decisions');
      
      const data = {
        profile: user,
        settings: settings,
        goals: goals ? JSON.parse(goals) : [],
        completedGoals: completedGoals ? JSON.parse(completedGoals) : [],
        archivedGoals: archivedGoals ? JSON.parse(archivedGoals) : [],
        goalHistory: goalHistory ? JSON.parse(goalHistory) : [],
        decisions: decisions ? JSON.parse(decisions)  : [],
        exportDate: new Date().toISOString(),
        version: '2.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `deepthink-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccessMessage('Complete data backup exported successfully!');
    } catch (error) {
      showErrorMessage('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.profile && data.settings) {
        // Import profile and settings
        updateUser(data.profile);
        setSettings(data.settings);
        setHasChanges(true);
        
        // Import goals data
        if (data.goals) localStorage.setItem('deepthink_goals', JSON.stringify(data.goals));
        if (data.completedGoals) localStorage.setItem('deepthink_completed_goals', JSON.stringify(data.completedGoals));
        if (data.archivedGoals) localStorage.setItem('deepthink_archived_goals', JSON.stringify(data.archivedGoals));
        if (data.goalHistory) localStorage.setItem('deepthink_goal_history', JSON.stringify(data.goalHistory));
        if (data.decisions) localStorage.setItem('deepthink_decisions', JSON.stringify(data.decisions));
        
        setShowImportModal(false);
        showSuccessMessage('Complete data backup imported successfully! Please refresh the page to see all changes.');
      } else {
        showErrorMessage('Invalid backup file format. Please check your file.');
      }
    } catch (error) {
      showErrorMessage('Failed to import data. Please check your file format.');
    }
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear ALL your data? This action cannot be undone.')) {
      try {
        // Clear all localStorage data
        localStorage.removeItem('deepthink_goals');
        localStorage.removeItem('deepthink_completed_goals');
        localStorage.removeItem('deepthink_archived_goals');
        localStorage.removeItem('deepthink_goal_history');
        localStorage.removeItem('deepthink_decisions');
        
        showSuccessMessage('All data cleared successfully! Please refresh the page.');
      } catch (error) {
        showErrorMessage('Failed to clear data. Please try again.');
      }
    }
  };

  const deleteAccount = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccessMessage('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteConfirm(false);
    } catch (error) {
      showErrorMessage('Failed to delete account. Please try again.');
    }
  };

  const showSuccessMessage = (message: string) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg';
    successDiv.innerHTML = `✅ ${message}`;
    document.body.appendChild(successDiv);
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  };

  const showErrorMessage = (message: string) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg';
    errorDiv.innerHTML = `❌ ${message}`;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Found</h2>
          <p className="text-gray-600">Please log in to access settings.</p>
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
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <button
                  onClick={resetSettings}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Reset to defaults"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={saveSettings}
                disabled={!hasChanges || isSaving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  hasChanges && !isSaving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>
                      
                      {isEditingProfile ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                value={profileForm.location}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="City, Country"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                              rows={3}
                              placeholder="Tell us about yourself..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                              value={profileForm.timezone}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="UTC">UTC</option>
                              <option value="America/New_York">Eastern Time</option>
                              <option value="America/Chicago">Central Time</option>
                              <option value="America/Denver">Mountain Time</option>
                              <option value="America/Los_Angeles">Pacific Time</option>
                              <option value="Europe/London">London</option>
                              <option value="Europe/Paris">Paris</option>
                              <option value="Asia/Tokyo">Tokyo</option>
                              <option value="Asia/Shanghai">Shanghai</option>
                              <option value="Australia/Sydney">Sydney</option>
                            </select>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={saveProfile}
                              disabled={isSaving}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingProfile(false);
                                setProfileForm({
                                  name: user.name || '',
                                  bio: user.bio || '',
                                  location: user.location || '',
                                  timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
                                });
                              }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Name</label>
                              <p className="text-gray-900">{user.name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Email</label>
                              <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Location</label>
                              <p className="text-gray-900">{user.location || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Timezone</label>
                              <p className="text-gray-900">{user.timezone || 'UTC'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-500">Bio</label>
                              <p className="text-gray-900">{user.bio || 'No bio added yet.'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Security Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <button 
                          onClick={() => setShowChangePassword(true)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Lock className="h-5 w-5 text-gray-400" />
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Change Password</div>
                              <div className="text-sm text-gray-600">Update your account password</div>
                            </div>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                        </button>
                        
                        <button 
                          onClick={setup2FA}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <ShieldIcon className="h-5 w-5 text-gray-400" />
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                              <div className="text-sm text-gray-600">Add an extra layer of security</div>
                            </div>
                          </div>
                          <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Not enabled</span>
                        </button>
                      </div>
                    </div>

                    {/* Subscription Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Current Plan</div>
                            <div className="text-sm text-gray-600 capitalize">{user.subscription} Plan</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {user.subscription === 'free' ? 'Free' : '$9.99/month'}
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              {user.subscription === 'free' ? 'Upgrade' : 'Manage'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'email', label: 'Email notifications', description: 'Receive notifications via email' },
                          { key: 'goalReminders', label: 'Goal reminders', description: 'Get reminded about your goals and deadlines' },
                          { key: 'mentorUpdates', label: 'Mentor updates', description: 'Notifications about mentor sessions and messages' },
                          { key: 'weeklyDigest', label: 'Weekly digest', description: 'Weekly summary of your progress and insights' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications?.[item.key] || false}
                                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'push', label: 'Browser notifications', description: 'Receive push notifications in your browser' },
                          { key: 'sms', label: 'SMS notifications', description: 'Receive important updates via SMS' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications?.[item.key] || false}
                                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'profileVisible', label: 'Public profile', description: 'Make your profile visible to other users' },
                          { key: 'showLocation', label: 'Show location', description: 'Display your location on your profile' },
                          { key: 'allowMentorRequests', label: 'Allow mentor requests', description: 'Let others send you mentorship requests' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Eye className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy?.[item.key] || false}
                                onChange={(e) => updateSetting('privacy', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
                          { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
                          { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follow system' }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => updateSetting('appearance', 'theme', theme.value)}
                            className={`p-4 border-2 rounded-lg transition-all ${
                              settings.appearance?.theme === theme.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <theme.icon className={`h-8 w-8 mx-auto mb-2 ${
                              settings.appearance?.theme === theme.value ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <div className="font-medium text-gray-900">{theme.label}</div>
                            <div className="text-sm text-gray-600">{theme.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                      <select
                        value={settings.appearance?.language || 'en'}
                        onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                  
                  <div className="space-y-6">
                    {/* Data Overview */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Data Overview</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Target className="h-6 w-6 text-blue-600" />
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                {JSON.parse(localStorage.getItem('deepthink_goals') || '[]').length}
                              </div>
                              <div className="text-sm text-blue-800">Active Goals</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                              <div className="text-lg font-bold text-green-600">
                                {JSON.parse(localStorage.getItem('deepthink_completed_goals') || '[]').length}
                              </div>
                              <div className="text-sm text-green-800">Completed Goals</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                            <div>
                              <div className="text-lg font-bold text-purple-600">
                                {JSON.parse(localStorage.getItem('deepthink_decisions') || '[]').length}
                              </div>
                              <div className="text-sm text-purple-800">Decisions Made</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export/Import */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Restore</h3>
                      <div className="space-y-4">
                        <button
                          onClick={exportData}
                          disabled={isExporting}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <div className="flex items-center space-x-3">
                            <Download className="h-5 w-5 text-gray-400" />
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Export All Data</div>
                              <div className="text-sm text-gray-600">Download complete backup of your data</div>
                            </div>
                          </div>
                          {isExporting ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                          )}
                        </button>
                        
                        <button 
                          onClick={() => setShowImportModal(true)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Upload className="h-5 w-5 text-gray-400" />
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Import Data</div>
                              <div className="text-sm text-gray-600">Restore data from backup file</div>
                            </div>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                        </button>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <button
                          onClick={clearAllData}
                          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                        >
                          <div className="flex items-center space-x-3">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <div className="text-left">
                              <div className="font-medium text-red-900">Clear All Data</div>
                              <div className="text-sm text-red-700">Permanently delete all your goals, decisions, and history</div>
                            </div>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-red-400 rotate-180" />
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-red-900">Delete Account</div>
                            <div className="text-sm text-red-700 mt-1">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </div>
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowChangePassword(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Setting up Two-Factor Authentication</h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Configuring your 2FA settings...</p>
            </div>
          </div>
        </div>
      )}

      {/* Import Data Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
            <div className="space-y-4">
              <p className="text-gray-600">Select a JSON backup file to restore your data.</p>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportData(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Warning:</strong> This will overwrite your current data. Make sure to export a backup first.
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;