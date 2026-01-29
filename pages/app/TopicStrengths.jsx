// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/TopicStrengths.jsx
// PURPOSE: Deep topic insights with examples, Noa's plan, persona-aware design
// NOW: Connected to real data with empty states
// VERSION: 3.0 - Schema aligned (camelCase fields)
// UPDATED: January 27, 2026
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  Search, 
  ArrowUp, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  BookOpen,
  Target,
  Sparkles,
  TrendingUp,
  Eye,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Brain,
  X,
  Info,
  Zap,
  Users
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';
import { STRENGTH_LABELS, CURRICULUM } from '../../lib/copy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-indigo-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">No Scholars Yet</h2>
    <p className="text-slate-500 max-w-sm">
      Add a scholar to start tracking their topic strengths.
    </p>
  </div>
);

const NoTopicDataYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Brain className="w-8 h-8 text-violet-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      Noa is still learning about {childName}
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      After a few sessions, you'll see which topics are strengths and which need more practice.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Usually takes 3-5 sessions</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MOCK DATA - Enhanced with deep topic details
// Schema v3 aligned: strengthState, sessionsCount (camelCase)
// ═══════════════════════════════════════════════════════════════

const MOCK_TOPICS = [
  { 
    id: 1, 
    topic: 'Fractions', 
    domain: 'Numeracy', 
    strengthState: 'strength', 
    trend: 'improving', 
    sessionsCount: 5,
    accuracy: 85,
    lastPracticed: '2026-01-25',
    curriculumCode: 'AC9M5N01',
    description: 'Understanding and comparing fractions, including equivalent fractions and mixed numbers.',
    exampleQuestions: [
      'Which fraction is larger: 3/4 or 2/3?',
      'Convert 7/4 to a mixed number',
      'Find an equivalent fraction for 2/5'
    ],
    whyThisCategory: 'Emma answered 85% correctly over 5 sessions with minimal hints. She shows strong understanding of comparing fractions and can convert between forms.',
    recentObservations: [
      'Confidently compares fractions with different denominators',
      'Quickly identifies equivalent fractions',
      'Occasionally pauses on mixed number conversions'
    ],
    noaPlan: 'Continue to reinforce with increasingly complex comparisons. Will introduce fraction operations next.',
    yearLevelContext: 'At Year 5, students should compare fractions with related denominators. Emma is performing above typical expectations.'
  },
  { 
    id: 2, 
    topic: 'Identifying Main Ideas', 
    domain: 'Reading', 
    strengthState: 'strength', 
    trend: 'stable', 
    sessionsCount: 3,
    accuracy: 82,
    lastPracticed: '2026-01-24',
    curriculumCode: 'AC9E5LY03',
    description: 'Locating and summarising the main idea in paragraphs and short texts.',
    exampleQuestions: [
      'What is the main idea of this paragraph?',
      'Which sentence best summarises the text?',
      'What is the author trying to tell us?'
    ],
    whyThisCategory: 'Consistent accuracy across different text types. Emma can distinguish between main ideas and supporting details.',
    recentObservations: [
      'Strong with narrative texts',
      'Identifies key information efficiently',
      'Good at eliminating distractor options'
    ],
    noaPlan: 'Maintain with periodic practice. Will integrate with inference questions.',
    yearLevelContext: 'Year 5 expectation. Emma demonstrates solid comprehension skills typical for her level.'
  },
  { 
    id: 3, 
    topic: 'Persuasive Devices', 
    domain: 'Writing', 
    strengthState: 'strength', 
    trend: 'improving', 
    sessionsCount: 4,
    accuracy: 88,
    lastPracticed: '2026-01-23',
    curriculumCode: 'AC9E5LY06',
    description: 'Recognising and using persuasive techniques like rhetorical questions, emotive language, and repetition.',
    exampleQuestions: [
      'Which technique is the author using: "Don\'t you want a cleaner planet?"',
      'Identify the emotive words in this advertisement',
      'How does repetition strengthen this argument?'
    ],
    whyThisCategory: 'Emma shows excellent recognition of persuasive techniques and can explain their purpose.',
    recentObservations: [
      'Quickly identifies rhetorical questions',
      'Understands emotional appeal well',
      'Can explain why techniques are effective'
    ],
    noaPlan: 'Will begin applying these techniques in writing tasks.',
    yearLevelContext: 'Above Year 5 expectations. Shows sophisticated understanding of author intent.'
  },
  { 
    id: 4, 
    topic: '2D Shapes', 
    domain: 'Numeracy', 
    strengthState: 'emerging_strength', 
    trend: 'improving', 
    sessionsCount: 2,
    accuracy: 75,
    lastPracticed: '2026-01-22',
    curriculumCode: 'AC9M5SP01',
    description: 'Properties of 2D shapes including angles, sides, symmetry, and classification.',
    exampleQuestions: [
      'How many lines of symmetry does a regular hexagon have?',
      'What type of triangle has all sides equal?',
      'Which shape has exactly 4 right angles?'
    ],
    whyThisCategory: 'Accuracy improved from 60% to 75% over 2 sessions. Emma is building confidence with shape properties.',
    recentObservations: [
      'Improving with symmetry questions',
      'Solid on basic shape identification',
      'Working on angle properties'
    ],
    noaPlan: 'More practice on angle types and symmetry. Building toward composite shapes.',
    yearLevelContext: 'On track for Year 5. Shape properties develop across Years 4-6.'
  },
  { 
    id: 5, 
    topic: 'Vocabulary in Context', 
    domain: 'Reading', 
    strengthState: 'emerging_strength', 
    trend: 'stable', 
    sessionsCount: 4,
    accuracy: 72,
    lastPracticed: '2026-01-21',
    curriculumCode: 'AC9E5LA04',
    description: 'Using context clues to determine meaning of unfamiliar words.',
    exampleQuestions: [
      'Based on the sentence, what does "reluctant" most likely mean?',
      'Which word could replace "enormous" in this context?',
      'What context clues help you understand "peculiar"?'
    ],
    whyThisCategory: 'Steady improvement observed. Emma uses context effectively but sometimes misses subtle clues.',
    recentObservations: [
      'Good at using surrounding sentences',
      'Sometimes rushes to answer',
      'Improving with practice'
    ],
    noaPlan: 'Focus on slowing down to examine all context clues. Will introduce more challenging vocabulary.',
    yearLevelContext: 'Typical Year 5 development. Vocabulary skills continue building through Year 6.'
  },
  { 
    id: 6, 
    topic: 'Sentence Structure', 
    domain: 'Grammar & Punctuation', 
    strengthState: 'emerging_strength', 
    trend: 'stable', 
    sessionsCount: 5,
    accuracy: 70,
    lastPracticed: '2026-01-20',
    curriculumCode: 'AC9E5LA08',
    description: 'Understanding sentence types, clauses, and how to combine sentences effectively.',
    exampleQuestions: [
      'Which sentence is a compound sentence?',
      'Add a subordinate clause to this sentence',
      'How can these two sentences be combined?'
    ],
    whyThisCategory: 'Consistent performance around 70%. Emma understands basics but needs practice with complex structures.',
    recentObservations: [
      'Confident with simple and compound sentences',
      'Working on complex sentences with clauses',
      'Benefits from examples before attempting'
    ],
    noaPlan: 'Continue targeted practice on subordinate clauses. Building toward more sophisticated writing.',
    yearLevelContext: 'Year 5 grammar expectations include clause knowledge. Emma is developing appropriately.'
  },
  { 
    id: 7, 
    topic: 'Multi-step Word Problems', 
    domain: 'Numeracy', 
    strengthState: 'focus_area', 
    trend: 'stable', 
    sessionsCount: 6,
    accuracy: 58,
    lastPracticed: '2026-01-25',
    curriculumCode: 'AC9M5N09',
    description: 'Solving problems that require multiple operations and careful reading.',
    exampleQuestions: [
      'Sarah has $20. She buys 3 items at $4.50 each. How much change does she get?',
      'A bus carries 45 passengers. At stop 1, 12 get off and 8 get on. At stop 2, 15 get off. How many are on the bus?',
      'Tom reads 25 pages daily for 5 days, then 30 pages for 3 days. How many pages total?'
    ],
    whyThisCategory: 'Emma finds it challenging to identify all steps needed. Often completes first operation correctly but misses subsequent steps.',
    recentObservations: [
      'Strong at single-step problems',
      'Sometimes misses hidden questions',
      'Benefits from breaking down the problem',
      'Improving when encouraged to re-read'
    ],
    noaPlan: 'Next 3 sessions will focus specifically on problem breakdown strategies. Will use scaffolded hints to build step-identification skills.',
    yearLevelContext: 'Multi-step problems are challenging for many Year 5 students. This is a common focus area.'
  },
  { 
    id: 8, 
    topic: 'Author\'s Purpose', 
    domain: 'Reading', 
    strengthState: 'focus_area', 
    trend: 'stable', 
    sessionsCount: 3,
    accuracy: 55,
    lastPracticed: '2026-01-19',
    curriculumCode: 'AC9E5LY05',
    description: 'Understanding why an author wrote a text (to inform, persuade, entertain, or explain).',
    exampleQuestions: [
      'Why did the author most likely write this article?',
      'What is the author\'s purpose: to inform, persuade, or entertain?',
      'How do you know this text was written to persuade?'
    ],
    whyThisCategory: 'Emma can identify obvious purposes but struggles when texts have mixed purposes or subtle intent.',
    recentObservations: [
      'Clear on entertainment texts',
      'Sometimes confuses inform vs. persuade',
      'Needs to look for author clues'
    ],
    noaPlan: 'Will practice distinguishing between inform and persuade using clear examples, then progress to mixed-purpose texts.',
    yearLevelContext: 'Author\'s purpose deepens in Years 5-6. Common for students to need practice distinguishing purposes.'
  },
  { 
    id: 9, 
    topic: 'Figurative Language', 
    domain: 'Writing', 
    strengthState: 'emerging_focus', 
    trend: 'improving', 
    sessionsCount: 1,
    accuracy: 65,
    lastPracticed: '2026-01-18',
    curriculumCode: 'AC9E5LE04',
    description: 'Understanding and using similes, metaphors, personification, and hyperbole.',
    exampleQuestions: [
      'Which sentence contains a metaphor?',
      'What two things are being compared in this simile?',
      '"The wind whispered through the trees" — what technique is this?'
    ],
    whyThisCategory: 'Only 1 session so far. Emma shows promise but needs more practice to establish patterns.',
    recentObservations: [
      'Recognised similes easily',
      'Learning to spot metaphors',
      'Engaged and curious about techniques'
    ],
    noaPlan: 'More exposure needed. Next 2 sessions will include figurative language questions to build recognition.',
    yearLevelContext: 'Year 5 introduces figurative language formally. Emma is at the beginning of this learning journey.'
  },
  { 
    id: 10, 
    topic: 'Punctuation Rules', 
    domain: 'Grammar & Punctuation', 
    strengthState: 'emerging_focus', 
    trend: 'stable', 
    sessionsCount: 2,
    accuracy: 60,
    lastPracticed: '2026-01-17',
    curriculumCode: 'AC9E5LA10',
    description: 'Correct use of commas, apostrophes, quotation marks, and other punctuation.',
    exampleQuestions: [
      'Where should the comma go in this sentence?',
      'Which sentence uses the apostrophe correctly?',
      'Add quotation marks to show direct speech'
    ],
    whyThisCategory: 'New topic with limited practice. Early results show areas to develop, particularly with commas in lists and apostrophes.',
    recentObservations: [
      'Good with full stops and question marks',
      'Working on comma placement',
      'Apostrophe rules need reinforcement'
    ],
    noaPlan: 'Will systematically cover comma rules, then apostrophes. Building foundational punctuation skills.',
    yearLevelContext: 'Punctuation mastery develops over Years 4-7. Emma is building essential skills.'
  }
];

