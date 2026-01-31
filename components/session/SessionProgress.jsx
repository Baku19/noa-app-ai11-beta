// ═══════════════════════════════════════════════════════════════
// FILE: components/session/SessionProgress.jsx
// PURPOSE: Visual progress through session - calm, not urgent
// ═══════════════════════════════════════════════════════════════
import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const SessionProgress = ({ 
  current, 
  total, 
  ageBand = 'middle' 
}) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  // Age-appropriate labels
  const getLabel = () => {
    if (ageBand === 'early') {
      return `${current} of ${total}`;
    }
    return `Question ${current} of ${total}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Label */}
      <p className={cn(
        "text-center mt-2 text-slate-400",
        ageBand === 'early' ? "text-base" : "text-sm"
      )}>
        {getLabel()}
      </p>
    </div>
  );
};

export default SessionProgress;
