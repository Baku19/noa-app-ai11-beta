// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/SessionComplete.jsx
// PURPOSE: The closure moment - leaving the child feeling capable
// PHILOSOPHY: "How does a child feel after closing the app?"
// ═══════════════════════════════════════════════════════════════
//
// This is the most important screen emotionally.
// 
// The child must leave feeling:
// - Slightly smarter
// - Slightly calmer  
// - Slightly more capable
//
// Not hyped. Not judged. Not exhausted.
//
// ═══════════════════════════════════════════════════════════════

import { useAuth } from '../../lib/AuthContext.jsx';
import React, { useEffect, useState } from 'react';
import { 
  Check,
  Sparkles,
  Heart,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  getAgeBand, 
  getSessionComplete 
} from '../../lib/scholarCopy.js';
import {
  getSessionConfig,
  BONUS_CONFIG
} from '../../lib/sessionConfig.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const MOCK_SESSION_RESULT = {
  scholarName: 'Emma',
  yearLevel: 5,
  duration: 25, // Actual session duration
  focusAreas: ['Fractions', 'Decimals'],
  effortSignal: 'persisted', // persisted, focused, improved, tried_hard, steady
  bonusAvailable: true, // Has bonus been used yet today?
  bonusUsed: false,
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const SessionComplete = ({ 
  session = MOCK_SESSION_RESULT, 
  onComplete,
  onStartBonus 
}) => {
const { isDemo } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [showEffort, setShowEffort] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const ageBand = getAgeBand(session.yearLevel);
  const copy = getSessionComplete(ageBand, session.duration, session.effortSignal, session.bonusUsed);
  const sessionConfig = getSessionConfig(session.yearLevel);
  const bonusPrompt = BONUS_CONFIG.prompts[ageBand];
  
  // Should we show bonus option?
  const canShowBonus = session.bonusAvailable && 
                       !session.bonusUsed && 
                       sessionConfig.showBonusPrompt;

  // Gentle animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowContent(true), 300),
      setTimeout(() => setShowEffort(true), 800),
      setTimeout(() => setShowBonus(true), 1200),
      setTimeout(() => setShowButton(true), canShowBonus ? 1600 : 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [canShowBonus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-6">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* THE COMPLETION MOMENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="w-full max-w-md text-center">
        
        {/* Checkmark - Calm completion, not celebration explosion */}
        <div className={cn(
          "transition-all duration-500 ease-out",
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}>
          <div className={cn(
            "w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-violet-400 to-purple-500",
            "shadow-lg shadow-emerald-500/30"
          )}>
            {ageBand === 'early' ? (
              <Sparkles className="w-10 h-10 text-white" />
            ) : (
              <Check className="w-10 h-10 text-white stroke-[3]" />
            )}
          </div>
        </div>

        {/* Headline */}
        <div className={cn(
          "transition-all duration-500 ease-out delay-100",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h1 className={cn(
            "font-bold text-slate-800 mb-2",
            ageBand === 'early' ? "text-3xl" : "text-2xl"
          )}>
            {copy.headline}
          </h1>
          
          {/* Duration */}
          <p className={cn(
            "text-slate-500",
            ageBand === 'early' ? "text-lg" : "text-base"
          )}>
            {copy.duration}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EFFORT RECOGNITION - The soul of the feedback */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <div className={cn(
          "mt-8 transition-all duration-500 ease-out",
          showEffort ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className={cn(
            "p-5 rounded-2xl",
            ageBand === 'early' 
              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
              : "bg-slate-50"
          )}>
            {ageBand === 'early' && (
              <Heart className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            )}
            <p className={cn(
              "text-slate-700",
              ageBand === 'early' ? "text-lg font-medium" : "text-base"
            )}>
              {copy.effort}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BONUS PROMPT - Optional, never pushy */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {canShowBonus && (
          <div className={cn(
            "mt-6 transition-all duration-500 ease-out",
            showBonus ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className={cn(
                "font-medium text-indigo-800 mb-1",
                ageBand === 'early' ? "text-lg" : "text-base"
              )}>
                {bonusPrompt.headline}
              </p>
              <p className="text-sm text-indigo-600 mb-4">
                {bonusPrompt.subtext}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onStartBonus}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                    "bg-indigo-600 text-white",
                    "hover:bg-indigo-700 hover:scale-[1.02]",
                    "active:scale-[0.98]"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  {bonusPrompt.yesButton}
                </button>
                <button
                  onClick={onComplete}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-medium transition-all",
                    "bg-white text-slate-600 border border-slate-200",
                    "hover:bg-slate-50 hover:scale-[1.02]",
                    "active:scale-[0.98]"
                  )}
                >
                  {bonusPrompt.noButton}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CLOSING + BUTTON (shown if no bonus, or after bonus section) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {!canShowBonus && (
          <div className={cn(
            "mt-8 transition-all duration-500 ease-out",
            showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {/* Closing message */}
            {copy.closing && (
              <p className={cn(
                "text-slate-400 mb-6",
                ageBand === 'early' ? "text-lg" : "text-sm"
              )}>
                {copy.closing}
              </p>
            )}
            
            {/* Done button */}
            <button
              onClick={onComplete}
              className={cn(
                "w-full max-w-xs mx-auto py-4 rounded-2xl font-semibold transition-all",
                "bg-slate-800 text-white",
                "hover:bg-slate-700 hover:scale-[1.02]",
                "active:scale-[0.98]",
                ageBand === 'early' ? "text-xl" : "text-lg"
              )}
            >
              {copy.button}
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* NOTHING ELSE - The absence creates peace */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
    </div>
  );
};

export default SessionComplete;