// Noa's upcoming focus plan
const NOAS_PLAN = {
  headline: "Noa's Focus for the Next Few Sessions",
  description: "Based on Emma's practice patterns, here's what Noa will prioritise to build confidence and understanding:",
  focusAreas: [
    {
      topic: 'Multi-step Word Problems',
      domain: 'Numeracy',
      sessionsCount: 3,
      strategy: 'Breaking down complex problems into manageable steps',
      activities: [
        'Identify all the questions within a problem',
        'Practice circling key numbers and operations',
        'Work through scaffolded examples with hints'
      ],
      expectedOutcome: 'Build systematic approach to multi-step problems'
    },
    {
      topic: 'Author\'s Purpose',
      domain: 'Reading',
      sessionsCount: 2,
      strategy: 'Clear examples contrasting inform vs. persuade',
      activities: [
        'Compare two texts on same topic with different purposes',
        'Hunt for persuasive language clues',
        'Identify author word choices'
      ],
      expectedOutcome: 'Confidently distinguish text purposes'
    },
    {
      topic: 'Punctuation Rules',
      domain: 'Grammar',
      sessionsCount: 2,
      strategy: 'Systematic comma and apostrophe practice',
      activities: [
        'Comma rules: lists, clauses, introductions',
        'Apostrophe rules: possession vs. contraction',
        'Editing exercises to spot errors'
      ],
      expectedOutcome: 'Reliable punctuation in own writing'
    }
  ],
  parentNote: "You don't need to do anything extra. Noa will automatically include these focus areas in upcoming sessions, adjusting based on how Emma responds."
};

