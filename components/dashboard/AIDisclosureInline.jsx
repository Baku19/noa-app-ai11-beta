import React from 'react';
import { Bot } from 'lucide-react';
import { AI_DISCLOSURE } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const AIDisclosureInline = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2 px-1", className)}>
      <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center">
        <Bot className="w-3 h-3 text-slate-400" />
      </div>
      <p className="text-xs text-slate-400">{AI_DISCLOSURE.FOOTER}</p>
    </div>
  );
};

export default AIDisclosureInline;
