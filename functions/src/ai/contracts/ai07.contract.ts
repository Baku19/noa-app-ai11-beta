// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-07 Parent Translator
// PURPOSE: Generate parent-friendly insights
// CRITICAL: Must not use banned diagnostic/ranking language
// MODEL: Pro | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-07";
export const PROMPT_VERSION = "1.0";

export const BANNED_PHRASES = [
  "dyslexia", "adhd", "disorder", "disability", "diagnosis",
  "will fail", "will pass", "guarantee", "definitely",
  "percentile", "above average", "below average", "ranking",
  "behind", "struggling", "failing", "lazy",
] as const;

export interface AI07Input {
  scholarName: string;
  yearLevel: number;
  progressSummary: {
    trend: string;
    recentAccuracy: number;
    sessionsCompleted: number;
  };
  strengths: string[];
  focusAreas: string[];
}

export interface AI07Output {
  summary: string;
  capability: string;
  observedBehaviours: string[];
  homeActions: string[];
  disclaimers: string[];
}

export function validateAI07Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI07Output;

  if (typeof data?.summary !== "string" || data.summary.length > 300) {
    reasons.push("summary must be string under 300 chars");
  }

  if (typeof data?.capability !== "string") {
    reasons.push("capability must be string");
  }

  if (!Array.isArray(data?.observedBehaviours) || data.observedBehaviours.length > 3) {
    reasons.push("observedBehaviours must be array with max 3 items");
  }

  if (!Array.isArray(data?.homeActions) || data.homeActions.length > 3) {
    reasons.push("homeActions must be array with max 3 items");
  }

  if (!Array.isArray(data?.disclaimers)) {
    reasons.push("disclaimers must be array");
  }

  // Check for banned phrases
  const outputStr = JSON.stringify(data).toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (outputStr.includes(phrase.toLowerCase())) {
      reasons.push("Contains banned phrase: " + phrase);
    }
  }

  return { pass: reasons.length === 0, reasons };
}
