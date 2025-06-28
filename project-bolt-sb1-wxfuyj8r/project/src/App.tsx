import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DecisionFramework from './components/DecisionFramework';
import CareerAssessment from './components/CareerAssessment';
import ValuesExplorer from './components/ValuesExplorer';
import GoalTracker from './components/GoalTracker';
import MentorPlatform from './components/MentorPlatform';
import ResourceLibrary from './components/ResourceLibrary';
import CareerRoadmap from './components/CareerRoadmap';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Settings/SettingsPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      setActiveSection('decisions');
    } else {
      setShowAuth(true);
      setAuthMode('signup');
    }
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setActiveSection('profile');
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setActiveSection('settings');
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setActiveSection('home');
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    setActiveSection('home');
  };

  const renderActiveSection = () => {
    // Show profile page
    if (showProfile && user) {
      return <ProfilePage onClose={handleCloseProfile} />;
    }

    // Show settings page
    if (showSettings && user) {
      return <SettingsPage onClose={handleCloseSettings} />;
    }

    // Redirect to login if not authenticated and trying to access protected routes
    if (!user && ['decisions', 'career', 'values', 'goals', 'mentors'].includes(activeSection)) {
      return <Hero onGetStarted={handleGetStarted} />;
    }

    switch (activeSection) {
      case 'home':
        return <Hero onGetStarted={handleGetStarted} />;
      case 'decisions':
        return <DecisionFramework />;
      case 'career':
        return <CareerAssessment />;
      case 'values':
        return <ValuesExplorer />;
      case 'goals':
        return <GoalTracker />;
      case 'mentors':
        return <MentorPlatform />;
      case 'resources':
        return <ResourceLibrary />;
      case 'roadmap':
        return <CareerRoadmap />;
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  // Show auth pages
  if (showAuth) {
    if (authMode === 'login') {
      return (
        <LoginPage 
          onSwitchToSignup={switchToSignup}
          onClose={handleAuthClose}
        />
      );
    } else {
      return (
        <SignupPage 
          onSwitchToLogin={switchToLogin}
          onClose={handleAuthClose}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onShowAuth={() => setShowAuth(true)}
        onSetAuthMode={setAuthMode}
        onShowProfile={handleShowProfile}
        onShowSettings={handleShowSettings}
      />
      <main>
        {renderActiveSection()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;