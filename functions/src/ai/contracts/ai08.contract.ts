// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-08 Cohort Signal Monitor
// PURPOSE: Anonymised cohort comparison signals
// CRITICAL: Must NEVER identify individual scholars
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-08";
export const PROMPT_VERSION = "1.0";

export type CohortBand = "BELOW_Q1" | "Q1_Q2" | "Q2_Q3" | "ABOVE_Q3";
export type CohortSignal = "COHORT_STRONG" | "COHORT_AVERAGE" | "COHORT_NEEDS_FOCUS";

export interface AI08Input {
  yearLevel: number;
  domain: string;
  microSkillId: string;
  aggregatedData: {
    totalScholars: number;
    accuracyDistribution: { q1: number; median: number; q3: number };
    timeDistribution: { q1: number; median: number; q3: number };
  };
}

export interface AI08Output {
  anonymisedRanges: {
    band: CohortBand;
    accuracyRange: { min: number; max: number };
    description: string;
  }[];
  cohortSignals: {
    microSkillId: string;
    signal: CohortSignal;
    targetQuartile: "Q2" | "Q3" | "Q4";
  }[];
}

export function validateAI08Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI08Output;

  if (!Array.isArray(data?.anonymisedRanges)) {
    reasons.push("anonymisedRanges must be array");
  }

  if (!Array.isArray(data?.cohortSignals)) {
    reasons.push("cohortSignals must be array");
  }

  // CRITICAL: Check for scholar identifiers
  const outputStr = JSON.stringify(data);
  if (/scholarId|studentId|userId|name/i.test(outputStr)) {
    reasons.push("CRITICAL: Output contains scholar identifiers");
  }

  return { pass: reasons.length === 0, reasons };
}
