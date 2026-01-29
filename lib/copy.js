/**
 * NOA Copy Constants — Single Source of Truth
 * 
 * All user-facing text centralized for consistency and easy updates.
 * 
 * DESIGN RULES (Ive):
 * - ONE empty state message everywhere
 * - ONE session complete message always
 * - NO color coding in copy (UI handles display)
 * 
 * SCHEMA COMPLIANCE:
 * - STRENGTH_LABELS maps to schema.strengthState
 * - TREND_LABELS maps to schema.trend (declining = null, never show)
 * - BASELINE.SESSIONS_NEEDED = 3 (matches schema)
 * 
 * @version 2.0
 * @date January 26, 2026
 */

// ═══════════════════════════════════════════════════════════════
// STRENGTH STATE LABELS
// Schema field: strengthState → UI display
// ═══════════════════════════════════════════════════════════════

export const STRENGTH_LABELS = {
  strength: "Strengths",
  emerging_strength: "Getting Stronger",
  focus_area: "Working On",
  emerging_focus: "Keep Watching"
};

// ═══════════════════════════════════════════════════════════════
// TREND LABELS
// Schema field: trend → UI display
// CRITICAL: 'declining' returns null — NEVER show to users
// ═══════════════════════════════════════════════════════════════

export const TREND_LABELS = {
  improving: "Improving",
  stable: "Stable",
  declining: null  // DO NOT DISPLAY — return null to hide
};

// ═══════════════════════════════════════════════════════════════
// BASELINE
// Schema: baselineComplete, totalSessionsCompleted
// ═══════════════════════════════════════════════════════════════

export const BASELINE = {
  SESSIONS_NEEDED: 3,
  
  HEADLINE: (childName) => 
    `We're getting to know how ${childName} approaches different skills.`,
  
  PROGRESS: (completed, needed) => 
    `Session ${completed} of ${needed}`,
  
  COMPLETE: "Patterns are forming as learning continues."
};

// ═══════════════════════════════════════════════════════════════
// HEADLINES
// Process-based, not evaluative (Wiliam requirement)
// ═══════════════════════════════════════════════════════════════

export const HEADLINE = {
  WITH_TOPICS: (childName, topics) => {
    if (!topics || topics.length === 0) {
      return `${childName}'s learning journey continues.`;
    }
    const topicList = topics.length === 1 
      ? topics[0]
      : topics.slice(0, -1).join(', ') + ' and ' + topics[topics.length - 1];
    return `This week, ${childName} practiced ${topicList.toLowerCase()}.`;
  },
  
  SUBTITLE: "Patterns forming as learning continues.",
  
  NO_SESSION_READY: "All caught up — next session tomorrow."
};

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// One message everywhere (Ive requirement)
// ═══════════════════════════════════════════════════════════════

export const EMPTY_STATE = "Patterns will form as learning continues.";

// ═══════════════════════════════════════════════════════════════
// SESSION COMPLETE
// One message, always (Ive requirement)
// ═══════════════════════════════════════════════════════════════

export const SESSION_COMPLETE = {
  TITLE: "Session complete.",
  SUBTITLE: "Great work today."
};

// ═══════════════════════════════════════════════════════════════
// AI DISCLOSURE
// Gebru requirement — visible where insights displayed
// ═══════════════════════════════════════════════════════════════

export const AI_DISCLOSURE = {
  // Footer text (shown in LearningOverview block)
  FOOTER: "AI-generated from practice patterns",
  
  // Header text for Reports (Fei-Fei Li Rec #1)
  HEADER: "Based on practice patterns this week",
  
  // Full explanation (shown in Settings > About)
  FULL: "Noa's AI identifies patterns in practice sessions to highlight areas of comfort and areas to build. These are learning signals based on practice — not assessments, diagnoses, or predictions.",
  
  // Link text
  LEARN_MORE: "How Noa works",
  
  // Accuracy tooltip (Fei-Fei Li Rec #3)
  ACCURACY_TOOLTIP: "Accuracy reflects practice performance. It doesn't capture understanding, effort, or growth.",
  
  // Early data disclaimer (Fei-Fei Li Rec #5)
  STILL_LEARNING: (childName) => `Noa is still getting to know ${childName}. Patterns will form after a few more sessions.`,
  SESSIONS_NEEDED_MESSAGE: "Usually takes 3-5 sessions for patterns to emerge."
};

// ═══════════════════════════════════════════════════════════════
// LIMITATIONS
// Gebru requirement — first-visit modal
// ═══════════════════════════════════════════════════════════════

