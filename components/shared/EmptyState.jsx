// ═══════════════════════════════════════════════════════════════
// FILE: components/shared/EmptyState.jsx
// PURPOSE: Reusable empty state components across the app
// PHILOSOPHY: "The empty state IS the product for new users"
// ═══════════════════════════════════════════════════════════════
//
// Empty states should feel:
// - Intentional (not broken)
// - Warm (Noa is present)
// - Actionable (what to do next)
//
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  PenLine, 
  BarChart3, 
  Heart,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// SIMPLE NOA AVATAR (Placeholder)
// ═══════════════════════════════════════════════════════════════

const NoaAvatar = ({ size = 64, opacity = 1 }) => (
  <div 
    className="rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
    style={{ width: size, height: size, opacity }}
  >
    <span style={{ fontSize: size * 0.5 }}>🦊</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// BASE EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════

export const EmptyState = ({
  icon: Icon,
  iconBg = 'bg-slate-100',
  iconColor = 'text-slate-400',
  headline,
  message,
  submessage,
  action,
  actionLabel,
  showNoa = false,
  noaSize = 64,
  className = ''
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className
    )}>
      {/* Icon or Noa */}
      {showNoa ? (
        <div className="mb-4 opacity-70">
          <NoaAvatar size={noaSize} />
        </div>
      ) : Icon && (
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
          iconBg
        )}>
          <Icon className={cn("w-8 h-8", iconColor)} />
        </div>
      )}
      
      {/* Headline */}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {headline}
      </h3>
      
      {/* Message */}
      <p className="text-slate-500 max-w-sm mb-1">
        {message}
      </p>
      
      {/* Submessage (optional) */}
      {submessage && (
        <p className="text-sm text-slate-400 max-w-sm">
          {submessage}
        </p>
      )}
      
      {/* Action button (optional) */}
      {action && actionLabel && (
        <button
          onClick={action}
          className={cn(
            "mt-6 px-6 py-3 rounded-xl font-medium transition-all",
            "bg-violet-600 text-white",
            "hover:bg-violet-700 hover:scale-[1.02]",
            "active:scale-[0.98]"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CARD EMPTY STATE (For use inside cards/sections)
// ═══════════════════════════════════════════════════════════════

export const CardEmptyState = ({
  icon: Icon,
  message,
  submessage,
  compact = false
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      compact ? "py-6 px-4" : "py-10 px-6"
    )}>
      {Icon && (
        <div className={cn(
          "rounded-xl bg-slate-100 flex items-center justify-center mb-3",
          compact ? "w-10 h-10" : "w-12 h-12"
        )}>
          <Icon className={cn(
            "text-slate-400",
            compact ? "w-5 h-5" : "w-6 h-6"
          )} />
        </div>
      )}
      <p className={cn(
        "text-slate-500",
        compact ? "text-sm" : "text-base"
      )}>
        {message}
      </p>
      {submessage && (
        <p className="text-xs text-slate-400 mt-1">
          {submessage}
        </p>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// INLINE EMPTY STATE (For use in lists)
// ═══════════════════════════════════════════════════════════════

export const InlineEmptyState = ({
  message,
  className = ''
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl bg-slate-50 text-slate-500",
      className
    )}>
      <NoaAvatar size={32} opacity={0.7} />
      <p className="text-sm">{message}</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRESET EMPTY STATES
// ═══════════════════════════════════════════════════════════════

// Scholar: No sessions yet
export const NoSessionsYetScholar = ({ onStart }) => (
  <EmptyState
    showNoa
    noaSize={80}
    headline="Nothing here yet!"
    message="Your practice will show up after your first session."
    action={onStart}
    actionLabel="Start practising →"
  />
);

// Scholar: No writing yet
export const NoWritingYetScholar = ({ onStart }) => (
  <EmptyState
    showNoa
    noaSize={80}
    headline="Ready to write something?"
    message="I'll help you practise different types of writing."
    action={onStart}
    actionLabel="Start writing →"
  />
);

// Parent: No sessions this week
export const NoSessionsThisWeek = ({ childName = 'Your child' }) => (
  <EmptyState
    showNoa
    noaSize={64}
    headline="No sessions yet this week"
    message={`${childName} hasn't practised yet this week.`}
    submessage="That's okay — learning happens at their pace."
  />
);

// Parent: Not enough data for insights
export const NotEnoughDataForInsights = ({ sessionsNeeded = 5 }) => (
  <EmptyState
    icon={TrendingUp}
    iconBg="bg-violet-100"
    iconColor="text-violet-500"
    headline="Noa is still learning"
    message="After a few more sessions, you'll see patterns and insights here."
    submessage={`Usually takes ${sessionsNeeded} sessions`}
  />
);

// Parent: Topic Strengths - not enough data
export const TopicStrengthsEmpty = ({ childName = 'Your child' }) => (
  <EmptyState
    showNoa
    noaSize={64}
    headline={`Noa is still learning about ${childName}`}
    message="After a few more sessions, you'll see which topics are strengths and which need practice."
    submessage="📈 Usually takes 3-5 sessions"
  />
);

// Parent: Confidence Tracking - not enough data
export const ConfidenceTrackingEmpty = () => (
  <EmptyState
    icon={Heart}
    iconBg="bg-rose-100"
    iconColor="text-rose-500"
    headline="Confidence patterns take time"
    message="Noa watches how your child approaches questions — not just whether they're right or wrong."
    submessage="📈 Usually takes 5-7 sessions"
  />
);

// Parent: Session History - no sessions
export const SessionHistoryEmpty = ({ childName = 'Your child' }) => (
  <EmptyState
    icon={Clock}
    iconBg="bg-slate-100"
    iconColor="text-slate-400"
    headline="No sessions yet"
    message={`When ${childName} practises, sessions will appear here.`}
  />
);

// Parent: Reports - no data
export const ReportsEmpty = () => (
  <EmptyState
    icon={BarChart3}
    iconBg="bg-indigo-100"
    iconColor="text-indigo-500"
    headline="Reports will appear here"
    message="Once there's enough practice data, Noa will generate weekly insights and reports."
    submessage="📈 Usually takes 1-2 weeks of practice"
  />
);

// Generic: Coming soon
export const ComingSoon = ({ feature = 'This feature' }) => (
  <EmptyState
    icon={Sparkles}
    iconBg="bg-amber-100"
    iconColor="text-amber-500"
    headline="Coming soon"
    message={`${feature} is being built and will be available soon.`}
  />
);

// Generic: No results
export const NoResults = ({ searchTerm }) => (
  <EmptyState
    icon={BookOpen}
    iconBg="bg-slate-100"
    iconColor="text-slate-400"
    headline="No results found"
    message={searchTerm 
      ? `We couldn't find anything matching "${searchTerm}"`
      : "We couldn't find what you're looking for"
    }
  />
);

// ═══════════════════════════════════════════════════════════════
// LOADING STATE (Bonus - often needed alongside empty states)
// ═══════════════════════════════════════════════════════════════

export const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6">
    <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin mb-4" />
    <p className="text-slate-500">{message}</p>
  </div>
);

// With Noa
export const NoaLoading = ({ message = "Noa is thinking..." }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6">
    <div className="animate-pulse mb-4">
      <NoaAvatar size={64} opacity={0.8} />
    </div>
    <p className="text-slate-500">{message}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ERROR STATE (Bonus)
// ═══════════════════════════════════════════════════════════════

export const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry 
}) => (
  <EmptyState
    icon={Sparkles}
    iconBg="bg-red-100"
    iconColor="text-red-500"
    headline="Oops!"
    message={message}
    action={onRetry}
    actionLabel="Try again"
  />
);

export default EmptyState;