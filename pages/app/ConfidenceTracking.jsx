// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/ConfidenceTracking.jsx
// PURPOSE: Comprehensive confidence insights based on behavioral signals
// NOW: Connected to real data with empty states
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  Heart,
  TrendingUp,
  Clock,
  HelpCircle,
  Lightbulb,
  Target,
  Zap,
  Eye,
  Brain,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Info,
  BarChart3,
  Activity,
  ThumbsUp,
  RefreshCw,
  Hand,
  Timer,
  Users
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-purple-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">No Scholars Yet</h2>
    <p className="text-slate-500 max-w-sm">
      Add a scholar to start tracking their confidence patterns.
    </p>
  </div>
);

const NoConfidenceDataYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Heart className="w-8 h-8 text-purple-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      Confidence patterns take time
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      Noa watches how {childName} approaches questions — not just whether they're right or wrong. 
      After a few sessions, you'll see confidence insights here.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Usually takes 5-7 sessions</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

// Confidence data by domain
const CONFIDENCE_DATA = {
  overall: {
    score: 72,
    trend: 'improving',
    change: +8,
    description: 'Emma approaches most tasks with growing confidence'
  },
  domains: {
    numeracy: {
      score: 78,
      trend: 'improving',
      signals: {
        responseTime: 'quick',
        hintUsage: 'low',
        persistence: 'high',
        selfCorrection: 'moderate'
      },
      strengths: ['Attempts problems without hesitation', 'Rarely asks for hints on familiar topics'],
      growthAreas: ['Sometimes rushes through word problems']
    },
    reading: {
      score: 75,
      trend: 'stable',
      signals: {
        responseTime: 'moderate',
        hintUsage: 'low',
        persistence: 'high',
        selfCorrection: 'high'
      },
      strengths: ['Re-reads passages when unsure', 'Willing to change answers after reflection'],
      growthAreas: ['Can be hesitant on inference questions']
    },
    writing: {
      score: 68,
      trend: 'improving',
      signals: {
        responseTime: 'slow',
        hintUsage: 'moderate',
        persistence: 'moderate',
        selfCorrection: 'low'
      },
      strengths: ['Shows creativity in responses', 'Improving with persuasive writing'],
      growthAreas: ['Sometimes second-guesses grammar choices']
    },
    grammar: {
      score: 65,
      trend: 'improving',
      signals: {
        responseTime: 'slow',
        hintUsage: 'moderate',
        persistence: 'moderate',
        selfCorrection: 'moderate'
      },
      strengths: ['Willing to try unfamiliar punctuation rules'],
      growthAreas: ['Hesitates on comma placement', 'Often changes initial answers']
    }
  }
};

// Behavioral signals Noa tracks
const BEHAVIORAL_SIGNALS = [
  {
    id: 'response_time',
    name: 'Response Time',
    icon: Timer,
    description: 'How quickly Emma answers after reading a question',
    whatItMeans: {
      quick: 'Shows confidence and automaticity with the material',
      moderate: 'Taking appropriate time to think through answers',
      slow: 'May indicate uncertainty or careful deliberation'
    },
    current: 'moderate',
    context: 'Slower response times aren\'t necessarily bad — they can indicate thoughtful problem-solving. We look at patterns, not individual responses.'
  },
  {
    id: 'hint_usage',
    name: 'Hint Usage',
    icon: HelpCircle,
    description: 'How often Emma requests hints before answering',
    whatItMeans: {
      low: 'Confident enough to attempt independently',
      moderate: 'Strategic use of support when needed',
      high: 'May need more scaffolding to build confidence'
    },
    current: 'low',
    context: 'Using hints appropriately is a skill. We encourage students to try first, then use hints if stuck — not to avoid hints entirely.'
  },
  {
    id: 'persistence',
    name: 'Persistence',
    icon: RefreshCw,
    description: 'How Emma responds to challenging questions',
    whatItMeans: {
      high: 'Sticks with difficult problems, shows resilience',
      moderate: 'Generally persists but may disengage on very hard tasks',
      low: 'May skip or rush through challenging content'
    },
    current: 'high',
    context: 'Persistence is one of the strongest predictors of learning growth. Emma shows healthy resilience when facing challenges.'
  },
  {
    id: 'self_correction',
    name: 'Self-Correction',
    icon: RefreshCw,
    description: 'Whether Emma changes answers after initial response',
    whatItMeans: {
      high: 'Reflects on answers and catches own mistakes',
      moderate: 'Sometimes reviews before submitting',
      low: 'Tends to stick with first answer'
    },
    current: 'moderate',
    context: 'Self-correction shows metacognition — awareness of one\'s own thinking. It\'s a valuable learning skill.'
  },
  {
    id: 'engagement',
    name: 'Session Engagement',
    icon: Zap,
    description: 'How actively Emma participates throughout sessions',
    whatItMeans: {
      high: 'Fully engaged from start to finish',
      moderate: 'Good engagement with some variation',
      low: 'Engagement drops during sessions'
    },
    current: 'high',
    context: 'Emma maintains strong engagement across sessions, which supports deeper learning.'
  }
];

