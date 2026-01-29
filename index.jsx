import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './lib/AuthContext.jsx';

// Page Components
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import MembershipPage from './pages/auth/MembershipPage.jsx';
import ProfileSelectPage from './pages/auth/ProfileSelectPage.jsx';
import ScholarLoginPage from './pages/auth/ScholarLoginPage.jsx';

// Main App Shell
import MainApp from './App.jsx';

const AppRouter = () => {
  const [route, setRoute] = useState('landing');
  const [userType, setUserType] = useState('parent');
  const [selectedScholar, setSelectedScholar] = useState(null);

  // Enhanced navigation that can receive scholar data
  const handleNavigate = (newRoute, { scholar, userType } = {}) => {
    if (scholar) {
      setSelectedScholar(scholar);
    }
    if (userType) {
      setUserType(userType);
    }
    setRoute(newRoute);
  };

  switch (route) {
    case 'login':
      return <LoginPage onNavigate={handleNavigate} setUserType={setUserType} />;
    case 'signup':
      return <SignupPage onNavigate={handleNavigate} />;
    case 'membership':
      return <MembershipPage onNavigate={handleNavigate} />;
    case 'scholar-login':
      return <ScholarLoginPage onNavigate={handleNavigate} />;
    case 'profile_select':
      return (
        <ProfileSelectPage 
          onNavigate={handleNavigate} 
          setUserType={setUserType}
          setSelectedScholar={setSelectedScholar}
        />
      );
    case 'app':
      return (
        <MainApp 
          onNavigate={handleNavigate} 
          userType={userType} 
          setUserType={setUserType}
          selectedScholar={selectedScholar}
        />
      );
    case 'scholar-home':
      return (
        <MainApp 
          onNavigate={handleNavigate} 
          userType="scholar" 
          setUserType={setUserType}
          selectedScholar={selectedScholar}
        />
      );
    case 'landing':
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
