// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/MyPractice.jsx
// PURPOSE: Session history as emotional memory, not analytics
// PHILOSOPHY: "Reinforce effort, not outcomes"
// ═══════════════════════════════════════════════════════════════
//
// Session history answers:
// - What did I work on?
// - What kind of effort did I show?
//
// NOT:
// - How did I score?
// - How do I compare?
// - What are my weaknesses?
//
// ═══════════════════════════════════════════════════════════════

import { useAuth } from '../../lib/AuthContext.jsx';
import React from 'react';
import { 
  BookOpen,
  Calculator,
  PenLine,
  FileText,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';
import { 
  getAgeBand, 
  getPracticeLanguage,
  getEffortCue,
  getCapabilityCue
} from '../../lib/scholarCopy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const MOCK_SCHOLAR = {
  name: 'Emma',
  yearLevel: 5
};

const MOCK_SESSIONS = [
  {
    id: 1,
    date: '2026-01-25',
    domains: ['Numeracy'],
    topics: ['Fractions', 'Decimals'],
    duration: 15,
    effortSignal: 'persisted',
    capabilitySignal: 'handled_harder'
  },
  {
    id: 2,
    date: '2026-01-24',
    domains: ['Reading'],
    topics: ['Main Ideas', 'Inference'],
    duration: 12,
    effortSignal: 'focused',
    capabilitySignal: 'consistent'
  },
  {
    id: 3,
    date: '2026-01-23',
    domains: ['Numeracy'],
    topics: ['Word Problems'],
    duration: 18,
    effortSignal: 'tried_hard',
    capabilitySignal: 'fewer_hints'
  },
  {
    id: 4,
    date: '2026-01-22',
    domains: ['Writing'],
    topics: ['Persuasive Techniques'],
    duration: 14,
    effortSignal: 'improved',
    capabilitySignal: 'improving'
  },
  {
    id: 5,
    date: '2026-01-21',
    domains: ['Grammar'],
    topics: ['Punctuation'],
    duration: 10,
    effortSignal: 'steady',
    capabilitySignal: 'consistent'
  }
];

// ═══════════════════════════════════════════════════════════════
// DOMAIN VISUALS
// ═══════════════════════════════════════════════════════════════

const domainConfig = {
  Numeracy: { 
    icon: Calculator, 
    bg: 'bg-indigo-100', 
    text: 'text-indigo-600',
    gradient: 'from-indigo-400 to-purple-500'
  },
  Reading: { 
    icon: BookOpen, 
    bg: 'bg-emerald-100', 
    text: 'text-emerald-600',
    gradient: 'from-violet-400 to-purple-500'
  },
  Writing: { 
    icon: PenLine, 
    bg: 'bg-amber-100', 
    text: 'text-amber-600',
    gradient: 'from-amber-400 to-orange-500'
  },
  Grammar: { 
    icon: FileText, 
    bg: 'bg-rose-100', 
    text: 'text-rose-600',
    gradient: 'from-rose-400 to-pink-500'
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const MyPractice = ({ scholar = MOCK_SCHOLAR, sessions = MOCK_SESSIONS }) => {
  const { isDemo } = useAuth();
  const ageBand = getAgeBand(scholar.yearLevel);
  const language = getPracticeLanguage(ageBand);
  
  // Limit sessions based on age
  const visibleSessions = sessions.slice(0, language.maxSessions);
  
  // Simple stats for older scholars
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Format date based on age
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return ageBand === 'early' ? 'Today!' : 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HEADER - Warm, not analytical */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <header className="mb-8">
          <h1 className={cn(
            "font-bold text-slate-800",
            ageBand === 'early' ? "text-2xl" : "text-xl"
          )}>
            {language.pageTitle}
          </h1>
          
          {/* Simple stats for older scholars */}
          {ageBand !== 'early' && totalSessions > 0 && (
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span>{totalSessions} sessions</span>
              <span>·</span>
              <span>{totalMinutes} minutes total</span>
            </div>
          )}
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SESSIONS - Effort-focused, not outcome-focused */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {visibleSessions.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{language.emptyState}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleSessions.map((session) => {
              const domain = session.domains[0];
              const config = domainConfig[domain] || domainConfig.Numeracy;
              const Icon = config.icon;
              const effortCue = language.showEffort 
                ? getEffortCue(ageBand, session.effortSignal) 
                : null;
              const capabilityCue = language.showCapability 
                ? getCapabilityCue(ageBand, session.capabilitySignal) 
                : null;

              return (
                <div 
                  key={session.id}
                  className={cn(
                    "rounded-2xl border transition-all",
                    ageBand === 'early' 
                      ? "bg-white border-slate-100 p-5"
                      : "bg-white border-slate-200 p-4"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Domain Icon */}
                    <div className={cn(
                      "flex-shrink-0 rounded-xl flex items-center justify-center",
                      ageBand === 'early' ? "w-12 h-12" : "w-10 h-10",
                      config.bg
                    )}>
                      <Icon className={cn(
                        ageBand === 'early' ? "w-6 h-6" : "w-5 h-5",
                        config.text
                      )} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Topics */}
                      <p className={cn(
                        "font-medium text-slate-800",
                        ageBand === 'early' ? "text-lg" : "text-base"
                      )}>
                        {language.sessionPrefix && `${language.sessionPrefix} `}
                        {session.topics.join(' and ')}
                      </p>
                      
                      {/* Date + Duration */}
                      <p className="text-sm text-slate-400 mt-0.5">
                        {formatDate(session.date)}
                        {ageBand !== 'early' && ` · ${session.duration} mins`}
                      </p>
                      
                      {/* Effort Cue - For middle ages */}
                      {effortCue && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Heart className="w-3.5 h-3.5 text-purple-400" />
                          <p className="text-sm text-slate-600">{effortCue}</p>
                        </div>
                      )}
                      
                      {/* Capability Cue - For Y7+ */}
                      {capabilityCue && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <p className="text-sm text-slate-500">{capabilityCue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* REASSURANCE FOR YOUNGER SCHOLARS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {ageBand === 'early' && visibleSessions.length > 0 && (
          <div className="mt-8 p-5 bg-purple-50 rounded-2xl text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-700 font-medium">
              You're learning new things every time you practise!
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NO ANALYTICS - The absence is intentional */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
      </div>
    </div>
  );
};

export default MyPractice;
