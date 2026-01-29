// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/Dashboard.jsx
// PURPOSE: Enhanced dashboard with AI weekly wrap, comparisons, consistent design
// NOW: Connected to real data with empty states for new users
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Sparkles,
  Brain,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Eye,
  Lightbulb,
  MessageSquare,
  Heart,
  Zap,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Trophy,
  Flame,
  BarChart3,
  Users,
  Plus
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';
import { 
  getDemoStatsForScholar,
  getDemoSessionsForScholar,
  getDemoSummaryForScholar
} from '../../lib/demoData.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = ({ onAddScholar }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-indigo-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to Noa!</h2>
    <p className="text-slate-500 max-w-sm mb-6">
      Add your first scholar to start their learning journey. Noa will adapt to their unique needs.
    </p>
    <button
      onClick={onAddScholar}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
    >
      <Plus className="w-5 h-5" />
      Add Your First Scholar
    </button>
  </div>
);

const NoSessionsYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Sparkles className="w-8 h-8 text-violet-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      Noa is ready for {childName}!
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      Once {childName} completes their first session, you'll see insights and progress here.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Sessions take about 20-25 minutes</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// DATA HELPERS
// ═══════════════════════════════════════════════════════════════

const getDataForChild = (selectedChild, isDemo) => {
  if (!selectedChild) return { thisWeek: null, lastWeek: null, sessions: [], summary: null, hasData: false };
  
  if (isDemo) {
    // Map to demo scholar IDs based on name
    const scholarId = selectedChild.name === 'Emma' ? 'demo-scholar-001' : 
                      selectedChild.name === 'Oliver' ? 'demo-scholar-002' : 
                      `demo-scholar-001`;
    const stats = getDemoStatsForScholar(scholarId);
    const sessions = getDemoSessionsForScholar(scholarId);
    const summary = getDemoSummaryForScholar(scholarId);
    return {
      thisWeek: stats?.thisWeek || null,
      lastWeek: stats?.lastWeek || null,
      sessions: sessions || [],
      summary: summary,
      hasData: !!stats
    };
  }
  
  // Real user - no session data yet (will come from Firestore later)
  return { thisWeek: null, lastWeek: null, sessions: [], summary: null, hasData: false };
};

// Learning highlights for AI summary (used for demo)
const WEEKLY_HIGHLIGHTS = [
  { type: 'strength', text: 'Fractions moved from "Getting Stronger" to "Strength" this week' },
  { type: 'effort', text: 'Completed 4 sessions — more than any week this month' },
  { type: 'persistence', text: 'Stuck with challenging word problems even when frustrated' },
  { type: 'growth', text: 'Response time on fraction questions improved by 25%' }
];

// Areas Noa is focusing on
const NOAS_FOCUS = [
  { topic: 'Multi-step Word Problems', reason: 'Building step-by-step strategies' },
  { topic: 'Author\'s Purpose', reason: 'Distinguishing inform vs. persuade' }
];

