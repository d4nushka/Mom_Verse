import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CryAnalyzer from './components/CryAnalyzer';
import SymptomChecker from './components/SymptomChecker';
import FeedingTracker from './components/FeedingTracker';
import WellnessChat from './components/WellnessChat';
import Auth from './components/Auth';
import MomCare from './components/MomCare';
import Journal from './components/Journal';
import { ViewState, User } from './types';
import { getCurrentUser } from './services/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={setCurrentView} user={currentUser!} onLogout={handleLogout} />;
      case 'cry-analyzer':
        return <CryAnalyzer />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'feeding':
        return <FeedingTracker />;
      case 'chat':
        return <WellnessChat />;
      case 'mom-care':
        return <MomCare />;
      case 'journal':
        return <Journal />;
      default:
        return <Dashboard setView={setCurrentView} user={currentUser!} onLogout={handleLogout} />;
    }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen bg-rose-50 flex items-center justify-center">
              <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
          </div>
      )
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-rose-50 text-slate-900 font-sans selection:bg-rose-200 selection:text-rose-900">
      <main className="pb-20">
        {renderView()}
      </main>
      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;