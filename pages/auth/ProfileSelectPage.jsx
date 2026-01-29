// ═══════════════════════════════════════════════════════════════
// FILE: pages/auth/ProfileSelectPage.jsx
// PURPOSE: Profile selection with real data from Firestore
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Logo } from '../../components/auth/shared.jsx';
import { 
  LogOut, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Star,
  ChevronRight,
  GraduationCap,
  Users,
  Zap,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import AddScholarModal from '../../components/settings/AddScholarModal.jsx';

const colorSchemes = {
  'bg-emerald-500': {
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/25',
    badge: 'bg-emerald-400/20 text-emerald-300'
  },
  'bg-sky-500': {
    gradient: 'from-sky-400 to-blue-500',
    glow: 'shadow-sky-500/25',
    badge: 'bg-sky-400/20 text-sky-300'
  },
  'bg-violet-500': {
    gradient: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/25',
    badge: 'bg-violet-400/20 text-violet-300'
  },
  'bg-rose-500': {
    gradient: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-500/25',
    badge: 'bg-rose-400/20 text-rose-300'
  },
  'bg-amber-500': {
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/25',
    badge: 'bg-amber-400/20 text-amber-300'
  },
  'bg-indigo-500': {
    gradient: 'from-indigo-400 to-blue-500',
    glow: 'shadow-indigo-500/25',
    badge: 'bg-indigo-400/20 text-indigo-300'
  },
  // Default fallback
  'default': {
    gradient: 'from-indigo-400 to-purple-500',
    glow: 'shadow-indigo-500/25',
    badge: 'bg-indigo-400/20 text-indigo-300'
  }
};

const getColorScheme = (avatarColor) => {
  return colorSchemes[avatarColor] || colorSchemes['default'];
};

const getPlanLimit = (plan) => {
  switch(plan) {
    case 'free': return 1;
    case 'single': return 1;
    case 'family': return 5;
    default: return 1;
  }
};

// FIX: Add setSelectedScholar to props to fix type error in index.tsx
const ProfileSelectPage = ({ onNavigate, setUserType, setSelectedScholar }) => {
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [showAddScholar, setShowAddScholar] = useState(false);
  const { family, scholars, logout, isDemo, userProfile } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

  const handleAddScholar = (scholarData) => {
    // This will be handled by AddScholarModal's onSave
    // For now, close modal - actual save happens in the modal
    setShowAddScholar(false);
  };

  const familyName = family?.familyName || 'Your Family';
  const plan = family?.plan || 'free';
  const scholarLimit = getPlanLimit(plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex flex-col relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Logo textColor="text-white" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Welcome back, {familyName}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
            Who's learning today?
          </h1>
          <p className="text-slate-400 text-lg">Select a profile to continue</p>
        </div>
        
        {/* Profile Cards */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-4xl">
          
          {/* Parent Portal Card */}
          <button 
            onClick={() => {
              setUserType('parent');
              onNavigate('app');
            }}
            onMouseEnter={() => setHoveredProfile('parent')}
            onMouseLeave={() => setHoveredProfile(null)}
            className="group relative"
          >
            <div className={`
              relative w-44 lg:w-52 bg-gradient-to-br from-slate-800/80 to-slate-900/80 
              backdrop-blur-xl rounded-3xl border border-white/10 p-6
              transition-all duration-300 ease-out
              hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20
              ${hoveredProfile === 'parent' ? 'scale-105 -translate-y-2' : ''}
            `}>
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-shadow">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              
              {/* Label */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <p className="text-white font-semibold text-lg">Parent Portal</p>
                </div>
                <p className="text-slate-400 text-sm">Dashboard & Insights</p>
              </div>
              
              {/* Hover Arrow */}
              <div className={`
                absolute right-4 top-1/2 -translate-y-1/2 
                transition-all duration-300
                ${hoveredProfile === 'parent' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
              `}>
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </button>

          {/* Scholar Profiles */}
          {scholars.map((scholar) => {
            const colors = getColorScheme(scholar.avatarColor);
            const isHovered = hoveredProfile === scholar.id;
            
            return (
              <button
                key={scholar.id}
                // FIX: Use setSelectedScholar directly as it's now a required prop.
                onClick={() => {
                  setUserType('scholar');
                  setSelectedScholar(scholar);
                  onNavigate('app');
                }}
                onMouseEnter={() => setHoveredProfile(scholar.id)}
                onMouseLeave={() => setHoveredProfile(null)}
                className="group relative"
              >
                <div className={`
                  relative w-44 lg:w-52 bg-gradient-to-br from-slate-800/80 to-slate-900/80 
                  backdrop-blur-xl rounded-3xl border border-white/10 p-6
                  transition-all duration-300 ease-out
                  hover:shadow-2xl ${colors.glow}
                  ${isHovered ? 'scale-105 -translate-y-2 border-white/30' : ''}
                `}>
                  {/* Avatar */}
                  <div className={`
                    w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colors.gradient} 
                    flex items-center justify-center shadow-lg ${colors.glow}
                    group-hover:shadow-xl transition-shadow
                  `}>
                    <span className="text-3xl font-bold text-white">{scholar.name.charAt(0)}</span>
                  </div>
                  
                  {/* Name & Year */}
                  <div className="text-center mb-3">
                    <p className="text-white font-semibold text-lg">{scholar.name}</p>
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Year {scholar.yearLevel}
                    </p>
                  </div>
                  
                  {/* Login Code Badge */}
                  {scholar.loginCode && (
                    <div className={`
                      mx-auto px-3 py-1.5 rounded-full ${colors.badge} text-xs font-medium
                      flex items-center justify-center gap-1.5
                    `}>
                      <BookOpen className="w-3 h-3" />
                      Code: {scholar.loginCode}
                    </div>
                  )}
                  
                  {/* Hover Arrow */}
                  <div className={`
                    absolute right-4 top-1/2 -translate-y-1/2 
                    transition-all duration-300
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                  `}>
                    <ChevronRight className="w-5 h-5 text-white/70" />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Add Scholar Card (if no scholars or under limit) */}
          {scholars.length < scholarLimit && (
            <button 
              onClick={() => setShowAddScholar(true)}
              onMouseEnter={() => setHoveredProfile('add')}
              onMouseLeave={() => setHoveredProfile(null)}
              className="group relative"
            >
              <div className={`
                relative w-44 lg:w-52 bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                backdrop-blur-xl rounded-3xl border-2 border-dashed border-white/20 p-6
                transition-all duration-300 ease-out
                hover:border-indigo-500/50 hover:bg-slate-800/70
                ${hoveredProfile === 'add' ? 'scale-105 -translate-y-2' : ''}
              `}>
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
                  <UserPlus className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                
                {/* Label */}
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">Add Scholar</p>
                  <p className="text-slate-400 text-sm">Create new profile</p>
                </div>
              </div>
            </button>
          )}

          {/* Empty State - No Scholars */}
          {scholars.length === 0 && (
            <div className="w-full text-center mt-4">
              <p className="text-slate-400 text-sm">
                No scholars yet. Add your first scholar to get started!
              </p>
            </div>
          )}
        </div>

        {/* Settings Link */}
        {scholars.length > 0 && (
          <p className="mt-16 text-slate-500 text-sm">
            Need to manage scholars? Go to{' '}
            <button 
              onClick={() => {
                setUserType('parent');
                onNavigate('app');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Parent Portal → Settings
            </button>
          </p>
        )}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{plan} Plan</span>
          </div>
          <span className="text-slate-600">•</span>
          <span>{scholars.length} scholar{scholars.length !== 1 ? 's' : ''}</span>
        </div>
      </footer>

      {/* Add Scholar Modal */}
      {showAddScholar && (
        <AddScholarModal
          onClose={() => setShowAddScholar(false)}
          onSave={handleAddScholar}
          scholarsUsed={scholars.length}
          scholarsLimit={scholarLimit}
          plan={plan}
        />
      )}
    </div>
  );
};

export default ProfileSelectPage;