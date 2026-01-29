// ═══════════════════════════════════════════════════════════════
// FILE: App.jsx
// PURPOSE: Main app routing with role-based experience
// PHILOSOPHY: Parents get analysis. Scholars get identity reinforcement.
// NOW: Connected to real data via AuthContext
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import Sidebar from './components/app/Sidebar.jsx';
import { useAuth } from './lib/AuthContext.jsx';
import { DEMO_SCHOLAR_VIEW } from './lib/demoData.js';

// Parent pages
import Dashboard from './pages/app/Dashboard.jsx';
import TopicStrengths from './pages/app/TopicStrengths.jsx';
import Settings from './pages/app/Settings.jsx';
import Reports from './pages/app/Reports.jsx';
import ConfidenceTracking from './pages/app/ConfidenceTracking.jsx';
import Writing from './pages/app/Writing.jsx'; // Parent view

// Scholar pages - Radically calm
import ScholarHome from './pages/app/ScholarHome.jsx';
import ScholarWriting from './pages/app/ScholarWriting.jsx'; // Scholar view
import SessionComplete from './pages/app/SessionComplete.jsx';
import FirstSessionWelcome from './pages/app/FirstSessionWelcome.jsx';

// Legacy (keeping for transition)
import LearningPlan from './pages/app/LearningPlan.jsx';
import SessionHistory from './pages/app/SessionHistory.jsx';

