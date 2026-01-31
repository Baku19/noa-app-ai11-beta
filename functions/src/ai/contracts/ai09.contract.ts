// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-09 Coordination Extractor
// PURPOSE: Generate coordination objects for session planning
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, SupportLevel } from "../../shared/types";

export const MODULE_ID = "AI-09";
export const PROMPT_VERSION = "1.0";

export interface AI09Input {
  scholarId: string;
  yearLevel: number;
  ai04Summary: { masteryProbabilities: Record<string, number>; gapMap: any[] };
  ai06Summary: { trend: string; plateauFlag: boolean };
  ai08Summary?: { cohortSignals: any[] };
  currentMode: "NAPLAN_BLITZ" | "ONGOING";
  weeksUntilNaplan?: number;
}

export interface AI09Output {
  schemaVersion: string;
  scope: { scholarId: string; validFrom: string; validUntil: string };
  signals: {
    trend: string;
    plateauFlag: boolean;
    calibrationStatus: string;
    fatigueRisk: string;
  };
  recommendedAdjustments: {
    supportLevel: SupportLevel;
    difficultyDelta: number;
    sessionMix: { reinforce: number; target: number; stretch: number };
    focusMicroSkillIds: string[];
  };
  constraints: {
    yearLevel: number;
    mustNot: string[];
  };
  decisionRationale: string[];
}

export function validateAI09Output(output: unknown, input: AI09Input): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI09Output;

  if (data?.schemaVersion !== "1.0") {
    reasons.push("schemaVersion must be 1.0");
  }

  if (data?.constraints?.yearLevel !== input.yearLevel) {
    reasons.push("constraints.yearLevel must match input");
  }

  if (!data?.constraints?.mustNot?.includes("change_year_level")) {
    reasons.push("mustNot must include change_year_level");
  }

  // Validate sessionMix sums to 1.0
  const mix = data?.recommendedAdjustments?.sessionMix;
  if (mix) {
    const sum = mix.reinforce + mix.target + mix.stretch;
    if (sum < 0.99 || sum > 1.01) {
      reasons.push("sessionMix must sum to 1.0, got " + sum);
    }
  }

  // Validate difficultyDelta bounds
  const delta = data?.recommendedAdjustments?.difficultyDelta;
  if (typeof delta === "number" && (delta < -1 || delta > 1)) {
    reasons.push("difficultyDelta must be between -1 and 1");
  }

  return { pass: reasons.length === 0, reasons };
}
