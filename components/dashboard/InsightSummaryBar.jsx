import React from 'react';
import { Sparkles, TrendingUp, Settings2 } from 'lucide-react';
import { STRENGTH_LABELS, CATEGORY_STYLES, NAV, EMPTY_STATE } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ICONS = {
  strength: Sparkles,
  emerging_strength: TrendingUp,
  focus_area: Settings2
};

const CategoryPill = ({ category, count }) => {
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES.emerging_focus;
  const label = STRENGTH_LABELS[category];
  const Icon = ICONS[category];
  
  if (!Icon) return null;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
      styles.bg,
      styles.text
    )}>
      <Icon className="w-3.5 h-3.5" />
      {label} {count}
    </span>
  );
};

const InsightSummaryBar = ({ counts, isLoading, className }) => {
  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="h-8 w-28 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-36 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-32 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  // NOTE: The prompt prop keys differ from the schema in `copy.js`.
  // Using schema keys: `strength`, `emerging_strength`, `focus_area`.
  const categories = [
    { key: 'strength', count: counts?.strength || 0 },
    { key: 'emerging_strength', count: counts?.emerging_strength || 0 },
    { key: 'focus_area', count: counts?.focus_area || 0 }
  ].filter(c => c.count > 0);

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-500">Learning Overview</h3>
        {total > 0 && (
          <a href="#" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
            {NAV.VIEW_ALL_TOPICS} →
          </a>
        )}
      </div>
      
      {total > 0 ? (
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <CategoryPill
              key={cat.key}
              category={cat.key}
              count={cat.count}
            />
          ))}
        </div>
      ) : (
        <div className="py-4 text-center">
            <p className="text-sm text-slate-500">{EMPTY_STATE}</p>
        </div>
      )}
    </div>
  );
};

export default InsightSummaryBar;
