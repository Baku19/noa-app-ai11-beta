// ═══════════════════════════════════════════════════════════════
// FILE: components/app/Sidebar.jsx
// PURPOSE: Role-based navigation with radically calm scholar experience
// PHILOSOPHY: Scholars don't need navigation. They need direction.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { 
  Star, 
  Home, 
  BarChart3, 
  PenLine, 
  Settings, 
  LogOut, 
  Users,
  GraduationCap,
  FileText,
  Heart,
  Sparkles,
  Search
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Parent navigation - Comprehensive analytics
const parentNavItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'reports', icon: FileText, label: 'Reports & Insights' },
  { id: 'topic_strengths', icon: BarChart3, label: 'Topic Strengths' },
  { id: 'confidence', icon: Heart, label: 'Confidence Tracking' },
  { id: 'writing_review', icon: PenLine, label: 'Writing Review' },
  { id: 'question_review', icon: Search, label: 'Question Review' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

// Scholar navigation - Radically simplified
// Jobs: "Why does a child need a navigation menu at all?"
// We keep it minimal: Home + Writing only
const scholarNavItems = [
  { id: 'scholar_home', icon: Sparkles, label: 'Home' },
  { id: 'writing', icon: PenLine, label: 'Writing' },
];

const Sidebar = ({ 
  activeScreen, 
  onNavigate, 
  userType, 
  setUserType
}) => {
  const navItems = userType === 'scholar' ? scholarNavItems : parentNavItems;
  const isScholar = userType === 'scholar';

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-50 h-full w-64 border-r p-4 flex flex-col",
      isScholar 
        ? "bg-gradient-to-b from-slate-50 to-white border-slate-100" 
        : "bg-white border-slate-200"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          isScholar
            ? "bg-gradient-to-br from-purple-500 to-indigo-600"
            : "bg-gradient-to-br from-indigo-500 to-purple-600"
        )}>
          <Star className="w-6 h-6 text-white" fill="white" />
        </div>
        <span className="font-semibold text-lg text-slate-800">Noa</span>
      </div>

      {/* User Type Badge */}
      <div className="px-3 mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          isScholar 
            ? "bg-purple-100 text-purple-700" 
            : "bg-indigo-100 text-indigo-700"
        )}>
          {isScholar ? (
            <>
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Scholar</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5" />
              <span>Parent View</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                isActive 
                  ? isScholar
                    ? "bg-purple-50 text-purple-700"
                    : "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive 
                  ? isScholar ? "text-purple-600" : "text-indigo-600"
                  : "text-slate-400"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Scholar: Simple sign out */}
      {/* Parent: Profile switch + sign out */}
      <div className="border-t border-slate-200 pt-4 mt-4 space-y-1">
        {!isScholar && (
          <button
            onClick={() => onNavigate('profile_select')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Switch Profile</span>
          </button>
        )}
        <button
          onClick={() => onNavigate(isScholar ? 'profile_select' : 'login')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
            isScholar
              ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{isScholar ? "Done" : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
