// ═══════════════════════════════════════════════════════════════
// FILE: lib/demoData.js
// PURPOSE: All demo/mock data in one place
// USAGE: Used when isDemoMode=true (demo@noa.app login)
// ═══════════════════════════════════════════════════════════════

// Demo account identifiers
export const DEMO_ACCOUNTS = {
  parentEmail: 'demo@noa.app',
  scholarCodes: ['DEMO01', 'DEMO02', 'DEMO03'],
};

// ═══════════════════════════════════════════════════════════════
// FAMILY & SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════

export const DEMO_FAMILY = {
  id: 'demo-family-001',
  primaryParentId: 'demo-parent-001',
  createdAt: new Date('2025-12-01'),
};

export const DEMO_SUBSCRIPTION = {
  plan: 'family',
  status: 'active',
  billingCycle: 'annual',
  nextBillingDate: '2027-01-26',
  amount: 290,
  includedScholars: 2,
  addOnScholars: 0,
  maxScholars: 5,
};

export const DEMO_SECONDARY_PARENTS = [];

// ═══════════════════════════════════════════════════════════════
// SCHOLARS
// ═══════════════════════════════════════════════════════════════

export const DEMO_SCHOLARS = [
  { 
    id: 'demo-scholar-001', 
    name: 'Emma', 
    yearLevel: 5, 
    school: 'Sydney Primary School', 
    loginCode: 'DEMO01', 
    avatarColor: 'bg-emerald-500',
    dateOfBirth: '2015-03-15',
  },
  { 
    id: 'demo-scholar-002', 
    name: 'Oliver', 
    yearLevel: 3, 
    school: 'Sydney Primary School', 
    loginCode: 'DEMO02', 
    avatarColor: 'bg-sky-500',
    dateOfBirth: '2017-08-22',
  },
];

// For App.jsx scholar view
export const DEMO_SCHOLAR_VIEW = {
  id: 'demo-scholar-001',
  name: 'Emma',
  yearLevel: 5,
  streak: 4,
  todaysFocus: ['Fractions', 'Reading'],
  sessionReady: true,
  isFirstSession: false,
};

// ═══════════════════════════════════════════════════════════════
// TOPIC PROGRESS
// ═══════════════════════════════════════════════════════════════

export const DEMO_TOPICS = {
  'demo-scholar-001': [
    { id: 't1', topic: 'Fractions', domain: 'Numeracy', strengthState: 'strength', sessionsCount: 5, trend: 'stable' },
    { id: 't2', topic: 'Decimals', domain: 'Numeracy', strengthState: 'strength', sessionsCount: 4, trend: 'improving' },
    { id: 't3', topic: 'Main Ideas', domain: 'Reading', strengthState: 'strength', sessionsCount: 3, trend: 'stable' },
    { id: 't4', topic: 'Persuasive Writing', domain: 'Writing', strengthState: 'emerging_strength', sessionsCount: 4, trend: 'improving' },
    { id: 't5', topic: 'Word Problems', domain: 'Numeracy', strengthState: 'focus_area', sessionsCount: 6, trend: 'improving' },
    { id: 't6', topic: 'Inference', domain: 'Reading', strengthState: 'emerging_strength', sessionsCount: 4, trend: 'improving' },
    { id: 't7', topic: 'Grammar Rules', domain: 'Grammar', strengthState: 'emerging_focus', sessionsCount: 2, trend: null },
    { id: 't8', topic: 'Author\'s Purpose', domain: 'Reading', strengthState: 'focus_area', sessionsCount: 3, trend: 'stable' },
  ],
  'demo-scholar-002': [
    { id: 't1', topic: 'Addition', domain: 'Numeracy', strengthState: 'strength', sessionsCount: 6, trend: 'stable' },
    { id: 't2', topic: 'Subtraction', domain: 'Numeracy', strengthState: 'strength', sessionsCount: 5, trend: 'stable' },
    { id: 't3', topic: 'Story Sequence', domain: 'Reading', strengthState: 'emerging_strength', sessionsCount: 3, trend: 'improving' },
    { id: 't4', topic: 'Sentence Writing', domain: 'Writing', strengthState: 'focus_area', sessionsCount: 4, trend: 'improving' },
  ],
};

// ═══════════════════════════════════════════════════════════════
// SESSIONS
// ═══════════════════════════════════════════════════════════════

export const DEMO_SESSIONS = {
  'demo-scholar-001': [
    { id: 's1', date: '2026-01-25', domain: 'numeracy', duration: 18, capability: 'Fractions & Decimals', accuracy: 85, confidence: 'high' },
    { id: 's2', date: '2026-01-24', domain: 'reading', duration: 15, capability: 'Main Ideas & Inference', accuracy: 78, confidence: 'moderate' },
    { id: 's3', date: '2026-01-23', domain: 'writing', duration: 20, capability: 'Persuasive Techniques', accuracy: 72, confidence: 'building' },
    { id: 's4', date: '2026-01-22', domain: 'numeracy', duration: 17, capability: 'Word Problems', accuracy: 65, confidence: 'building' },
    { id: 's5', date: '2026-01-20', domain: 'reading', duration: 16, capability: 'Vocabulary in Context', accuracy: 80, confidence: 'high' },
  ],
  'demo-scholar-002': [
    { id: 's1', date: '2026-01-25', domain: 'numeracy', duration: 15, capability: 'Addition Facts', accuracy: 90, confidence: 'high' },
    { id: 's2', date: '2026-01-23', domain: 'reading', duration: 12, capability: 'Story Sequence', accuracy: 75, confidence: 'moderate' },
    { id: 's3', date: '2026-01-21', domain: 'numeracy', duration: 14, capability: 'Subtraction', accuracy: 88, confidence: 'high' },
  ],
};