// ═══════════════════════════════════════════════════════════════
// CATEGORY STYLES
// ═══════════════════════════════════════════════════════════════

const CATEGORY_CONFIG = {
  strength: {
    label: STRENGTH_LABELS.strength,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    borderAccent: 'border-l-emerald-500',
    text: 'text-emerald-700',
    icon: Sparkles,
    iconBg: 'bg-emerald-100',
    description: 'Topics where Emma shows consistent understanding',
    parentTip: 'Celebrate these wins! These represent real progress.'
  },
  emerging_strength: {
    label: STRENGTH_LABELS.emerging_strength,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    borderAccent: 'border-l-sky-500',
    text: 'text-sky-700',
    icon: TrendingUp,
    iconBg: 'bg-sky-100',
    description: 'Topics showing clear improvement trends',
    parentTip: 'Great momentum! Continued practice will cement these skills.'
  },
  focus_area: {
    label: STRENGTH_LABELS.focus_area,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    borderAccent: 'border-l-amber-500',
    text: 'text-amber-700',
    icon: Target,
    iconBg: 'bg-amber-100',
    description: 'Topics Noa is actively working on with Emma',
    parentTip: 'No action needed from you. Noa will prioritise these automatically.'
  },
  emerging_focus: {
    label: STRENGTH_LABELS.emerging_focus,
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    borderAccent: 'border-l-slate-400',
    text: 'text-slate-600',
    icon: Eye,
    iconBg: 'bg-slate-100',
    description: 'Recently introduced topics still gathering data',
    parentTip: 'Too early to draw conclusions. More practice will reveal patterns.'
  }
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const TopicStrengths = ({ selectedChild, setSelectedChild, childrenList = [] }) => {
  const { isDemo } = useAuth();
  const [viewMode, setViewMode] = useState('summary');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    strength: true,
    emerging_strength: true,
    focus_area: true,
    emerging_focus: false
  });

  // No scholars - show empty state
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Topic Strengths</h1>
            <p className="text-slate-500">Deep insights into learning patterns</p>
          </header>
          <NoScholarsYet />
        </div>
      </div>
    );
  }

  // For real users without session data, show empty state
  // Demo mode always has data via MOCK_TOPICS
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Topic Strengths</h1>
              <p className="text-slate-500">Deep insights into {selectedChild.name}'s learning</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoTopicDataYet childName={selectedChild.name} />
        </div>
      </div>
    );
  }

  // Filter topics
  const filteredTopics = MOCK_TOPICS.filter(topic => {
    const matchesFilter = activeFilter === 'all' || topic.strengthState === activeFilter;
    const matchesSearch = !searchQuery || 
      topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group by category
  const groupedTopics = {
    strength: filteredTopics.filter(t => t.strengthState === 'strength'),
    emerging_strength: filteredTopics.filter(t => t.strengthState === 'emerging_strength'),
    focus_area: filteredTopics.filter(t => t.strengthState === 'focus_area'),
    emerging_focus: filteredTopics.filter(t => t.strengthState === 'emerging_focus')
  };

  // Counts
  const counts = {
    all: MOCK_TOPICS.length,
    strength: MOCK_TOPICS.filter(t => t.strengthState === 'strength').length,
    emerging_strength: MOCK_TOPICS.filter(t => t.strengthState === 'emerging_strength').length,
    focus_area: MOCK_TOPICS.filter(t => t.strengthState === 'focus_area').length,
    emerging_focus: MOCK_TOPICS.filter(t => t.strengthState === 'emerging_focus').length
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Topic Strengths</h1>
            <p className="text-slate-500 mt-1">
              Deep insights into {selectedChild.name}'s learning across all curriculum areas
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

        {/* SUMMARY HERO */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-800">This Week's Learning Snapshot</h2>
              <p className="text-slate-600 mt-1">
                {selectedChild.name} has <span className="font-semibold text-emerald-600">{counts.strength} strengths</span> and 
                <span className="font-semibold text-sky-600"> {counts.emerging_strength} skills improving</span>. 
                Noa is actively working on <span className="font-semibold text-amber-600">{counts.focus_area} focus areas</span>.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <QuickStat label={STRENGTH_LABELS.strength} count={counts.strength} color="emerald" />
            <QuickStat label={STRENGTH_LABELS.emerging_strength} count={counts.emerging_strength} color="sky" />
            <QuickStat label={STRENGTH_LABELS.focus_area} count={counts.focus_area} color="amber" />
            <QuickStat label={STRENGTH_LABELS.emerging_focus} count={counts.emerging_focus} color="slate" />
          </div>
        </section>

        {/* CATEGORY LEGEND */}
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            How to read this
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-slate-700">{STRENGTH_LABELS.strength}</span>
                <span className="text-slate-500 text-sm"> — skills your child is consistently comfortable with</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-slate-700">{STRENGTH_LABELS.emerging_strength}</span>
                <span className="text-slate-500 text-sm"> — improving with practice</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-slate-700">{STRENGTH_LABELS.focus_area}</span>
                <span className="text-slate-500 text-sm"> — best next skills to build</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-slate-700">{STRENGTH_LABELS.emerging_focus}</span>
                <span className="text-slate-500 text-sm"> — skills we're keeping an eye on</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">
            These are learning signals, not scores. Categories update as {selectedChild.name} completes more practice.
          </p>
        </section>

        {/* NOA'S PLAN */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{NOAS_PLAN.headline}</h2>
              <p className="text-slate-600 mt-1">{NOAS_PLAN.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {NOAS_PLAN.focusAreas.map((area, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{area.topic}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{area.domain}</span>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">{area.sessionsCount} sessions planned</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{area.strategy}</p>
                {viewMode === 'detailed' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">What Noa will do:</p>
                    <ul className="space-y-1">
                      {area.activities.map((activity, j) => (
                        <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-indigo-600 mt-2">
                      <span className="font-medium">Expected outcome:</span> {area.expectedOutcome}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              {NOAS_PLAN.parentNote}
            </p>
          </div>
        </section>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill label="All" count={counts.all} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
            <FilterPill label={STRENGTH_LABELS.strength} count={counts.strength} active={activeFilter === 'strength'} onClick={() => setActiveFilter('strength')} color="emerald" />
            <FilterPill label={STRENGTH_LABELS.emerging_strength} count={counts.emerging_strength} active={activeFilter === 'emerging_strength'} onClick={() => setActiveFilter('emerging_strength')} color="sky" />
            <FilterPill label={STRENGTH_LABELS.focus_area} count={counts.focus_area} active={activeFilter === 'focus_area'} onClick={() => setActiveFilter('focus_area')} color="amber" />
          </div>
        </div>

        {/* TOPIC CATEGORIES */}
        <div className="space-y-6">
          {Object.entries(groupedTopics).map(([category, topics]) => {
            if (topics.length === 0) return null;
            const config = CATEGORY_CONFIG[category];
            const Icon = config.icon;
            const isExpanded = expandedCategories[category];
            
            return (
              <section key={category} className={cn("rounded-2xl border", config.border, config.bg)}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.iconBg)}>
                      <Icon className={cn("w-5 h-5", config.text)} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{config.label}</h3>
                        <span className={cn("text-sm font-medium", config.text)}>{topics.length} topics</span>
                      </div>
                      <p className="text-sm text-slate-500">{config.description}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="mb-4 p-3 bg-white/60 rounded-lg border border-slate-200/50">
                      <p className="text-sm text-slate-600 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span><strong>For parents:</strong> {config.parentTip}</span>
                      </p>
                    </div>
                    
                    <div className="grid gap-3">
                      {topics.map(topic => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          config={config}
                          viewMode={viewMode}
                          onViewDetails={() => setSelectedTopic(topic)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* CURRICULUM NOTE */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-lg text-slate-800 mb-2">About Topic Mapping</h3>
          <p className="text-slate-600 mb-4">
            All topics are aligned with the Australian Curriculum v9.0, ensuring {selectedChild.name} is building 
            the right skills for Year {selectedChild.yearLevel}. Noa identifies patterns by observing responses 
            across multiple sessions — not from single answers.
          </p>
          <p className="text-sm text-slate-500 pt-4 border-t border-slate-100">
            {CURRICULUM.INLINE} Categories update as {selectedChild.name} completes more practice.
          </p>
        </div>

        {/* TOPIC DETAIL MODAL */}
        {selectedTopic && (
          <TopicDetailModal 
            topic={selectedTopic} 
            childName={selectedChild.name}
            onClose={() => setSelectedTopic(null)} 
          />
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const QuickStat = ({ label, count, color }) => {
  const colors = { emerald: 'text-emerald-600', sky: 'text-sky-600', amber: 'text-amber-600', slate: 'text-slate-500' };
  return (
    <div className="text-center">
      <p className={cn("text-2xl font-bold", colors[color])}>{count}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
};

const FilterPill = ({ label, count, active, onClick, color }) => {
  const baseColors = { emerald: 'bg-emerald-100 text-emerald-700', sky: 'bg-sky-100 text-sky-700', amber: 'bg-amber-100 text-amber-700' };
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-semibold rounded-full transition-colors",
        active ? "bg-slate-800 text-white" : color ? baseColors[color] : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {label} <span className="opacity-70 ml-1">{count}</span>
    </button>
  );
};

const TopicCard = ({ topic, config, viewMode, onViewDetails }) => {
  const TrendIcon = topic.trend === 'improving' ? ArrowUp : Minus;
  const trendColor = topic.trend === 'improving' ? 'text-emerald-600' : 'text-slate-400';
  
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 border-l-4 p-4", config.borderAccent)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-800">{topic.topic}</h4>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{topic.domain}</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">{topic.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <TrendIcon className={cn("w-4 h-4", trendColor)} />
              {topic.trend === 'improving' ? 'Improving' : 'Stable'}
            </span>
            <span>{topic.sessionsCount} sessions</span>
            <span>{topic.accuracy}% accuracy</span>
          </div>
          
          {viewMode === 'detailed' && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-medium">Why this category:</span> {topic.whyThisCategory}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Noa's plan:</span> {topic.noaPlan}
              </p>
            </div>
          )}
        </div>
        
        <button onClick={onViewDetails} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TopicDetailModal = ({ topic, childName, onClose }) => {
  const config = CATEGORY_CONFIG[topic.strengthState];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className={cn("p-6 border-b", config.bg, config.border)}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.text, config.border)}>{config.label}</span>
                <span className="text-xs text-slate-500">{topic.domain}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{topic.topic}</h2>
              <p className="text-slate-600 mt-1">{topic.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg"><p className="text-lg font-bold text-slate-800">{topic.accuracy}%</p><p className="text-xs text-slate-500">Accuracy</p></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><p className="text-lg font-bold text-slate-800">{topic.sessionsCount}</p><p className="text-xs text-slate-500">Sessions</p></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><p className="text-lg font-bold text-slate-800 capitalize">{topic.trend}</p><p className="text-xs text-slate-500">Trend</p></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><p className="text-lg font-bold text-slate-800">{new Date(topic.lastPracticed).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}</p><p className="text-xs text-slate-500">Last Practiced</p></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><HelpCircle className="w-4 h-4 text-slate-400" />Why is this a {config.label.toLowerCase()}?</h3>
            <p className="text-slate-600">{topic.whyThisCategory}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-slate-400" />Example Questions</h3>
            <p className="text-sm text-slate-500 mb-3">These are the types of questions {childName} sees for this topic:</p>
            <div className="space-y-2">
              {topic.exampleQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg text-slate-700 text-sm">"{q}"</div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-slate-400" />What Noa Has Observed</h3>
            <ul className="space-y-2">
              {topic.recentObservations.map((obs, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600"><CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />{obs}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-indigo-600" />What Noa Will Do Next</h3>
            <p className="text-indigo-700">{topic.noaPlan}</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-slate-400" />Year Level Context</h3>
            <p className="text-sm text-slate-600">{topic.yearLevelContext}</p>
            <p className="text-xs text-slate-400 mt-2">Curriculum code: {topic.curriculumCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicStrengths;