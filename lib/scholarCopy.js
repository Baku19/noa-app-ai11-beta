// ═══════════════════════════════════════════════════════════════
// FILE: lib/scholarCopy.js
// PURPOSE: Age-adaptive language for scholar experience
// PHILOSOPHY: "Parents get analysis. Scholars get identity reinforcement."
// ═══════════════════════════════════════════════════════════════

// Determine age band from year level
export const getAgeBand = (yearLevel) => {
  if (yearLevel <= 4) return 'early';      // Y3-4: Pure reassurance
  if (yearLevel <= 6) return 'middle';     // Y5-6: Light capability
  if (yearLevel <= 7) return 'transition'; // Y7: Purpose + respect
  return 'senior';                          // Y8-9: Autonomy + control
};

// ═══════════════════════════════════════════════════════════════
// GREETINGS (Time-aware, age-appropriate)
// ═══════════════════════════════════════════════════════════════

export const getGreeting = (name, hour, ageBand) => {
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  
  const greetings = {
    early: {
      morning: `Good morning, ${name}!`,
      afternoon: `Hi ${name}!`,
      evening: `Hi ${name}!`
    },
    middle: {
      morning: `Good morning, ${name}.`,
      afternoon: `Hey ${name}.`,
      evening: `Hey ${name}.`
    },
    transition: {
      morning: `Morning, ${name}.`,
      afternoon: `Hey ${name}.`,
      evening: `Hey ${name}.`
    },
    senior: {
      morning: `${name}.`,
      afternoon: `${name}.`,
      evening: `${name}.`
    }
  };
  
  return greetings[ageBand][timeOfDay];
};

// ═══════════════════════════════════════════════════════════════
// SESSION INVITATION (The "Ready?" moment)
// ═══════════════════════════════════════════════════════════════

export const getSessionInvitation = (ageBand, focusAreas = []) => {
  const focus = focusAreas.length > 0 
    ? focusAreas.slice(0, 2).join(' and ').toLowerCase()
    : 'some learning';

  return {
    early: {
      headline: "Ready to practise?",
      subtext: null,
      button: "Let's go!"
    },
    middle: {
      headline: "Ready?",
      subtext: `Today we're practising ${focus}.`,
      button: "Let's go"
    },
    transition: {
      headline: "Ready?",
      subtext: `Today's session focuses on ${focus}.`,
      button: "Start"
    },
    senior: {
      headline: "Today's session",
      subtext: `${focus.charAt(0).toUpperCase() + focus.slice(1)}. Builds on recent practice.`,
      button: "Start"
    }
  }[ageBand];
};

// ═══════════════════════════════════════════════════════════════
// SESSION COMPLETE (The closure moment)
// ═══════════════════════════════════════════════════════════════

export const getSessionComplete = (ageBand, minutes, effortSignal, usedBonus = false) => {
  // Effort signals: 'persisted', 'focused', 'improved', 'tried_hard', 'steady'
  const effortMessages = {
    early: {
      persisted: "You kept going even when it was tricky!",
      focused: "You did such good thinking!",
      improved: "You're learning new things!",
      tried_hard: "You tried really hard today!",
      steady: "Great practising today!"
    },
    middle: {
      persisted: "You stuck with a challenging one. That's how learning happens.",
      focused: "You stayed focused the whole way through.",
      improved: "You're getting better at this.",
      tried_hard: "You put in real effort today.",
      steady: "Solid practice session."
    },
    transition: {
      persisted: "You worked through something difficult. That persistence matters.",
      focused: "Good focus today.",
      improved: "You handled some harder questions well.",
      tried_hard: "Strong effort.",
      steady: "Consistent session."
    },
    senior: {
      persisted: "You pushed through a challenging section.",
      focused: "Focused session.",
      improved: "You're building on what you know.",
      tried_hard: "Solid work.",
      steady: "Done."
    }
  };

  const closingMessages = {
    early: "See you next time! 👋",
    middle: "See you tomorrow.",
    transition: "See you tomorrow.",
    senior: ""
  };

  const headlines = {
    early: usedBonus ? "Amazing work!" : "Great work!",
    middle: usedBonus ? "Great session today." : "Nice work today.",
    transition: usedBonus ? "Strong session." : "Done.",
    senior: usedBonus ? "Extended session complete." : "Session complete."
  };

  // Duration text - acknowledge bonus
  const getDurationText = () => {
    if (ageBand === 'early') {
      return usedBonus 
        ? `Wow! You practised for ${minutes} minutes!`
        : `You practised for ${minutes} minutes!`;
    }
    return usedBonus 
      ? `${minutes} minutes — you kept going!`
      : `${minutes} minutes`;
  };

  return {
    headline: headlines[ageBand],
    duration: getDurationText(),
    effort: effortMessages[ageBand][effortSignal] || effortMessages[ageBand].steady,
    closing: closingMessages[ageBand],
    button: ageBand === 'early' ? "All done!" : "Done",
    usedBonus: usedBonus
  };
};

