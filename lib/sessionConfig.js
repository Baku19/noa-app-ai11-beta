// ═══════════════════════════════════════════════════════════════
// FILE: lib/sessionConfig.js
// PURPOSE: Single source of truth for session settings
// LOCKED: Session durations approved and locked
// ═══════════════════════════════════════════════════════════════
//
// "Sessions are designed for sustained focus, not screen time."
//
// Research shows shorter, consistent practice beats longer, 
// irregular sessions. The bonus is always optional and child-initiated.
//
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SESSION DURATION BY AGE BAND (LOCKED)
// ═══════════════════════════════════════════════════════════════

export const SESSION_CONFIG = {
  // Years 2-4 (ages 7-10)
  early: {
    yearRange: [2, 3, 4],
    baseDuration: 20,        // minutes
    bonusDuration: 5,        // minutes
    maxDuration: 25,         // base + bonus
    showBonusPrompt: true,
    showDurationOnHome: false, // Young scholars don't need to see duration
  },
  
  // Years 5-6 (ages 10-12)
  middle: {
    yearRange: [5, 6],
    baseDuration: 25,
    bonusDuration: 10,
    maxDuration: 35,
    showBonusPrompt: true,
    showDurationOnHome: true,
  },
  
  // Year 7 (ages 12-13) - Transition year
  transition: {
    yearRange: [7],
    baseDuration: 30,
    bonusDuration: 15,
    maxDuration: 45,
    showBonusPrompt: true,
    showDurationOnHome: true,
  },
  
  // Years 8-9 (ages 13-15)
  senior: {
    yearRange: [8, 9],
    baseDuration: 30,
    bonusDuration: 15,
    maxDuration: 45,
    showBonusPrompt: true,
    showDurationOnHome: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get age band from year level
 * @param {number} yearLevel - School year (2-9)
 * @returns {string} - 'early' | 'middle' | 'transition' | 'senior'
 */
export const getAgeBandFromYear = (yearLevel) => {
  if (yearLevel <= 4) return 'early';
  if (yearLevel <= 6) return 'middle';
  if (yearLevel === 7) return 'transition';
  return 'senior';
};

/**
 * Get session config for a specific year level
 * @param {number} yearLevel - School year (2-9)
 * @returns {object} - Session configuration
 */
export const getSessionConfig = (yearLevel) => {
  const ageBand = getAgeBandFromYear(yearLevel);
  return SESSION_CONFIG[ageBand];
};

/**
 * Get display-friendly duration text
 * @param {number} yearLevel - School year (2-9)
 * @param {boolean} includeBonus - Whether to mention bonus
 * @returns {string} - e.g., "~20 minutes" or "20 mins (+5 bonus)"
 */
export const getDurationText = (yearLevel, includeBonus = false) => {
  const config = getSessionConfig(yearLevel);
  
  if (includeBonus) {
    return `${config.baseDuration} mins (+${config.bonusDuration} bonus)`;
  }
  
  return `~${config.baseDuration} minutes`;
};

/**
 * Get duration for display on Scholar Home (age-appropriate)
 * @param {number} yearLevel - School year (2-9)
 * @returns {string|null} - Duration text or null if shouldn't show
 */
export const getHomeDurationText = (yearLevel) => {
  const config = getSessionConfig(yearLevel);
  
  if (!config.showDurationOnHome) {
    return null;
  }
  
  return `~${config.baseDuration} mins`;
};

// ═══════════════════════════════════════════════════════════════
// SESSION STRUCTURE (How time is allocated)
// ═══════════════════════════════════════════════════════════════

export const SESSION_STRUCTURE = {
  early: {
    warmUp: { duration: 3, questions: 3, description: 'Confidence builders' },
    core: { duration: 14, questions: 10, description: 'Adaptive practice' },
    coolDown: { duration: 3, questions: 2, description: 'End on success' },
  },
  middle: {
    warmUp: { duration: 4, questions: 3, description: 'Activate knowledge' },
    core: { duration: 17, questions: 12, description: 'Adaptive practice' },
    coolDown: { duration: 4, questions: 3, description: 'End on success' },
  },
  transition: {
    warmUp: { duration: 5, questions: 4, description: 'Quick review' },
    core: { duration: 20, questions: 14, description: 'Deep practice' },
    coolDown: { duration: 5, questions: 3, description: 'Consolidation' },
  },
  senior: {
    warmUp: { duration: 5, questions: 4, description: 'Quick review' },
    core: { duration: 20, questions: 14, description: 'Deep practice' },
    coolDown: { duration: 5, questions: 3, description: 'Consolidation' },
  },
};

// ═══════════════════════════════════════════════════════════════
// BONUS SESSION CONFIG
// ═══════════════════════════════════════════════════════════════

export const BONUS_CONFIG = {
  // Prompt shown after session complete
  prompts: {
    early: {
      headline: "Want to keep going?",
      subtext: "Just 5 more minutes",
      yesButton: "Yes please!",
      noButton: "I'm done",
    },
    middle: {
      headline: "Keep going?",
      subtext: "10 more minutes available",
      yesButton: "Continue",
      noButton: "Done for today",
    },
    transition: {
      headline: "Continue?",
      subtext: "+15 minutes available",
      yesButton: "Continue",
      noButton: "Done",
    },
    senior: {
      headline: "Continue?",
      subtext: "+15 minutes",
      yesButton: "Continue",
      noButton: "Done",
    },
  },
  
  // Rules
  rules: {
    alwaysOptional: true,
    childInitiated: true,
    neverGuilty: true,
    maxBonusPerDay: 1, // Can only do bonus once per session
  },
};

// ═══════════════════════════════════════════════════════════════
// WEEKLY TARGETS (For parent dashboard)
// ═══════════════════════════════════════════════════════════════

export const WEEKLY_TARGETS = {
  early: {
    recommendedDays: 4,
    minDays: 3,
    maxDays: 6,
    weeklyMinutes: { min: 60, target: 80, max: 120 },
  },
  middle: {
    recommendedDays: 4,
    minDays: 3,
    maxDays: 6,
    weeklyMinutes: { min: 75, target: 100, max: 150 },
  },
  transition: {
    recommendedDays: 5,
    minDays: 3,
    maxDays: 6,
    weeklyMinutes: { min: 90, target: 120, max: 180 },
  },
  senior: {
    recommendedDays: 5,
    minDays: 3,
    maxDays: 6,
    weeklyMinutes: { min: 90, target: 120, max: 180 },
  },
};

// ═══════════════════════════════════════════════════════════════
// PARENT-FACING COPY (For settings/onboarding)
// ═══════════════════════════════════════════════════════════════

export const PARENT_SESSION_EXPLAINER = {
  headline: "Session Length by Age",
  
  table: [
    { age: "Years 2-4", daily: "20 minutes", bonus: "+5 minutes" },
    { age: "Years 5-6", daily: "25 minutes", bonus: "+10 minutes" },
    { age: "Years 7-9", daily: "30 minutes", bonus: "+15 minutes" },
  ],
  
  description: `Sessions are designed for sustained focus, not screen time. 
Research shows shorter, consistent practice beats longer, irregular sessions.`,
  
  bonusNote: "The bonus is always optional and child-initiated.",
  
  whyThisWorks: [
    "Matches attention span by age",
    "Prevents cognitive fatigue",
    "Builds sustainable habits",
    "Ends on success, not exhaustion",
  ],
};

// ═══════════════════════════════════════════════════════════════
// DESIGN RULES (For developers)
// ═══════════════════════════════════════════════════════════════

export const SESSION_DESIGN_RULES = {
  // What scholars see
  scholar: {
    showTimer: false,           // NEVER show countdown timer
    showPercentage: false,      // NEVER show "67% complete"
    showProgressDots: true,     // Yes - "I'm moving forward"
    showQuestionCount: false,   // NEVER show "Question 7 of 20"
    endOnSuccess: true,         // ALWAYS end with achievable question
  },
  
  // What parents see
  parent: {
    showDuration: true,         // Yes - in session history
    showCompletion: true,       // Yes - "Session completed"
    showBonusUsage: true,       // Yes - "Used bonus time"
    showAccuracy: false,        // NEVER - we show capability, not scores
  },
};