export const LIMITATIONS = {
  TITLE: "Before you begin",
  
  INTRO: "Noa shows practice patterns based on AI analysis — not professional assessments.",
  
  CANNOT_TITLE: "Noa cannot tell you:",
  
  ITEMS: [
    "Whether your child has a learning difficulty",
    "How they will perform on tests",
    "Their \"true\" ability level"
  ],
  
  CTA: "Got it"
};

// ═══════════════════════════════════════════════════════════════
// CHILD PROTECTION
// Siegel requirement — first-visit modal
// ═══════════════════════════════════════════════════════════════

export const CHILD_PROTECTION = {
  TITLE: "One more thing",
  
  MESSAGE: "These insights are for you, not your child. Please don't discuss Noa categories with them or let them overhear.",
  
  CTA: "Continue to Dashboard"
};

// ═══════════════════════════════════════════════════════════════
// SIBLING COMPARISON
// Fei-Fei Li Rec #2 — discourage sibling comparison
// ═══════════════════════════════════════════════════════════════

export const SIBLING_COMPARISON = {
  TITLE: "About Comparing Children",
  SUBTITLE: "Each child's journey is unique",
  MESSAGE: "Each child's learning journey is unique. We recommend focusing on individual progress rather than comparisons between siblings. What matters is each child's growth from where they started — not how they compare to others."
};

// ═══════════════════════════════════════════════════════════════
// PARENT TIP
// Wiliam requirement — shown at session complete
// ═══════════════════════════════════════════════════════════════

export const PARENT_TIP = {
  LABEL: "One way to connect",
  
  TIPS: [
    "Ask what felt tricky today — and celebrate the effort.",
    "Talk through problems out loud together.",
    "Notice persistence: \"You stuck with that!\"",
    "Celebrate the process, not just the answer.",
    "Ask \"What did you figure out?\" instead of \"How many did you get right?\"",
    "Share that learning is hard for everyone — including adults."
  ]
};

// ═══════════════════════════════════════════════════════════════
// CURRICULUM DISCLAIMER
// ACER requirement — boundaries with ACARA/NAPLAN
// ═══════════════════════════════════════════════════════════════

export const CURRICULUM = {
  // Inline (shown on Topic Strengths page)
  INLINE: "These describe practice patterns — not curriculum levels.",
  
  // Full (shown in Settings > About)
  FULL: "Noa's topics are informed by Australian Curriculum v9.0. Categories describe practice patterns in Noa — they are not ACARA achievement levels or NAPLAN predictions.",
  
  // Non-endorsement
  DISCLAIMER: "Noa is not endorsed by or affiliated with ACARA, NAPLAN, or any Australian educational authority."
};

// ═══════════════════════════════════════════════════════════════
// WHAT TO SAY
// Siegel requirement — scripts for parent-child conversations
// ═══════════════════════════════════════════════════════════════

export const WHAT_TO_SAY = {
  TITLE: "What to say to your child",
  
  SCENARIOS: [
    {
      prompt: "If your child asks: \"Am I good at maths?\"",
      response: "\"I see you working hard at it. How does it feel when you figure out a tricky problem?\""
    },
    {
      prompt: "If your child says: \"I keep getting things wrong.\"",
      response: "\"That means you're working on hard stuff. Your brain is growing right now.\""
    },
    {
      prompt: "If your child seems frustrated:",
      response: "\"Learning is hard sometimes. I'm proud of you for sticking with it.\""
    }
  ],
  
  AVOID_TITLE: "Phrases to avoid",
  
  AVOID: [
    "Noa says you need to work on...",
    "You got 80% in...",
    "You're not as good at maths as reading..."
  ]
};

// ═══════════════════════════════════════════════════════════════
// WRONG ANSWER FEEDBACK
// Siegel requirement — soften for children
// ═══════════════════════════════════════════════════════════════

export const WRONG_ANSWER = {
  MESSAGES: [
    "That's a tricky one! Here's why...",
    "Good try! Let's look at this together...",
    "Almost! Here's the key thing...",
    "Not quite — let me show you..."
  ],
  
  getRandomMessage: () => {
    const messages = WRONG_ANSWER.MESSAGES;
    return messages[Math.floor(Math.random() * messages.length)];
  }
};

// ═══════════════════════════════════════════════════════════════
// NAVIGATION LABELS
// ═══════════════════════════════════════════════════════════════

export const NAV = {
  HOW_IT_WORKS: "How Noa works",
  PARENT_GUIDANCE: "Parent guidance",
  VIEW_ALL_TOPICS: "View all topics",
  VIEW_ALL: "View all",
  BACK: "Back"
};

// ═══════════════════════════════════════════════════════════════
// BUTTON LABELS
// ═══════════════════════════════════════════════════════════════