// ═══════════════════════════════════════════════════════════════
// MY PRACTICE (Session history - age appropriate)
// ═══════════════════════════════════════════════════════════════

export const getPracticeLanguage = (ageBand) => {
  return {
    early: {
      pageTitle: "My Practice",
      emptyState: "Your practice will show up here!",
      sessionPrefix: "You practised",
      showEffort: false,
      showCapability: false,
      maxSessions: 3
    },
    middle: {
      pageTitle: "My Practice",
      emptyState: "Your practice sessions will appear here.",
      sessionPrefix: "Practised",
      showEffort: true,
      showCapability: false,
      maxSessions: 5
    },
    transition: {
      pageTitle: "Practice History",
      emptyState: "Your sessions will appear here.",
      sessionPrefix: "",
      showEffort: true,
      showCapability: true,
      maxSessions: 10
    },
    senior: {
      pageTitle: "Sessions",
      emptyState: "No sessions yet.",
      sessionPrefix: "",
      showEffort: false,
      showCapability: true,
      maxSessions: 15
    }
  }[ageBand];
};

// ═══════════════════════════════════════════════════════════════
// EFFORT CUES (For session history)
// ═══════════════════════════════════════════════════════════════

export const getEffortCue = (ageBand, signal) => {
  const cues = {
    middle: {
      persisted: "You kept trying even when it was tricky",
      focused: "You stayed really focused",
      improved: "You're getting better at this",
      tried_hard: "You worked hard on this one"
    },
    transition: {
      persisted: "Worked through challenging questions",
      focused: "Maintained focus throughout",
      improved: "Showed improvement",
      tried_hard: "Put in strong effort"
    },
    senior: {
      persisted: "Pushed through difficulty",
      focused: "High focus",
      improved: "Improving",
      tried_hard: "Strong effort"
    }
  };
  
  return cues[ageBand]?.[signal] || null;
};

// ═══════════════════════════════════════════════════════════════
// CAPABILITY CUES (For session history - Y7+)
// ═══════════════════════════════════════════════════════════════

export const getCapabilityCue = (ageBand, signal) => {
  const cues = {
    transition: {
      handled_harder: "Handled more challenging questions",
      fewer_hints: "Needed fewer hints than before",
      faster: "Working more efficiently",
      consistent: "Consistent performance"
    },
    senior: {
      handled_harder: "Engaged with harder content",
      fewer_hints: "Reduced hint reliance",
      faster: "Improved efficiency",
      consistent: "Consistent"
    }
  };
  
  return cues[ageBand]?.[signal] || null;
};

// ═══════════════════════════════════════════════════════════════
// WRONG ANSWER RESPONSES (Warm, not red)
// ═══════════════════════════════════════════════════════════════

export const getWrongAnswerResponse = (ageBand) => {
  return {
    early: {
      acknowledgment: "That's a tricky one!",
      transition: "Here's what to notice...",
      button: "Got it!"
    },
    middle: {
      acknowledgment: "Not quite.",
      transition: "Here's the key thing...",
      button: "Got it"
    },
    transition: {
      acknowledgment: "Not quite right.",
      transition: "Here's why...",
      button: "Next"
    },
    senior: {
      acknowledgment: "",
      transition: "The answer was...",
      button: "Next"
    }
  }[ageBand];
};

// ═══════════════════════════════════════════════════════════════
// HINT BUTTON LANGUAGE
// ═══════════════════════════════════════════════════════════════

export const getHintLanguage = (ageBand) => {
  return {
    early: "Help me!",
    middle: "Give me a hint",
    transition: "Hint",
    senior: "Hint"
  }[ageBand];
};

// ═══════════════════════════════════════════════════════════════
// STREAK LANGUAGE (Subtle, not dopamine-driven)
// ═══════════════════════════════════════════════════════════════

export const getStreakLanguage = (ageBand, days) => {
  if (days < 2) return null;
  
  return {
    early: days >= 3 ? `${days} days in a row!` : null,
    middle: `${days} day streak`,
    transition: `${days} days`,
    senior: null // No streaks for seniors - feels patronising
  }[ageBand];
};