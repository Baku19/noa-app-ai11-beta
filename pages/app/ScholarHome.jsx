// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/ScholarHome.jsx
// PURPOSE: The "Hi Emma. Ready?" moment
// PHILOSOPHY: One task. One moment. One feeling of capability.
// ═══════════════════════════════════════════════════════════════
//
// "Most education software reacts to answers. Noa listens to behaviour."
//
// This screen answers ONE question: "What am I doing today?"
// Nothing else. No history. No scores. No pressure.
//
// ═══════════════════════════════════════════════════════════════

import { useAuth } from '../../lib/AuthContext.jsx';
import React, { useState, useEffect } from 'react';
import { 
  Play,
  Sparkles,
  ChevronRight,
  Zap
  CheckCircle
} from 'lucide-react';
import { 
  getAgeBand, 
  getGreeting, 
  getSessionInvitation,
  getStreakLanguage 
} from '../../lib/scholarCopy.js';
import {
  getSessionConfig,
  getHomeDurationText
} from '../../lib/sessionConfig.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MOCK DATA (In production, comes from Noa's understanding)
// ═══════════════════════════════════════════════════════════════

const MOCK_SCHOLAR = {
  name: 'Emma',
  yearLevel: 5,
  streak: 4,
  todaysFocus: ['Fractions', 'Reading'],
  sessionReady: true,
};


// ═══════════════════════════════════════════════════════════════
// ALL DONE STATE - When no session is ready
// ═══════════════════════════════════════════════════════════════
const AllDoneState = ({ ageBand, onViewProgress }) => {
  const copy = {
    early: { headline: "Great work today! 🌟", subtext: "You've done all your practice.", button: "See what I learned" },
    middle: { headline: "All done for today!", subtext: "Your next session will be ready tomorrow.", button: "View my progress" },
    transition: { headline: "Session complete", subtext: "Come back tomorrow for more practice.", button: "View progress" },
    senior: { headline: "Done for today", subtext: "Next session available tomorrow.", button: "View progress" }
  };
  const c = copy[ageBand] || copy.middle;
  
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl p-8 text-center bg-white border-2 border-emerald-100">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className={cn("font-bold text-slate-800 mb-2", ageBand === 'early' ? "text-2xl" : "text-xl")}>{c.headline}</h2>
        <p className={cn("text-slate-500 mb-6", ageBand === 'early' ? "text-base" : "text-sm")}>{c.subtext}</p>
        {onViewProgress && (
          <button onClick={onViewProgress} className="px-6 py-3 rounded-xl font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">{c.button}</button>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const ScholarHome = ({ scholar = MOCK_SCHOLAR, onStartSession, onViewProgress }) => {
const { isDemo } = useAuth();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  // Determine age band for language adaptation
  const ageBand = getAgeBand(scholar.yearLevel);
  
  // Get session config for this age
  const sessionConfig = getSessionConfig(scholar.yearLevel);
  const durationText = getHomeDurationText(scholar.yearLevel);
  
  // Get age-appropriate copy
  const greeting = getGreeting(scholar.name, currentHour, ageBand);
  const invitation = getSessionInvitation(ageBand, scholar.todaysFocus);
  const streakText = getStreakLanguage(ageBand, scholar.streak);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* THE SPACE - Intentional emptiness creates calm */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        
        {/* Greeting - Warm, simple */}
        <div className="text-center mb-8">
          <h1 className={cn(
            "font-semibold text-slate-800",
            ageBand === 'early' ? "text-3xl" : 
            ageBand === 'middle' ? "text-2xl" : 
            "text-xl"
          )}>
            {greeting}
          </h1>
          
          {/* Streak - Subtle, not dopamine-driven */}
          {streakText && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">{streakText}</span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* THE INVITATION - One action, one moment */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {/* THE INVITATION - One action, one moment */}
        {!scholar.sessionReady ? (
        <AllDoneState ageBand={ageBand} onViewProgress={onViewProgress} />
        ) : (



        <div className="w-full max-w-sm">
          <div className={cn(
            "rounded-3xl p-8 text-center transition-all",
            "bg-white border-2 border-slate-100",
            "hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
          )}>
            
            {/* Session Icon */}
            <div className={cn(
              "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-indigo-500 to-purple-600",
              "shadow-lg shadow-indigo-500/30"
            )}>
              {ageBand === 'early' ? (
                <Sparkles className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </div>
            
            {/* Headline */}
            <h2 className={cn(
              "font-bold text-slate-800 mb-2",
              ageBand === 'early' ? "text-2xl" : "text-xl"
            )}>
              {invitation.headline}
            </h2>
            
            {/* Subtext (age-appropriate context) */}
            {invitation.subtext && (
              <p className={cn(
                "text-slate-500 mb-6",
                ageBand === 'early' ? "text-base" : "text-sm"
              )}>
                {invitation.subtext}
              </p>
            )}
            
            {/* Duration hint - only shown to older scholars */}
            {durationText && (
              <p className="text-xs text-slate-400 mb-6">
                {durationText}
              </p>
            )}
            
            {/* THE BUTTON - The only action */}
            <button
              onClick={onStartSession}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold transition-all",
                "bg-gradient-to-r from-indigo-600 to-purple-600",
                "text-white shadow-lg shadow-indigo-500/30",
                "hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]",
                "active:scale-[0.98]",
                ageBand === 'early' ? "text-xl" : "text-lg"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {invitation.button}
                <ChevronRight className={cn(
                  ageBand === 'early' ? "w-6 h-6" : "w-5 h-5"
                )} />
              </span>
            </button>
          </div>
        </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NOTHING ELSE - The absence is intentional */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
      </div>

      {/* Footer - Minimal, calm */}
      {ageBand !== 'early' && (
        <footer className="p-6 text-center">
          <p className="text-xs text-slate-400">
            {scholar.todaysFocus.join(' · ')}
          </p>
        </footer>
      )}
    </div>
  );
};

export default ScholarHome;
