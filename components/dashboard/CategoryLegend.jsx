import React from 'react';
import { STRENGTH_LABELS, CATEGORY_STYLES } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const explanations = {
  strength: "Consistent accuracy across sessions",
  emerging_strength: "Improving pattern detected",
  focus_area: "Needs more practice",
};

const CategoryLegend = ({ className }) => {
  const categories = ['strength', 'emerging_strength', 'focus_area', 'emerging_focus'];

  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
        What these mean
      </h3>
      <div className="space-y-2 text-sm">
        {categories.map((cat) => (
          <div key={cat} className="flex items-start gap-2">
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", CATEGORY_STYLES[cat]?.dot)} />
            <span className="text-slate-600">
              <strong className="text-slate-700">{STRENGTH_LABELS[cat]}</strong> — {explanations[cat]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryLegend;