export const BUTTONS = {
  START_SESSION: "Start Session",
  CONTINUE: "Continue",
  BACK_TO_DASHBOARD: "Back to Dashboard",
  ADD_CHILD: "Add a Child",
  SAVE: "Save",
  CANCEL: "Cancel"
};

// ═══════════════════════════════════════════════════════════════
// PAGE TITLES
// ═══════════════════════════════════════════════════════════════

export const PAGE_TITLES = {
  DASHBOARD: "Dashboard",
  LEARNING_PLAN: "Today's Learning",
  TOPIC_STRENGTHS: "Topic Strengths",
  SESSION_HISTORY: "Session History",
  SETTINGS: "Settings",
  WRITING: "Writing Practice"
};

// ═══════════════════════════════════════════════════════════════
// SETTINGS TABS
// ═══════════════════════════════════════════════════════════════

export const SETTINGS_TABS = {
  ACCOUNT: "Account",
  CHILDREN: "Children",
  ABOUT: "About Noa",
  GUIDANCE: "Parent Guidance"
};

// ═══════════════════════════════════════════════════════════════
// ABOUT NOA CONTENT
// For Settings > About tab
// ═══════════════════════════════════════════════════════════════

export const ABOUT_NOA = {
  SECTIONS: [
    {
      title: "How insights work",
      content: AI_DISCLOSURE.FULL
    },
    {
      title: "What Noa cannot tell you",
      items: LIMITATIONS.ITEMS
    },
    {
      title: "Curriculum alignment",
      content: CURRICULUM.FULL
    },
    {
      title: "Important note",
      content: CURRICULUM.DISCLAIMER
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// WELCOME / EMPTY STATES
// ═══════════════════════════════════════════════════════════════

export const WELCOME = {
  NO_CHILDREN: {
    TITLE: "Welcome to Noa",
    SUBTITLE: "Add your first child to begin."
  },
  
  ALL_DONE: {
    TITLE: "Great work today!",
    SUBTITLE: "Your next session will appear tomorrow.",
    CTA: "View this week's progress"
  }
};

// ═══════════════════════════════════════════════════════════════
// SESSION LABELS
// ═══════════════════════════════════════════════════════════════

export const SESSION = {
  JUSTIFICATION: "This session includes topics based on recent practice patterns.",
  
  DOMAINS: {
    numeracy: "Numeracy Practice",
    reading: "Reading Practice", 
    writing: "Writing Practice",
    grammar_punctuation: "Grammar & Punctuation"
  }
};

// ═══════════════════════════════════════════════════════════════
// CATEGORY STYLES
// Tailwind classes for each strength state
// ═══════════════════════════════════════════════════════════════

export const CATEGORY_STYLES = {
  strength: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    icon: 'text-emerald-500',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200'
  },
  emerging_strength: {
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    icon: 'text-sky-500',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    border: 'border-sky-200'
  },
  focus_area: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    icon: 'text-amber-500',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200'
  },
  emerging_focus: {
    bg: 'bg-slate-50',
    iconBg: 'bg-slate-100',
    icon: 'text-slate-500',
    text: 'text-slate-700',
    dot: 'bg-slate-400',
    border: 'border-slate-200'
  }
};

// ═══════════════════════════════════════════════════════════════
// CATEGORY ICONS
// Maps strength state to lucide-react icon name
// ═══════════════════════════════════════════════════════════════

export const CATEGORY_ICONS = {
  strength: 'Sparkles',
  emerging_strength: 'TrendingUp',
  focus_area: 'Settings2',
  emerging_focus: 'Eye'
};

// ═══════════════════════════════════════════════════════════════
// CATEGORY EXPLANATIONS
// What each category means
// ═══════════════════════════════════════════════════════════════

export const CATEGORY_EXPLANATIONS = {
  strength: "Consistent accuracy across sessions",
  emerging_strength: "Improving pattern detected",
  focus_area: "Needs more practice",
  emerging_focus: "Recently introduced topic"
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Get category style
// ═══════════════════════════════════════════════════════════════

export function getCategoryStyle(state) {
  return CATEGORY_STYLES[state] || CATEGORY_STYLES.emerging_focus;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Get random parent tip
// ═══════════════════════════════════════════════════════════════

export function getRandomTip() {
  const tips = PARENT_TIP.TIPS;
  return tips[Math.floor(Math.random() * tips.length)];
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Get trend label (returns null for 'declining')
// ═══════════════════════════════════════════════════════════════

export function getTrendLabel(trend) {
  return TREND_LABELS[trend] || null;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Get strength label
// ═══════════════════════════════════════════════════════════════

export function getStrengthLabel(state) {
  return STRENGTH_LABELS[state] || state;
}