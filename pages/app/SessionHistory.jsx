// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/SessionHistory.jsx
// PURPOSE: Session history with real data + empty states
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { Clock, HelpCircle, Lightbulb, Users, Info } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';
import { getDemoSessionsForScholar } from '../../lib/demoData.js';

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-indigo-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">No Scholars Yet</h2>
    <p className="text-slate-500 max-w-sm">
      Add a scholar to start tracking their session history.
    </p>
  </div>
);

const NoSessionsYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Clock className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      No sessions yet
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      When {childName} completes practice sessions, they'll appear here with detailed summaries.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Sessions are saved automatically</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// DATA HELPERS
// ═══════════════════════════════════════════════════════════════

const getSessionsForChild = (selectedChild, isDemo) => {
  if (!selectedChild) return [];
  
  if (isDemo) {
    const scholarId = selectedChild.name === 'Emma' ? 'demo-scholar-001' : 
                      selectedChild.name === 'Oliver' ? 'demo-scholar-002' : 
                      'demo-scholar-001';
    const sessions = getDemoSessionsForScholar(scholarId) || [];
    
    // Enrich with display data
    return sessions.map((s) => ({
      id: s.id,
      date: formatSessionDate(s.date),
      domain: getDomainDisplay(s.domain),
      domainBg: getDomainBg(s.domain),
      domainText: getDomainText(s.domain),
      icon: getDomainIcon(s.domain),
      duration: s.duration,
      title: `Practising ${s.capability.toLowerCase()}`,
      summary: `Completed a guided ${s.domain} session focusing on ${s.capability.toLowerCase()}. Achieved ${s.accuracy}% accuracy.`,
      questions: Math.floor(s.duration * 0.6),
      hints: s.confidence === 'high' ? 0 : s.confidence === 'moderate' ? 1 : 2
    }));
  }
  
  return [];
};

const formatSessionDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' });
};

const getDomainDisplay = (domain) => {
  const map = {
    'numeracy': 'Numeracy',
    'reading': 'Reading',
    'writing': 'Writing',
    'grammar': 'Grammar & Punctuation'
  };
  return map[domain] || domain;
};

const getDomainBg = (domain) => {
  const map = {
    'numeracy': 'bg-indigo-100',
    'reading': 'bg-emerald-100',
    'writing': 'bg-amber-100',
    'grammar': 'bg-rose-100'
  };
  return map[domain] || 'bg-slate-100';
};

const getDomainText = (domain) => {
  const map = {
    'numeracy': 'text-indigo-700',
    'reading': 'text-emerald-700',
    'writing': 'text-amber-700',
    'grammar': 'text-rose-700'
  };
  return map[domain] || 'text-slate-700';
};

const getDomainIcon = (domain) => {
  const map = {
    'numeracy': '🔢',
    'reading': '📖',
    'writing': '✏️',
    'grammar': '📝'
  };
  return map[domain] || '📚';
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const describeBehaviors = (session) => {
  let behaviors = [];
  if (session.hints > 1) {
    behaviors.push(`using ${session.hints} hints to think through tricky questions`);
  } else if (session.hints === 1) {
    behaviors.push("using a hint on a tricky question");
  } else {
    behaviors.push("working independently without hints");
  }
  return behaviors.join(', ');
};

const generateNarrative = (session, childName) => {
  const behaviors = describeBehaviors(session);
  const pronoun = childName === 'Emma' ? 'She' : 'He';
  return `${childName} spent ${session.duration} minutes on a guided ${session.domain.toLowerCase()} session. ${pronoun} focused on ${session.title.toLowerCase()}, ${behaviors}.`;
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const SessionHistory = ({ selectedChild, setSelectedChild, childrenList = [] }) => {
  const { isDemo } = useAuth();

  // No scholars
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Session History</h1>
            <p className="text-slate-500">Review past practice sessions</p>
          </header>
          <NoScholarsYet />
        </div>
      </div>
    );
  }

  // Get sessions
  const sessions = getSessionsForChild(selectedChild, isDemo);
  const hasData = sessions.length > 0;

  // No sessions yet
  if (!hasData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Session History</h1>
              <p className="text-slate-500">{selectedChild.name}'s practice sessions</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoSessionsYet childName={selectedChild.name} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Session History</h1>
            <p className="text-slate-500">{selectedChild.name}'s practice sessions</p>
          </div>
          {childrenList.length > 1 && (
            <ChildDropdown 
              children={childrenList}
              selectedChild={selectedChild}
              onSelect={setSelectedChild}
            />
          )}
        </header>

        {/* Sessions List */}
        <div className="space-y-6">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              {/* Session Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{session.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-800">{session.date}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${session.domainBg} ${session.domainText}`}>
                      {session.domain}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {session.duration} mins
                </div>
              </div>

              {/* Session Body */}
              <div className="px-6 py-4">
                <p className="text-slate-600 mb-4">
                  {generateNarrative(session, selectedChild.name)}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{session.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-600">
                      {session.hints === 0 ? 'No hints used' : `${session.hints} hint${session.hints > 1 ? 's' : ''} used`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 mt-6">
          <p className="text-xs text-slate-400">
            Showing {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SessionHistory;