const App = ({ onNavigate, userType, setUserType, selectedScholar }) => {
  const { scholars, isDemo } = useAuth();

  // Convert scholars from AuthContext to format expected by pages
  // Demo mode: uses demo scholars from AuthContext
  // Real mode: uses real scholars from Firestore via AuthContext
  const childrenList = scholars.map(s => ({
    id: s.id,
    name: s.name,
    year_level: s.yearLevel,
    avatar_color: s.avatarColor || 'bg-indigo-500',
    login_code: s.loginCode
  }));

  // Build scholar object for scholar view
  const buildScholarData = () => {
    // If a specific scholar was selected from ProfileSelectPage
    if (selectedScholar) {
      return {
        id: selectedScholar.id,
        name: selectedScholar.name,
        yearLevel: selectedScholar.yearLevel || selectedScholar.year_level,
        streak: isDemo ? 4 : 0,
        todaysFocus: isDemo ? ['Fractions', 'Reading'] : [],
        sessionReady: true,
        isFirstSession: !isDemo
      };
    }
    
    // Demo mode fallback
    if (isDemo) {
      return DEMO_SCHOLAR_VIEW;
    }
    
    // Real mode: use first scholar if available
    if (scholars.length > 0) {
      const s = scholars[0];
      return {
        id: s.id,
        name: s.name,
        yearLevel: s.yearLevel,
        streak: 0,
        todaysFocus: [],
        sessionReady: true,
        isFirstSession: true
      };
    }
    
    // No scholars yet
    return {
      id: 'new',
      name: 'Scholar',
      yearLevel: 5,
      streak: 0,
      todaysFocus: [],
      sessionReady: true,
      isFirstSession: true
    };
  };

  // Set default screen based on user type and first session status
  const getDefaultScreen = () => {
    if (userType === 'scholar') {
      const scholarData = buildScholarData();
      return scholarData.isFirstSession ? 'first_session_welcome' : 'scholar_home';
    }
    return 'dashboard';
  };

  const [activeScreen, setActiveScreen] = useState(getDefaultScreen());
  const [selectedChild, setSelectedChild] = useState(childrenList[0] || null);
  const [scholar, setScholar] = useState(buildScholarData());

  // Update selectedChild when scholars load
  useEffect(() => {
    if (childrenList.length > 0 && !selectedChild) {
      setSelectedChild(childrenList[0]);
    } else if (childrenList.length > 0 && selectedChild) {
      // Keep selected child in sync with updated list
      const updated = childrenList.find(c => c.id === selectedChild.id);
      if (updated) setSelectedChild(updated);
    }
  }, [scholars]);

  // Update scholar data when selectedScholar or scholars change
  useEffect(() => {
    setScholar(buildScholarData());
  }, [selectedScholar, scholars, isDemo]);

  // Reset to appropriate default when user type changes
  useEffect(() => {
    setActiveScreen(getDefaultScreen());
    setScholar(buildScholarData());
  }, [userType]);

  const handleNavigate = (screen) => {
    if (['login', 'profile_select'].includes(screen)) {
      onNavigate(screen);
    } else {
      setActiveScreen(screen);
    }
  };

  // Handle session start (scholar)
  const handleStartSession = () => {
    setActiveScreen('session_complete');
  };

  // Handle bonus session start
  const handleStartBonus = () => {
    console.log('Bonus session started');
  };

  // Handle session complete (scholar)
  const handleSessionComplete = () => {
    setActiveScreen('scholar_home');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      // ═══════════════════════════════════════════════════════════════
      // PARENT SCREENS - Analysis & Insights
      // ═══════════════════════════════════════════════════════════════
      case 'dashboard':
        return (
          <Dashboard 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
            onNavigate={handleNavigate} 
          />
        );
      case 'reports':
        return (
          <Reports 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );
      case 'topic_strengths':
        return (
          <TopicStrengths 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );
      case 'confidence':
        return (
          <ConfidenceTracking 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );
      case 'settings':
        return <Settings />;
      case 'session_history':
        return (
          <SessionHistory 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );

      // ═══════════════════════════════════════════════════════════════
      // SCHOLAR SCREENS - Identity Reinforcement
      // ═══════════════════════════════════════════════════════════════
      case 'first_session_welcome':
        return (
          <FirstSessionWelcome 
            scholarName={scholar.name}
            yearLevel={scholar.yearLevel}
            onComplete={() => {
              setScholar(prev => ({ ...prev, isFirstSession: false }));
              setActiveScreen('session_complete');
            }}
          />
        );
      case 'scholar_home':
        return (
          <ScholarHome 
            scholar={scholar} 
            onStartSession={handleStartSession} 
          />
        );
      case 'session_complete':
        return (
          <SessionComplete 
            session={{
              scholarName: scholar.name,
              yearLevel: scholar.yearLevel,
              duration: 25,
              focusAreas: scholar.todaysFocus,
              effortSignal: 'persisted',
              bonusAvailable: true,
              bonusUsed: false
            }}
            onComplete={handleSessionComplete}
            onStartBonus={handleStartBonus}
          />
        );
      
      // Writing - Different views for parent vs scholar
      case 'writing':
        if (userType === 'scholar') {
          return (
            <ScholarWriting 
              scholar={scholar}
              onNavigateHome={() => setActiveScreen('scholar_home')}
            />
          );
        }
        return (
          <Writing 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );

      // Writing Review - Parent view only
      case 'writing_review':
        return (
          <Writing 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
          />
        );

      // ═══════════════════════════════════════════════════════════════
      // LEGACY
      // ═══════════════════════════════════════════════════════════════
      case 'learning_plan':
        return (
          <LearningPlan 
            selectedChild={selectedChild} 
            setSelectedChild={setSelectedChild}
            childrenList={childrenList}
            onNavigate={handleNavigate} 
          />
        );

      default:
        return userType === 'scholar' 
          ? <ScholarHome scholar={scholar} onStartSession={handleStartSession} />
          : <Dashboard selectedChild={selectedChild} setSelectedChild={setSelectedChild} childrenList={childrenList} onNavigate={handleNavigate} />;
    }
  };

  // Full-screen experiences (no sidebar)
  const fullScreenPages = ['session_complete', 'first_session_welcome'];
  if (fullScreenPages.includes(activeScreen)) {
    return (
      <div className="font-sans antialiased">
        {renderScreen()}
      </div>
    );
  }

  return (
    <div className="font-sans antialiased">
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={handleNavigate} 
        userType={userType} 
        setUserType={setUserType}
      />
      <div className="ml-64">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;