// ═══════════════════════════════════════════════════════════════
// WEEKLY STATS
// ═══════════════════════════════════════════════════════════════

export const DEMO_WEEKLY_STATS = {
  'demo-scholar-001': {
    thisWeek: {
      sessions: 4,
      totalMinutes: 68,
      topicsPracticed: ['Fractions', 'Decimals', 'Main Ideas', 'Word Problems'],
      domains: ['Numeracy', 'Reading'],
      strengths: 3,
      emergingStrengths: 2,
      focusAreas: 2,
      streak: 4,
      confidence: 72,
      accuracyAvg: 76,
    },
    lastWeek: {
      sessions: 3,
      totalMinutes: 52,
      strengths: 2,
      emergingStrengths: 2,
      focusAreas: 3,
      streak: 2,
      confidence: 68,
      accuracyAvg: 71,
    },
  },
  'demo-scholar-002': {
    thisWeek: {
      sessions: 3,
      totalMinutes: 41,
      topicsPracticed: ['Addition', 'Story Sequence', 'Subtraction'],
      domains: ['Numeracy', 'Reading'],
      strengths: 2,
      emergingStrengths: 1,
      focusAreas: 1,
      streak: 3,
      confidence: 80,
      accuracyAvg: 84,
    },
    lastWeek: {
      sessions: 2,
      totalMinutes: 28,
      strengths: 2,
      emergingStrengths: 1,
      focusAreas: 1,
      streak: 1,
      confidence: 75,
      accuracyAvg: 80,
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// CONFIDENCE TRACKING
// ═══════════════════════════════════════════════════════════════

export const DEMO_CONFIDENCE_DATA = {
  'demo-scholar-001': {
    overallScore: 72,
    trend: 'improving',
    signals: {
      persistence: 'high',
      engagement: 'high',
      hintUsage: 'minimal',
    },
    observations: [
      { id: 'o1', date: '2026-01-25', type: 'persistence', text: 'Stuck with a challenging fractions problem for 3 attempts before getting it right' },
      { id: 'o2', date: '2026-01-24', type: 'self_correction', text: 'Caught own mistake in reading comprehension and corrected without hints' },
      { id: 'o3', date: '2026-01-22', type: 'hesitation', text: 'Showed some hesitation on word problems, but pushed through' },
    ],
  },
  'demo-scholar-002': {
    overallScore: 80,
    trend: 'stable',
    signals: {
      persistence: 'moderate',
      engagement: 'high',
      hintUsage: 'moderate',
    },
    observations: [
      { id: 'o1', date: '2026-01-25', type: 'quick_response', text: 'Answered addition facts quickly and confidently' },
      { id: 'o2', date: '2026-01-23', type: 'hint_usage', text: 'Used hint on story sequence question, then got similar ones correct' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// AI SUMMARIES (Parent-facing)
// ═══════════════════════════════════════════════════════════════

export const DEMO_AI_SUMMARIES = {
  'demo-scholar-001': {
    weeklyWrap: "Emma had a strong week with 4 sessions totaling 68 minutes. She's showing real confidence with fractions and decimals, and her reading comprehension continues to grow. Word problems remain an area we're building — she's making progress but benefits from breaking problems into steps.",
    parentTip: "Ask Emma about a tricky problem she solved this week. Celebrating persistence builds confidence.",
    noaObservation: "Emma tends to work through challenging problems rather than giving up. This persistence is a great sign for long-term learning.",
  },
  'demo-scholar-002': {
    weeklyWrap: "Oliver completed 3 sessions this week, showing strong number facts and growing reading skills. He's quick with addition and subtraction, and his story comprehension is developing nicely.",
    parentTip: "Oliver responds well to encouragement. Try noticing when he sticks with something hard.",
    noaObservation: "Oliver works best in shorter focused bursts. His engagement stays high throughout sessions.",
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getDemoTopicsForScholar = (scholarId) => {
  return DEMO_TOPICS[scholarId] || [];
};

export const getDemoSessionsForScholar = (scholarId) => {
  return DEMO_SESSIONS[scholarId] || [];
};

export const getDemoStatsForScholar = (scholarId) => {
  return DEMO_WEEKLY_STATS[scholarId] || null;
};

export const getDemoConfidenceForScholar = (scholarId) => {
  return DEMO_CONFIDENCE_DATA[scholarId] || null;
};

export const getDemoSummaryForScholar = (scholarId) => {
  return DEMO_AI_SUMMARIES[scholarId] || null;
};

export const isDemoAccount = (email) => {
  return email === DEMO_ACCOUNTS.parentEmail;
};

export const isDemoScholarCode = (code) => {
  return DEMO_ACCOUNTS.scholarCodes.includes(code?.toUpperCase());
};
