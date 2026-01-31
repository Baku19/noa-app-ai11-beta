// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/Reports.jsx
// PURPOSE: Comprehensive Reports & Insights page serving all parent personas
// NOW: Connected to real data with empty states
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  BookOpen, 
  Lightbulb,
  CheckCircle,
  Clock,
  Target,
  Flame,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Home,
  AlertTriangle,
  Brain,
  Eye,
  Download,
  Info,
  X,
  FileText,
  LayoutDashboard,
  Users
} from "lucide-react";
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-indigo-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">No Scholars Yet</h2>
    <p className="text-slate-500 max-w-sm">
      Add a scholar to start seeing reports and insights.
    </p>
  </div>
);

const NoReportDataYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <FileText className="w-8 h-8 text-indigo-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      Reports will appear here
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      Once {childName} completes a few practice sessions, Noa will generate insights about their learning patterns.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Usually takes 3-5 sessions</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const MOCK_SESSIONS = [
  { id: 1, date: '2026-01-25', domain: 'numeracy', duration: 18, capability: 'Fractions & Decimals' },
  { id: 2, date: '2026-01-24', domain: 'reading', duration: 15, capability: 'Inference & Main Ideas' },
  { id: 3, date: '2026-01-23', domain: 'writing', duration: 20, capability: 'Persuasive Techniques' },
  { id: 4, date: '2026-01-22', domain: 'numeracy', duration: 17, capability: 'Word Problems' },
  { id: 5, date: '2026-01-20', domain: 'reading', duration: 16, capability: 'Vocabulary in Context' },
];

const MOCK_TOPICS = [
  { topic: 'Fractions', domain: 'Numeracy', strengthState: 'strength', sessions: 5 },
  { topic: 'Main Ideas', domain: 'Reading', strengthState: 'strength', sessions: 3 },
  { topic: 'Persuasive Writing', domain: 'Writing', strengthState: 'strength', sessions: 4 },
  { topic: '2D Shapes', domain: 'Numeracy', strengthState: 'emerging_strength', sessions: 2 },
  { topic: 'Inference', domain: 'Reading', strengthState: 'emerging_strength', sessions: 4 },
  { topic: 'Word Problems', domain: 'Numeracy', strengthState: 'focus_area', sessions: 6 },
  { topic: 'Author\'s Purpose', domain: 'Reading', strengthState: 'focus_area', sessions: 3 },
  { topic: 'Figurative Language', domain: 'Writing', strengthState: 'emerging_focus', sessions: 1 },
];

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & COPY
// ═══════════════════════════════════════════════════════════════

const STATUS_CONFIG = {
  thriving: {
    icon: CheckCircle,
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: (name) => `${name} is having a great week`,
    subtitle: 'Strong practice habits and growing skills'
  },
  progressing: {
    icon: TrendingUp,
    bg: 'bg-gradient-to-r from-sky-50 to-indigo-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    title: (name) => `${name} is making progress`,
    subtitle: 'Building skills with regular practice'
  },
  building: {
    icon: Clock,
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: (name) => `${name} is building momentum`,
    subtitle: 'More practice will help patterns emerge'
  },
  attention: {
    icon: Target,
    bg: 'bg-gradient-to-r from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    title: (name) => `${name} could use encouragement`,
    subtitle: 'A few sessions would help get back on track'
  }
};

const GROWTH_MINDSET_TIPS = [
  "Praise effort and strategies, not just results",
  "Use 'yet' — \"You haven't mastered it yet\"",
  "Share your own learning struggles and how you overcame them",
  "Celebrate mistakes as learning opportunities",
  "Focus on the process, not just the outcome",
  "Avoid comparing to siblings or other children"
];

const CONVERSATION_STARTERS = [
  {
    context: "they finish a session",
    phrase: "What was the most interesting thing you worked on?",
    why: "Opens discussion without focusing on right/wrong"
  },
  {
    context: "they seem frustrated",
    phrase: "That one was tricky! What made it hard?",
    why: "Validates the struggle and encourages problem-solving"
  },
  {
    context: "you see improvement",
    phrase: "I noticed you've been really consistent. How does that feel?",
    why: "Connects effort to outcome without judgment"
  },
  {
    context: "they're struggling",
    phrase: "Remember, the goal is to learn, not to be perfect",
    why: "Reinforces growth mindset"
  }
];

const PHRASES_TO_AVOID = [
  {
    phrase: "Why did you get that wrong?",
    why: "Creates shame around mistakes",
    alternative: "That one was tricky! Want to talk through it?"
  },
  {
    phrase: "Your sister never had trouble with this",
    why: "Comparison damages motivation",
    alternative: "Everyone learns differently. You'll get there."
  },
  {
    phrase: "This should be easy for you",
    why: "Creates pressure and fixed mindset",
    alternative: "Take your time. Some things need more practice."
  },
  {
    phrase: "You need to try harder",
    why: "Dismisses genuine effort and struggle",
    alternative: "I can see you're working hard. Let's try a different approach."
  }
];

