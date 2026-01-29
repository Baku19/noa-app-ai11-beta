// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/FirstSessionWelcome.jsx
// PURPOSE: The first 30 seconds — making a lasting impression
// PHILOSOPHY: "The first session determines if this becomes a habit"
// ═══════════════════════════════════════════════════════════════
//
// Flow:
// 1. Meet Noa — "Hi! I'm Noa."
// 2. How it works — Simple bullets
// 3. Ready to start — Launch first session
//
// Age-adaptive language throughout.
//
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Sparkles,
  Clock,
  HelpCircle,
  Calendar,
  Star
} from 'lucide-react';
import { getAgeBand } from '../../lib/scholarCopy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// AGE-ADAPTIVE COPY
// ═══════════════════════════════════════════════════════════════

const WELCOME_COPY = {
  early: {
    // Screen 1: Meet Noa
    meetHeadline: "Hi! I'm Noa! 🦊",
    meetSubtext: "I'm here to help you learn and have fun!",
    meetButton: "Hi Noa!",
    
    // Screen 2: How it works
    howHeadline: "Here's how we play:",
    howPoints: [
      { icon: Sparkles, text: "I'll give you questions to try" },
      { icon: Clock, text: "Take your time — no rush!" },
      { icon: HelpCircle, text: "If you get stuck, I'll help" },
      { icon: Calendar, text: "We'll practise a little bit each day" },
    ],
    howButton: "Got it!",
    
    // Screen 3: Ready
    readyHeadline: "Ready to try?",
    readySubtext: "Don't worry — I'll make it easy!",
    readyButton: "Let's go! 🎉",
  },
  
  middle: {
    meetHeadline: "Hi, I'm Noa",
    meetSubtext: "I'm here to help you practise and grow.",
    meetButton: "Hey Noa",
    
    howHeadline: "Here's how we'll work together:",
    howPoints: [
      { icon: Sparkles, text: "I'll give you questions to practise" },
      { icon: Clock, text: "Take your time — there's no rush" },
      { icon: HelpCircle, text: "If you get stuck, I can help" },
      { icon: Calendar, text: "A little practice each day adds up" },
    ],
    howButton: "Got it",
    
    readyHeadline: "Ready for your first session?",
    readySubtext: "We'll start with something easy.",
    readyButton: "Let's go",
  },
  
  transition: {
    meetHeadline: "Hey. I'm Noa.",
    meetSubtext: "I'm here to help you build skills and prepare.",
    meetButton: "Continue",
    
    howHeadline: "How this works:",
    howPoints: [
      { icon: Sparkles, text: "Adaptive questions based on your level" },
      { icon: Clock, text: "Work at your own pace" },
      { icon: HelpCircle, text: "Hints available if needed" },
      { icon: Calendar, text: "Consistent practice builds results" },
    ],
    howButton: "Got it",
    
    readyHeadline: "Ready to start?",
    readySubtext: "First session is shorter — just to get started.",
    readyButton: "Start",
  },
  
  senior: {
    meetHeadline: "I'm Noa",
    meetSubtext: "Your learning companion for building skills.",
    meetButton: "Continue",
    
    howHeadline: "How it works:",
    howPoints: [
      { icon: Sparkles, text: "Questions adapt to your level" },
      { icon: Clock, text: "Your pace, your time" },
      { icon: HelpCircle, text: "Support when you need it" },
      { icon: Calendar, text: "Consistency over intensity" },
    ],
    howButton: "Continue",
    
    readyHeadline: "Ready?",
    readySubtext: "First session is a quick introduction.",
    readyButton: "Start",
  },
};

// ═══════════════════════════════════════════════════════════════
// SIMPLE NOA AVATAR (Placeholder until final design)
// ═══════════════════════════════════════════════════════════════