// Parent tip of the day
const PARENT_TIP = {
  title: "One way to connect",
  tip: "Ask \"What was the trickiest question today?\" instead of \"How did you do?\"",
  why: "This celebrates effort and opens conversation without pressure."
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const Dashboard = ({ selectedChild, setSelectedChild, childrenList = [], onNavigate }) => {
  const { isDemo } = useAuth();
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // No scholars yet - show welcome state
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Your family's learning command center</p>
          </header>
          <NoScholarsYet onAddScholar={() => onNavigate('settings')} />
        </div>
      </div>
    );
  }

  // Get data based on mode (demo vs real)
  const { thisWeek: THIS_WEEK, lastWeek: LAST_WEEK, sessions: RECENT_SESSIONS, summary, hasData } = getDataForChild(selectedChild, isDemo);

  // No data yet - show empty state
  if (!hasData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500">Let's get {selectedChild.name} started!</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoSessionsYet childName={selectedChild.name} />
          <footer className="text-center pt-6 mt-6">
            <p className="text-xs text-slate-400">Insights will appear after the first session</p>
          </footer>
        </div>
      </div>
    );
  }

  // Calculate week-over-week changes
  const sessionChange = THIS_WEEK.sessions - (LAST_WEEK?.sessions || 0);
  const minuteChange = THIS_WEEK.totalMinutes - (LAST_WEEK?.totalMinutes || 0);
  const strengthChange = THIS_WEEK.strengths - (LAST_WEEK?.strengths || 0);
  const confidenceChange = THIS_WEEK.confidence - (LAST_WEEK?.confidence || 0);

  const getChangeIndicator = (change, suffix = '') => {
    if (change > 0) return (
      <span className="text-emerald-600 text-xs font-medium flex items-center gap-0.5">
        <ArrowUpRight className="w-3 h-3" />+{change}{suffix}
      </span>
    );
    if (change < 0) return (
      <span className="text-amber-600 text-xs font-medium flex items-center gap-0.5">
        <ArrowDownRight className="w-3 h-3" />{change}{suffix}
      </span>
    );
    return <span className="text-slate-400 text-xs">—</span>;
  };

  const getDomainEmoji = (domain) => {
    switch(domain) {
      case 'numeracy': return '🔢';
      case 'reading': return '📖';
      case 'writing': return '✏️';
      case 'grammar': return '📝';
      default: return '📚';
    }
  };

  const getDomainBg = (domain) => {
    switch(domain) {
      case 'numeracy': return 'bg-indigo-100';
      case 'reading': return 'bg-emerald-100';
      case 'writing': return 'bg-amber-100';
      case 'grammar': return 'bg-rose-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Welcome back! Here's {selectedChild.name}'s learning overview.</p>
          </div>
          {childrenList.length > 1 && (
            <ChildDropdown 
              children={childrenList}
              selectedChild={selectedChild}
              onSelect={setSelectedChild}
            />
          )}
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BASELINE EXPLANATION BANNER */}
        {/* Shows when scholar hasn't completed baseline yet */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {selectedChild && !selectedChild.baselineComplete && (
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-violet-900 mb-1">Getting to Know {selectedChild.name}</h3>
                <p className="text-violet-700 text-sm leading-relaxed">
                  We're learning how {selectedChild.name} approaches different skills. This takes a few short sessions. 
                  Early patterns will settle as more learning happens.
                </p>
                <p className="text-violet-600 text-xs mt-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  This is guided learning — not a test.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EMOTIONAL FRAMING BANNER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {!dismissedBanner && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 mb-6 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Learning has ups and downs — that's how growth works.</p>
                <button 
                  onClick={() => setShowFullSummary(!showFullSummary)}
                  className="text-sm text-purple-600 hover:text-purple-700 mt-1"
                >
                  {showFullSummary ? 'Show less' : 'Learn more'} 
                  <ChevronDown className={cn("w-3 h-3 inline ml-1 transition-transform", showFullSummary && "rotate-180")} />
                </button>
                {showFullSummary && (
                  <p className="text-sm text-slate-600 mt-2 max-w-xl">
                    Noa tracks patterns over time, not single sessions. A "bad day" often precedes a breakthrough. 
                    Focus on consistency, not perfection.
                  </p>
                )}
              </div>
            </div>
            <button onClick={() => setDismissedBanner(true)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* AI WEEKLY WRAP */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {summary && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" />
              Noa's Weekly Wrap
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">{summary.weeklyWrap}</p>
            
            {/* Highlights */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">This Week's Highlights</h3>
              <div className="space-y-2">
                {WEEKLY_HIGHLIGHTS.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">{highlight.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Noa's observation */}
            <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
              <Eye className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-violet-800">{summary.noaObservation}</p>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WEEKLY STATS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            This Week
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              label="Sessions" 
              value={THIS_WEEK.sessions} 
              change={getChangeIndicator(sessionChange)}
              icon={Target}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
            />
            <StatCard 
              label="Practice Time" 
              value={`${THIS_WEEK.totalMinutes}m`}
              sublabel="total"
              icon={Clock}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <StatCard 
              label="Day Streak" 
              value={THIS_WEEK.streak}
              icon={Flame}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <StatCard 
              label="Confidence" 
              value={`${THIS_WEEK.confidence}%`}
              change={getChangeIndicator(confidenceChange, '%')}
              icon={Heart}
              iconBg="bg-rose-100"
              iconColor="text-rose-600"
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TOPIC SUMMARY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Topic Progress
            </h2>
            <button 
              onClick={() => onNavigate('topic_strengths')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <CategoryPill label="Strengths" count={THIS_WEEK.strengths} color="emerald" icon={Trophy} />
            <CategoryPill label="Getting Stronger" count={THIS_WEEK.emergingStrengths} color="sky" icon={TrendingUp} />
            <CategoryPill label="Working On" count={THIS_WEEK.focusAreas} color="amber" icon={Target} />
          </div>
          
          {/* Legend */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Strengths</span>
              <span className="text-slate-500">— Consistent accuracy across sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="font-medium text-slate-700">Getting Stronger</span>
              <span className="text-slate-500">— Improving pattern detected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-medium text-slate-700">Working On</span>
              <span className="text-slate-500">— Needs more practice</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NOAS FOCUS + PARENT TIP - Side by Side */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Noa's Focus */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              Noa's Focus This Week
            </h3>
            <div className="space-y-3">
              {NOAS_FOCUS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.topic}</p>
                    <p className="text-sm text-slate-500">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Noa automatically adjusts based on practice patterns
            </p>
          </section>

          {/* Parent Tip */}
          <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-5">
            <h3 className="font-bold text-violet-800 flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-violet-600" />
              {summary?.parentTip ? 'Tip for You' : PARENT_TIP.title}
            </h3>
            <div className="bg-white rounded-xl p-4 mb-3">
              <p className="text-slate-700 font-medium">"{summary?.parentTip || PARENT_TIP.tip}"</p>
            </div>
            <p className="text-sm text-violet-700">{PARENT_TIP.why}</p>
            <button 
              onClick={() => onNavigate('reports')}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium mt-3 flex items-center gap-1"
            >
              More parent guidance
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* RECENT SESSIONS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Sessions</h3>
            <button 
              onClick={() => onNavigate('session_history')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_SESSIONS.slice(0, 4).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                    getDomainBg(session.domain)
                  )}>
                    {getDomainEmoji(session.domain)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{session.capability}</p>
                    <p className="text-xs text-slate-500">{session.duration} mins · {session.accuracy}% accuracy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    {new Date(session.date).toLocaleDateString('en-AU', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className={cn(
                    "text-xs font-medium capitalize",
                    session.confidence === 'high' ? 'text-emerald-600' :
                    session.confidence === 'moderate' ? 'text-sky-600' : 'text-amber-600'
                  )}>
                    {session.confidence} confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* QUICK LINKS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <QuickLink 
            icon={BarChart3} 
            label="Topic Strengths" 
            onClick={() => onNavigate('topic_strengths')}
          />
          <QuickLink 
            icon={Heart} 
            label="Confidence" 
            onClick={() => onNavigate('confidence')}
          />
          <QuickLink 
            icon={BookOpen} 
            label="Reports" 
            onClick={() => onNavigate('reports')}
          />
          <QuickLink 
            icon={MessageSquare} 
            label="Parent Guidance" 
            onClick={() => onNavigate('reports')}
          />
        </section>

        {/* Footer */}
        <footer className="text-center pt-4 border-t border-slate-200">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <button className="hover:text-slate-700">How Noa works</button>
            <span className="text-slate-300">·</span>
            <button className="hover:text-slate-700">Parent guidance</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            AI-generated from practice patterns · Updated after each session
          </p>
        </footer>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const StatCard = ({ label, value, change, sublabel, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
        <Icon className={cn("w-4 h-4", iconColor)} />
      </div>
      {change}
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
    {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
  </div>
);

const CategoryPill = ({ label, count, color, icon: Icon }) => {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    sky: 'bg-sky-100 text-sky-700 border-sky-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200'
  };
  const iconColors = {
    emerald: 'text-emerald-600',
    sky: 'text-sky-600',
    amber: 'text-amber-600'
  };

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full border",
      colors[color]
    )}>
      <Icon className={cn("w-4 h-4", iconColors[color])} />
      <span className="font-semibold">{label}</span>
      <span className="opacity-70">{count}</span>
    </div>
  );
};

const QuickLink = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
  >
    <Icon className="w-5 h-5 text-indigo-600" />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </button>
);

export default Dashboard;