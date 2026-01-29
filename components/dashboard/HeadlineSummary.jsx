import React from 'react';
import { HEADLINE, BASELINE } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const HeadlineSummary = ({
  childName,
  isBaseline,
  sessionsCompleted,
  topicsThisWeek,
  className,
}) => {
  const headline = isBaseline
    ? BASELINE.HEADLINE(childName)
    : HEADLINE.WITH_TOPICS(childName, topicsThisWeek);
    
  const subtitle = isBaseline
    ? BASELINE.PROGRESS(sessionsCompleted, BASELINE.SESSIONS_NEEDED)
    : HEADLINE.SUBTITLE;

  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
      <p className="text-slate-700 text-lg leading-relaxed">{headline}</p>
      <p className="text-slate-400 text-sm mt-2">{subtitle}</p>
    </div>
  );
};

export default HeadlineSummary;