const NoaAvatar = ({ size = 120, className = '' }) => (
  <div 
    className={cn(
      "rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center",
      "shadow-lg shadow-violet-500/30",
      className
    )}
    style={{ width: size, height: size }}
  >
    <span style={{ fontSize: size * 0.5 }}>🦊</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SCREEN 1: MEET NOA
// ═══════════════════════════════════════════════════════════════

const MeetNoaScreen = ({ copy, ageBand, onNext }) => (
  <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-violet-50 to-white">
    <div className="text-center max-w-md">
      {/* Avatar */}
      <div className="mb-8">
        <NoaAvatar size={ageBand === 'early' ? 140 : 120} />
      </div>
      
      {/* Headline */}
      <h1 className={cn(
        "font-bold text-slate-800 mb-3",
        ageBand === 'early' ? "text-3xl" : "text-2xl"
      )}>
        {copy.meetHeadline}
      </h1>
      
      {/* Subtext */}
      <p className={cn(
        "text-slate-500 mb-10",
        ageBand === 'early' ? "text-lg" : "text-base"
      )}>
        {copy.meetSubtext}
      </p>
      
      {/* Button */}
      <button
        onClick={onNext}
        className={cn(
          "px-8 py-4 rounded-2xl font-semibold transition-all",
          "bg-violet-600 text-white",
          "hover:bg-violet-700 hover:scale-[1.02]",
          "active:scale-[0.98]",
          "shadow-lg shadow-violet-500/30",
          ageBand === 'early' ? "text-xl" : "text-lg"
        )}
      >
        {copy.meetButton}
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SCREEN 2: HOW IT WORKS
// ═══════════════════════════════════════════════════════════════

const HowItWorksScreen = ({ copy, ageBand, onNext }) => (
  <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-white to-violet-50">
    <div className="text-center max-w-md">
      {/* Small avatar */}
      <div className="mb-6">
        <NoaAvatar size={ageBand === 'early' ? 80 : 64} />
      </div>
      
      {/* Headline */}
      <h1 className={cn(
        "font-bold text-slate-800 mb-8",
        ageBand === 'early' ? "text-2xl" : "text-xl"
      )}>
        {copy.howHeadline}
      </h1>
      
      {/* Points */}
      <div className="space-y-4 mb-10 text-left">
        {copy.howPoints.map((point, index) => {
          const Icon = point.icon;
          return (
            <div 
              key={index}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl bg-white",
                "border border-slate-100 shadow-sm"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-violet-100"
              )}>
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <p className={cn(
                "text-slate-700",
                ageBand === 'early' ? "text-base" : "text-sm"
              )}>
                {point.text}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Button */}
      <button
        onClick={onNext}
        className={cn(
          "px-8 py-4 rounded-2xl font-semibold transition-all",
          "bg-violet-600 text-white",
          "hover:bg-violet-700 hover:scale-[1.02]",
          "active:scale-[0.98]",
          "shadow-lg shadow-violet-500/30",
          ageBand === 'early' ? "text-xl" : "text-lg"
        )}
      >
        {copy.howButton}
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SCREEN 3: READY TO START
// ═══════════════════════════════════════════════════════════════

const ReadyScreen = ({ copy, ageBand, onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-violet-50 to-white">
    <div className="text-center max-w-md">
      {/* Avatar with glow */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 rounded-full bg-violet-400 blur-2xl opacity-30 animate-pulse" 
             style={{ width: 140, height: 140, margin: 'auto' }} />
        <NoaAvatar size={ageBand === 'early' ? 140 : 120} />
      </div>
      
      {/* Headline */}
      <h1 className={cn(
        "font-bold text-slate-800 mb-3",
        ageBand === 'early' ? "text-3xl" : "text-2xl"
      )}>
        {copy.readyHeadline}
      </h1>
      
      {/* Subtext */}
      <p className={cn(
        "text-slate-500 mb-10",
        ageBand === 'early' ? "text-lg" : "text-base"
      )}>
        {copy.readySubtext}
      </p>
      
      {/* Start button - prominent */}
      <button
        onClick={onStart}
        className={cn(
          "w-full max-w-xs px-8 py-5 rounded-2xl font-bold transition-all",
          "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
          "hover:from-violet-700 hover:to-purple-700 hover:scale-[1.02]",
          "active:scale-[0.98]",
          "shadow-xl shadow-violet-500/30",
          ageBand === 'early' ? "text-2xl" : "text-xl"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {copy.readyButton}
          <ChevronRight className={cn(
            ageBand === 'early' ? "w-7 h-7" : "w-6 h-6"
          )} />
        </span>
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const FirstSessionWelcome = ({ 
  scholarName = 'Emma',
  yearLevel = 5,
  onComplete // Called when ready to start first session
}) => {
  const [screen, setScreen] = useState(1);
  
  const ageBand = getAgeBand(yearLevel);
  const copy = WELCOME_COPY[ageBand];
  
  // Progress indicator
  const ProgressDots = () => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      {[1, 2, 3].map(i => (
        <div 
          key={i}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            screen === i 
              ? "w-6 bg-violet-600" 
              : "bg-slate-300"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="relative">
      {screen === 1 && (
        <MeetNoaScreen 
          copy={copy} 
          ageBand={ageBand} 
          onNext={() => setScreen(2)} 
        />
      )}
      
      {screen === 2 && (
        <HowItWorksScreen 
          copy={copy} 
          ageBand={ageBand} 
          onNext={() => setScreen(3)} 
        />
      )}
      
      {screen === 3 && (
        <ReadyScreen 
          copy={copy} 
          ageBand={ageBand} 
          onStart={onComplete} 
        />
      )}
      
      <ProgressDots />
    </div>
  );
};

export default FirstSessionWelcome;