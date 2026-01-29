import React from 'react';
import { Lightbulb } from 'lucide-react';
import { PARENT_TIP, getRandomTip } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ParentTipCard = ({ className }) => {
  const tip = getRandomTip();

  return (
    <div className={cn("bg-violet-50 border border-violet-200 rounded-xl p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <p className="text-xs text-violet-600 font-medium uppercase tracking-wide mb-1">
            {PARENT_TIP.LABEL}
          </p>
          <p className="text-sm text-violet-800">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default ParentTipCard;
