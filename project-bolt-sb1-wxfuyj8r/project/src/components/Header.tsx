import React from 'react';
import { Brain, Menu, X, Sparkles, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onShowAuth: () => void;
  onSetAuthMode: (mode: 'login' | 'signup') => void;
  onShowProfile?: () => void;
  onShowSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  onSectionChange, 
  onShowAuth, 
  onSetAuthMode,
  onShowProfile,
  onShowSettings
}) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { id: 'home', label: 'Home', icon: '🏠', public: true },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️', public: true },
    { id: 'decisions', label: 'Decisions', icon: '🎯', public: false },
    { id: 'career', label: 'Assessment', icon: '📊', public: false },
    { id: 'values', label: 'Values', icon: '💎', public: false },
    { id: 'goals', label: 'Goals', icon: '🚀', public: false },
    { id: 'mentors', label: 'Mentors', icon: '👥', public: false },
    { id: 'resources', label: 'Resources', icon: '📚', public: true }
  ];

  const handleNavClick = (sectionId: string, isPublic: boolean) => {
    if (!isPublic && !user) {
      onShowAuth();
      onSetAuthMode('login');
      return;
    }
    onSectionChange(sectionId);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onSectionChange('home');
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (onShowProfile) {
      onShowProfile();
    }
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    if (onShowSettings) {
      onShowSettings();
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-none">
          {/* Logo - positioned on the far left */}
          <motion.div 
            className="flex items-center space-x-3 group cursor-pointer flex-shrink-0" 
            onClick={() => onSectionChange('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DeepThink
              </h1>
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
          </motion.div>

          {/* Desktop Navigation - centered with proper spacing */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.public)}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg group whitespace-nowrap ${
                    activeSection === item.id
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  } ${!item.public && !user ? 'opacity-75' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-base group-hover:animate-bounce">{item.icon}</span>
                    <span>{item.label}</span>
                    {!item.public && !user && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Pro</span>
                    )}
                  </span>
                  {activeSection === item.id && (
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                      layoutId="activeIndicator"
                      initial={false}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </nav>

          {/* User Menu / Auth Buttons - positioned on the far right */}
          <div className="flex items-center flex-shrink-0">
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button 
                        onClick={handleSettingsClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => {
                    onShowAuth();
                    onSetAuthMode('login');
                  }}
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => {
                    onShowAuth();
                    onSetAuthMode('signup');
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 ml-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col space-y-1">
                {navigation.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.public)}
                    className={`px-4 py-3 text-left text-sm font-medium transition-all duration-300 rounded-lg flex items-center space-x-3 ${
                      activeSection === item.id
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    } ${!item.public && !user ? 'opacity-75' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span 
                      className="text-lg"
                      animate={{ rotate: activeSection === item.id ? 360 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="flex-1">{item.label}</span>
                    {!item.public && !user && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pro</span>
                    )}
                  </motion.button>
                ))}
                
                {/* Mobile Auth Buttons */}
                {!user && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <motion.button
                      onClick={() => {
                        onShowAuth();
                        onSetAuthMode('login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.05 }}
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onShowAuth();
                        onSetAuthMode('signup');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 1) * 0.05 }}
                    >
                      Get Started
                    </motion.button>
                  </div>
                )}

                {/* Mobile User Menu */}
                {user && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <img
                        src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => {
                        handleProfileClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 1) * 0.05 }}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleSettingsClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 2) * 0.05 }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 3) * 0.05 }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;