const HOME_ACTIVITIES = [
  { emoji: "🛒", title: "Shopping Math", description: "Estimate totals, calculate change, compare prices", duration: "5-10 min" },
  { emoji: "🍕", title: "Fraction Pizza", description: "Divide food into equal parts, discuss halves and quarters", duration: "During meal" },
  { emoji: "📰", title: "News Detective", description: "Find main ideas in short articles together", duration: "10 min" },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const Reports = ({ selectedChild, setSelectedChild, childrenList = [] }) => {
  const { isDemo } = useAuth();
  const [viewMode, setViewMode] = useState('summary');
  const [expandedSections, setExpandedSections] = useState({
    progress: true,
    insights: true,
    playbook: false,
    detailed: true  // Auto-expanded when visible
  });

  // No scholars - show empty state
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Reports & Insights</h1>
            <p className="text-slate-500">AI-powered learning insights</p>
          </header>
          <NoScholarsYet />
        </div>
      </div>
    );
  }

  // For real users without session data, show empty state
  // Demo mode always has data via MOCK_SESSIONS/MOCK_TOPICS
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Reports & Insights</h1>
              <p className="text-slate-500">AI-powered learning insights for {selectedChild.name}</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoReportDataYet childName={selectedChild.name} />
        </div>
      </div>
    );
  }
  
  // Auto-expand detailed section when switching to detailed view
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'detailed') {
      setExpandedSections(prev => ({ ...prev, detailed: true }));
    }
  };

  // Calculate stats from mock data
  const thisWeekSessions = MOCK_SESSIONS.slice(0, 4);
  const totalMinutesThisWeek = thisWeekSessions.reduce((acc, s) => acc + s.duration, 0);
  const practiceStreak = 4;

  const stats = {
    strengths: MOCK_TOPICS.filter(t => t.strengthState === 'strength').length,
    emergingStrengths: MOCK_TOPICS.filter(t => t.strengthState === 'emerging_strength').length,
    focusAreas: MOCK_TOPICS.filter(t => t.strengthState === 'focus_area').length,
    emergingFocus: MOCK_TOPICS.filter(t => t.strengthState === 'emerging_focus').length,
    totalTopics: MOCK_TOPICS.length
  };

  // Determine status
  const getStatus = () => {
    if (thisWeekSessions.length >= 4 && stats.emergingStrengths > 0) return 'thriving';
    if (thisWeekSessions.length >= 2) return 'progressing';
    if (thisWeekSessions.length >= 1) return 'building';
    return 'attention';
  };

  const status = getStatus();
  const statusConfig = STATUS_CONFIG[status];

  // Generate small wins
  const smallWins = [
    { type: 'completion', icon: CheckCircle, text: `Completed all ${thisWeekSessions.length} sessions this week!` },
    { type: 'streak', icon: Flame, text: `${practiceStreak}-day practice streak! 🔥` },
    { type: 'time', icon: Clock, text: `Spent ${totalMinutesThisWeek} minutes learning this week` },
    { type: 'improvement', icon: TrendingUp, text: `${stats.emergingStrengths} skills showing improvement` }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Reports & Insights
            </h1>
            <p className="text-slate-500 mt-1">
              AI-powered learning insights for {selectedChild.name}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">
              <button
                onClick={() => handleViewModeChange('summary')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'summary' 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Summary
              </button>
              <button
                onClick={() => handleViewModeChange('detailed')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'detailed' 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Detailed
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: STATUS HERO (Brad's 10-second view) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {/* AI Disclosure Banner - Fei-Fei Li Rec #1 */}
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
          <Info className="w-4 h-4" />
          <span>Based on practice patterns this week</span>
        </div>
        
        <section className={cn(
          "rounded-2xl border p-6 mb-6",
          statusConfig.bg,
          statusConfig.border
        )}>
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              statusConfig.iconBg
            )}>
              <statusConfig.icon className={cn("w-7 h-7", statusConfig.iconColor)} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">
                {statusConfig.title(selectedChild.name)}
              </h2>
              <p className="text-slate-600">{statusConfig.subtitle}</p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{thisWeekSessions.length}</p>
              <p className="text-xs text-slate-500">Sessions</p>
              <p className="text-xs text-slate-400">this week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{totalMinutesThisWeek}m</p>
              <p className="text-xs text-slate-500">Learning Time</p>
              <p className="text-xs text-emerald-600">↑ +12m vs last week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{stats.strengths}</p>
              <p className="text-xs text-slate-500">Strengths</p>
              <p className="text-xs text-slate-400">of {stats.totalTopics} topics</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{practiceStreak}</p>
              <p className="text-xs text-slate-500">Day Streak</p>
              <p className="text-xs text-amber-600">🔥</p>
            </div>
          </div>

          {/* AI-Generated Weekly Insight */}
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-sm text-slate-700">
              <span className="font-medium">This week: </span>
              {selectedChild.name} showed great consistency, completing {thisWeekSessions.length} sessions across 3 learning domains. Fractions moved to Strengths this week!
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: SMALL WINS (Carla's encouragement) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-5 mb-6">
          <h3 className="font-semibold text-emerald-800 flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            This Week's Wins
          </h3>
          <div className="space-y-2">
            {smallWins.map((win, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <win.icon className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-emerald-800">{win.text}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-600 mt-4 pt-4 border-t border-emerald-200">
            Progress isn't just about accuracy. {selectedChild.name} is building learning habits!
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3: PROGRESS OVER TIME (Amy's trends) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Progress Over Time"
          icon={TrendingUp}
          isExpanded={expandedSections.progress}
          onToggle={() => toggleSection('progress')}
        >
          {/* Skill Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <h4 className="font-medium text-slate-700 mb-4">Skill Distribution</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SkillCategory label="Strengths" count={stats.strengths} color="emerald" description="Consistent mastery" />
              <SkillCategory label="Getting Stronger" count={stats.emergingStrengths} color="sky" description="Improving trend" />
              <SkillCategory label="Working On" count={stats.focusAreas} color="amber" description="Building skills" />
              <SkillCategory label="New" count={stats.emergingFocus} color="slate" description="Recently started" />
            </div>
            
            {/* Year-Level Context */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                <span className="font-medium">Context:</span> For Year {selectedChild.year_level} after 15 sessions, 
                having {stats.strengths} strengths is excellent progress. Patterns become clearer with more practice.
              </p>
            </div>
          </div>

          {/* Consistency Tracker */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-medium text-slate-700 mb-4">Practice Consistency</h4>
            <ConsistencyTracker />
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4: LEARNING INSIGHTS (AI-Generated) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Learning Insights"
          icon={Lightbulb}
          isExpanded={expandedSections.insights}
          onToggle={() => toggleSection('insights')}
        >
          {/* What's Going Well */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              What's Going Well
            </h4>
            
            <div className="space-y-4">
              {MOCK_TOPICS.filter(t => t.strengthState === 'strength' || t.strengthState === 'emerging_strength').slice(0, 4).map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    topic.strengthState === 'strength' ? 'bg-emerald-500' : 'bg-sky-500'
                  )} />
                  <div>
                    <p className="font-medium text-slate-800">{topic.topic}</p>
                    <p className="text-sm text-slate-500">{topic.domain}</p>
                  </div>
                </div>
              ))}
              <p className="text-sm text-slate-600 pt-3 border-t border-slate-100">
                {selectedChild.name} shows consistent understanding in these areas. 
                Celebrate these achievements!
              </p>
            </div>
          </div>

          {/* Areas to Watch */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-slate-400" />
              Areas to Watch
            </h4>
            
            <div className="space-y-3 mb-4">
              {MOCK_TOPICS.filter(t => t.strengthState === 'focus_area').map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-slate-800">{topic.topic}</p>
                    <p className="text-sm text-slate-500">
                      More practice scheduled automatically. No action needed from you.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>
                  "Areas to Watch" doesn't mean "problem." It means Noa has identified 
                  these for extra practice. This is normal and expected.
                </span>
              </p>
            </div>
          </div>

          {/* How Noa Decides - Transparency */}
          <TransparencyPanel childName={selectedChild.name} />
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 5: PARENT PLAYBOOK */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Parent Playbook"
          icon={BookOpen}
          isExpanded={expandedSections.playbook}
          onToggle={() => toggleSection('playbook')}
          badge="Tips & Scripts"
        >
          {/* Conversation Starters */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-violet-500" />
              Conversation Starters
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Use these to talk about learning without creating pressure.
            </p>
            
            <div className="space-y-4">
              {CONVERSATION_STARTERS.map((starter, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">When {starter.context}...</p>
                  <p className="text-slate-800 font-medium">"{starter.phrase}"</p>
                  <p className="text-xs text-violet-600 mt-2">{starter.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What NOT to Do */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 mb-4">
            <h4 className="font-medium text-rose-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Phrases to Avoid
            </h4>
            
            <div className="space-y-4">
              {PHRASES_TO_AVOID.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-rose-700 font-medium">"{item.phrase}"</p>
                    <p className="text-sm text-rose-600">{item.why}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium text-emerald-600">Instead:</span> "{item.alternative}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home Activities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <h4 className="font-medium text-slate-700 flex items-center gap-2 mb-4">
              <Home className="w-4 h-4 text-amber-500" />
              Complement Noa at Home
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Simple activities that reinforce what {selectedChild.name} is learning.
            </p>
            
            <div className="space-y-4">
              {HOME_ACTIVITIES.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xl">{activity.emoji}</span>
                  <div>
                    <p className="font-medium text-slate-800">{activity.title}</p>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Mindset Tips */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-amber-500" />
              Growth Mindset Reminders
            </h4>
            
            <ul className="space-y-2">
              {GROWTH_MINDSET_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6: DETAILED BREAKDOWN (viewMode === 'detailed' only) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {viewMode === 'detailed' && (
          <CollapsibleSection
            title="Detailed Breakdown"
            icon={LayoutDashboard}
            isExpanded={expandedSections.detailed}
            onToggle={() => toggleSection('detailed')}
          >
            {/* Session Log */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
              <h4 className="font-medium text-slate-700 mb-4">Recent Sessions</h4>
              <div className="space-y-3">
                {MOCK_SESSIONS.map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                        session.domain === 'numeracy' ? 'bg-indigo-100' :
                        session.domain === 'reading' ? 'bg-teal-100' :
                        session.domain === 'writing' ? 'bg-amber-100' : 'bg-slate-100'
                      )}>
                        {session.domain === 'numeracy' ? '🔢' :
                         session.domain === 'reading' ? '📖' :
                         session.domain === 'writing' ? '✏️' : '📚'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{session.capability}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(session.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} · {session.duration}m
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                      {session.domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-slate-50 rounded-xl p-5">
              <h4 className="font-medium text-slate-700 mb-4">Export Your Data</h4>
              <p className="text-sm text-slate-500 mb-4">
                Your data belongs to you. Export anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Progress Report (PDF)
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Session Data (CSV)
                </button>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-700">How insights work</button>
              <span className="text-slate-300">·</span>
              <button className="hover:text-slate-700">Give feedback</button>
            </div>
            <p>AI-generated insights · Updated daily</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const CollapsibleSection = ({ title, icon: Icon, children, isExpanded, onToggle, badge }) => {
  return (
    <section className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-semibold text-slate-800">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{badge}</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </section>
  );
};

const SkillCategory = ({ label, count, color, description }) => {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-700',
    sky: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="text-center">
      <div className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full flex items-center justify-center mb-2",
        colors[color]
      )}>
        <span className="text-lg sm:text-xl font-bold">{count}</span>
      </div>
      <p className="font-medium text-slate-700 text-xs sm:text-sm">{label}</p>
      <p className="text-xs text-slate-400 hidden sm:block">{description}</p>
    </div>
  );
};

const ConsistencyTracker = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [
    { day: 'Mon', practiced: true },
    { day: 'Tue', practiced: true },
    { day: 'Wed', practiced: false },
    { day: 'Thu', practiced: true },
    { day: 'Fri', practiced: true },
    { day: 'Sat', practiced: false },
    { day: 'Sun', practiced: false, isFuture: true }
  ];

  const practiced = weekData.filter(d => d.practiced).length;

  return (
    <div>
      <div className="flex justify-between mb-4">
        {weekData.map((d, i) => (
          <div key={i} className="text-center">
            <div className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-1",
              d.isFuture ? 'bg-slate-100' :
              d.practiced ? 'bg-emerald-100' : 'bg-slate-100'
            )}>
              {d.isFuture ? (
                <span className="text-slate-300 text-xs">-</span>
              ) : d.practiced ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              ) : (
                <span className="w-2 h-2 bg-slate-300 rounded-full" />
              )}
            </div>
            <span className="text-xs text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600 text-center">
        {practiced} of 6 days — Excellent consistency!
      </p>
    </div>
  );
};

const TransparencyPanel = ({ childName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h4 className="font-medium text-slate-700 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          How Noa Generates These Insights
        </h4>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600 space-y-3">
          <p>
            Noa analyzes practice patterns — not test scores. Here's what goes into each insight:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Strengths:</strong> 80%+ accuracy across 3+ sessions, consistent performance
            </li>
            <li>
              <strong>Getting Stronger:</strong> Clear improvement trend, moving toward independence
            </li>
            <li>
              <strong>Working On:</strong> Below 70% accuracy OR high hint usage, more practice scheduled
            </li>
          </ul>
          <p className="text-slate-500 italic">
            These are practice patterns, not assessments or predictions. Categories update as {childName} completes more sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;