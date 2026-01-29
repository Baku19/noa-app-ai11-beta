import React from 'react';
import { NAV, EMPTY_STATE } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Formats a date string into a relative time string.
 * @param {string} dateString - An ISO 8601 date string.
 * @returns {string} - The formatted relative date.
 */
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, now)) {
    return 'Today';
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const SessionRow = ({ session, isLast }) => {
  const topics = session.topics_covered?.join(', ') || 'General Practice';

  return (
    <div className={cn(
      "flex items-center justify-between py-3",
      !isLast && "border-b border-slate-50"
    )}>
      <div>
        <p className="text-slate-700 text-sm font-medium">{session.domain || 'Session'}</p>
        <p className="text-slate-400 text-xs truncate max-w-xs">{topics}</p>
      </div>
      <span className="text-slate-400 text-xs flex-shrink-0 ml-2">
        {formatRelativeDate(session.session_date)}
      </span>
    </div>
  );
};

const RecentSessionsList = ({ sessions, isLoading, className }) => {
  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <div className="h-4 bg-slate-200 rounded w-24 mb-1.5"></div>
              <div className="h-3 bg-slate-200 rounded w-36"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="h-4 bg-slate-200 rounded w-20 mb-1.5"></div>
              <div className="h-3 bg-slate-200 rounded w-28"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-500">Recent Sessions</h3>
        {sessions && sessions.length > 0 && (
          <a href="#" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
            {NAV.VIEW_ALL} →
          </a>
        )}
      </div>
      
      {sessions && sessions.length > 0 ? (
        <div className="space-y-1">
          {sessions.map((session, i) => (
            <SessionRow 
              key={session.id} 
              session={session} 
              isLast={i === sessions.length - 1} 
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
            <p className="text-sm text-slate-500">{EMPTY_STATE}</p>
        </div>
      )}
    </div>
  );
};

export default RecentSessionsList;