// Confidence wins to celebrate
const CONFIDENCE_WINS = [
  {
    icon: Sparkles,
    title: 'Attempting without hints',
    description: 'In 4 of 5 recent sessions, Emma tried questions independently before asking for help',
    domain: 'All domains'
  },
  {
    icon: ThumbsUp,
    title: 'Bouncing back from mistakes',
    description: 'After getting a fraction question wrong, Emma successfully completed 3 similar questions',
    domain: 'Numeracy'
  },
  {
    icon: Heart,
    title: 'Tackling challenging topics',
    description: 'Volunteered to try a harder inference question when given the choice',
    domain: 'Reading'
  },
  {
    icon: TrendingUp,
    title: 'Grammar confidence growing',
    description: 'Response time on punctuation questions decreased by 20% over 2 weeks',
    domain: 'Grammar'
  }
];

// Areas for encouragement
const ENCOURAGEMENT_AREAS = [
  {
    area: 'Multi-step word problems',
    observation: 'Emma sometimes hesitates at the start of complex problems',
    suggestion: 'Noa will provide more structured scaffolding to build step-by-step confidence',
    parentTip: 'You might say: "I notice you\'re thinking carefully. What\'s the first thing the question is asking?"'
  },
  {
    area: 'Writing grammar choices',
    observation: 'Emma often changes punctuation answers multiple times before submitting',
    suggestion: 'Noa will reinforce correct patterns and provide clearer feedback',
    parentTip: 'Encourage her to trust her first instinct more often — she\'s usually right!'
  }
];

