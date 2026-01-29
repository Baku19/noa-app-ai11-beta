import React, { useState } from 'react';
import { Heart, ChevronDown, X } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const EmotionalFramingBanner = ({ className, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className={cn(
      "bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-violet-500" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <p className="text-sm text-violet-800 font-medium">
            Learning has ups and downs — that's how growth works.
          </p>
          {expanded && (
            <p className="text-xs text-violet-600 mt-2">
              Categories shift as your child practices. A 'Working On' today might be a 'Strength' next month. Focus on the journey, not the snapshot.
            </p>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-violet-500 font-semibold flex items-center gap-1 mt-2"
          >
            Learn more
            <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && 'rotate-180')} />
          </button>
        </div>

        {/* Close Button */}
        <button onClick={handleDismiss} className="p-1 text-violet-300 hover:text-violet-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmotionalFramingBanner;
