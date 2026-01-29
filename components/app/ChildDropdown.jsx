import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const ChildDropdown = ({ children, selectedChild, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (child) => {
    onSelect(child);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 w-full text-left transition-colors"
      >
        <div className="flex-grow flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${selectedChild.avatar_color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
            {selectedChild.name.charAt(0)}
            </div>
            <div>
            <p className="font-medium text-slate-800">{selectedChild.name}</p>
            <p className="text-xs text-slate-500">Year {selectedChild.year_level}</p>
            </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-10 w-48 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleSelect(child)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer text-left first:rounded-t-xl last:rounded-b-xl"
              >
                <div className={`w-8 h-8 rounded-full ${child.avatar_color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{child.name}</p>
                  <p className="text-xs text-slate-500">Year {child.year_level}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ChildDropdown;