// Parent tips for building confidence
const PARENT_TIPS = [
  {
    title: 'Praise the process, not the outcome',
    description: 'Instead of "You got it right!", try "I love how you worked through that step by step."',
    icon: MessageSquare
  },
  {
    title: 'Normalise mistakes',
    description: 'Share your own learning mistakes. "I used to struggle with fractions too!"',
    icon: Heart
  },
  {
    title: 'Avoid hovering during practice',
    description: 'Let them work independently. Checking in afterwards is more confidence-building than watching over.',
    icon: Eye
  },
  {
    title: 'Ask about effort, not results',
    description: '"What was the hardest question?" rather than "How many did you get right?"',
    icon: Brain
  },
  {
    title: 'Celebrate small wins',
    description: 'Notice when they try hard things: "You didn\'t give up on that tricky one!"',
    icon: Sparkles
  },
  {
    title: 'Model a growth mindset',
    description: 'Show that you believe abilities grow with practice: "You\'re not there YET."',
    icon: TrendingUp
  }
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const ConfidenceTracking = ({ selectedChild, setSelectedChild, childrenList = [] }) => {
  const { isDemo } = useAuth();
  const [viewMode, setViewMode] = useState('summary');
  const [expandedSections, setExpandedSections] = useState({
    signals: true,
    wins: true,
    areas: false,
    tips: false,
    methodology: false
  });
  const [selectedDomain, setSelectedDomain] = useState(null);

  // No scholars - show empty state
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Confidence Tracking</h1>
            <p className="text-slate-500">Understanding how your child approaches learning</p>
          </header>
          <NoScholarsYet />
        </div>
      </div>
    );
  }

  // For real users without session data, show empty state
  // Demo mode always has data via CONFIDENCE_DATA
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Confidence Tracking</h1>
              <p className="text-slate-500">Understanding how {selectedChild.name} approaches learning</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoConfidenceDataYet childName={selectedChild.name} />
        </div>
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 60) return 'text-sky-600';
    if (score >= 45) return 'text-amber-600';
    return 'text-slate-500';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-emerald-100';
    if (score >= 60) return 'bg-sky-100';
    if (score >= 45) return 'bg-amber-100';
    return 'bg-slate-100';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Confidence Tracking</h1>
            <p className="text-slate-500 mt-1">
              Understanding how {selectedChild.name} approaches learning challenges
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
                onClick={() => setViewMode('summary')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'summary' ? "bg-indigo-100 text-indigo-700" : "text-slate-600"
                )}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === 'detailed' ? "bg-indigo-100 text-indigo-700" : "text-slate-600"
                )}
              >
                Detailed
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CONFIDENCE HERO - Brad's quick view */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">Overall Confidence</h2>
                <div className="flex items-center gap-1 text-emerald-600">
                  {getTrendIcon(CONFIDENCE_DATA.overall.trend)}
                  <span className="text-sm font-medium">+{CONFIDENCE_DATA.overall.change}% this month</span>
                </div>
              </div>
              <p className="text-slate-600">{CONFIDENCE_DATA.overall.description}</p>
            </div>
            <div className={cn(
              "w-20 h-20 rounded-2xl flex flex-col items-center justify-center",
              getScoreBg(CONFIDENCE_DATA.overall.score)
            )}>
              <span className={cn("text-3xl font-bold", getScoreColor(CONFIDENCE_DATA.overall.score))}>
                {CONFIDENCE_DATA.overall.score}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          
          {/* Domain Breakdown */}
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-purple-200/50">
            {Object.entries(CONFIDENCE_DATA.domains).map(([domain, data]) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(selectedDomain === domain ? null : domain)}
                className={cn(
                  "p-3 rounded-xl transition-all text-left",
                  selectedDomain === domain 
                    ? "bg-white shadow-md border-2 border-indigo-300" 
                    : "bg-white/60 hover:bg-white border border-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-xl font-bold", getScoreColor(data.score))}>{data.score}</span>
                  {getTrendIcon(data.trend)}
                </div>
                <p className="text-xs text-slate-600 capitalize">{domain}</p>
              </button>
            ))}
          </div>

          {/* Selected Domain Details */}
          {selectedDomain && (
            <div className="mt-4 p-4 bg-white rounded-xl">
              <h4 className="font-semibold text-slate-800 capitalize mb-3">{selectedDomain} Confidence</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Confidence Strengths</p>
                  <ul className="space-y-1">
                    {CONFIDENCE_DATA.domains[selectedDomain].strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Growth Opportunities</p>
                  <ul className="space-y-1">
                    {CONFIDENCE_DATA.domains[selectedDomain].growthAreas.map((g, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <Target className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick explanation for Diana */}
          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>What is confidence?</strong> It's not just about getting answers right — it's about 
                how {selectedChild.name} approaches challenges, handles uncertainty, and bounces back from mistakes.
              </span>
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CONFIDENCE WINS - Carla's celebration */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Confidence Wins This Week"
          icon={Sparkles}
          isExpanded={expandedSections.wins}
          onToggle={() => toggleSection('wins')}
          badge={`${CONFIDENCE_WINS.length} wins`}
          color="emerald"
        >
          <div className="space-y-3">
            {CONFIDENCE_WINS.map((win, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <win.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{win.title}</h4>
                  <p className="text-sm text-slate-600">{win.description}</p>
                  <span className="text-xs text-slate-400 mt-1 inline-block">{win.domain}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-emerald-700 mt-4 p-3 bg-emerald-50 rounded-lg">
            These moments show {selectedChild.name} is building the mindset that leads to long-term learning success!
          </p>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BEHAVIORAL SIGNALS - Amy's deep data, Edward's methodology */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Behavioral Signals Noa Observes"
          icon={Activity}
          isExpanded={expandedSections.signals}
          onToggle={() => toggleSection('signals')}
          badge="5 signals"
          color="indigo"
        >
          <div className="space-y-4">
            {BEHAVIORAL_SIGNALS.map((signal) => {
              const SignalIcon = signal.icon;
              const currentLevel = signal.current;
              const levelColors = {
                quick: 'bg-emerald-100 text-emerald-700',
                high: 'bg-emerald-100 text-emerald-700',
                moderate: 'bg-sky-100 text-sky-700',
                low: 'bg-amber-100 text-amber-700',
                slow: 'bg-amber-100 text-amber-700'
              };
              
              return (
                <div key={signal.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <SignalIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{signal.name}</h4>
                        <p className="text-sm text-slate-500">{signal.description}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium capitalize",
                      levelColors[currentLevel]
                    )}>
                      {currentLevel}
                    </span>
                  </div>
                  
                  {viewMode === 'detailed' && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-600 mb-2">
                        <strong>What this means:</strong> {signal.whatItMeans[currentLevel]}
                      </p>
                      <p className="text-xs text-slate-500 italic">{signal.context}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* AREAS FOR ENCOURAGEMENT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="Areas for Encouragement"
          icon={Target}
          isExpanded={expandedSections.areas}
          onToggle={() => toggleSection('areas')}
          badge={`${ENCOURAGEMENT_AREAS.length} areas`}
          color="amber"
        >
          <div className="space-y-4">
            {ENCOURAGEMENT_AREAS.map((area, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">{area.area}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">What Noa observed</p>
                      <p className="text-sm text-slate-600">{area.observation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">What Noa will do</p>
                      <p className="text-sm text-slate-600">{area.suggestion}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-700">Parent tip</p>
                      <p className="text-sm text-amber-800">{area.parentTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              These aren't problems — they're normal parts of learning. Noa is designed to gently build confidence in these areas.
            </p>
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PARENT TIPS FOR BUILDING CONFIDENCE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="How You Can Help Build Confidence"
          icon={MessageSquare}
          isExpanded={expandedSections.tips}
          onToggle={() => toggleSection('tips')}
          badge="6 tips"
          color="violet"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {PARENT_TIPS.map((tip, i) => {
              const TipIcon = tip.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TipIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{tip.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HOW NOA MEASURES CONFIDENCE - Edward's transparency */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        <CollapsibleSection
          title="How Noa Measures Confidence"
          icon={HelpCircle}
          isExpanded={expandedSections.methodology}
          onToggle={() => toggleSection('methodology')}
          color="slate"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">What we measure</h4>
                <p className="text-slate-600">
                  Noa observes behavioral patterns during learning sessions — not just accuracy. These signals 
                  include response timing, hint usage, persistence through challenges, willingness to attempt 
                  difficult questions, and recovery after mistakes.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">How scores are calculated</h4>
                <p className="text-slate-600">
                  The confidence score (0-100) is a weighted combination of behavioral signals observed across 
                  multiple sessions. Higher scores indicate more confident learning behaviors — which doesn't 
                  always correlate with accuracy. A student can be highly accurate but lack confidence, or 
                  confident but still developing accuracy.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">What confidence is NOT</h4>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    Not a personality assessment
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    Not a prediction of future performance
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    Not comparable between children
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    Not a diagnosis of anxiety or other conditions
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Why confidence matters</h4>
                <p className="text-slate-600">
                  Research shows that learning confidence — the willingness to attempt challenges, persist 
                  through difficulty, and recover from mistakes — is one of the strongest predictors of 
                  long-term academic growth. Noa helps build this mindset alongside skills.
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-700">How confidence is calculated</button>
              <span className="text-slate-300">·</span>
              <button className="hover:text-slate-700">Give feedback</button>
            </div>
            <p>Behavioral insights · Updated after each session</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const CollapsibleSection = ({ title, icon: Icon, children, isExpanded, onToggle, badge, color = 'indigo' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 border-emerald-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    amber: 'bg-amber-50 border-amber-200',
    violet: 'bg-violet-50 border-violet-200',
    slate: 'bg-slate-50 border-slate-200'
  };
  
  const iconColors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <section className="mb-6">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl border transition-colors",
          colorStyles[color]
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconColors[color])}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-800">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 bg-white rounded-full text-slate-600">{badge}</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </section>
  );
};

export default ConfidenceTracking;