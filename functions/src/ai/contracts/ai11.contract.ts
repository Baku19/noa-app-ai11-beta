// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-11 System Auditor
// PURPOSE: Schema and role validation for all AI outputs
// IMPLEMENTATION: Pure rules engine (no LLM)
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-11";
export const PROMPT_VERSION = "RULES_ENGINE_1.0";

export interface AI11Input {
  moduleId: string;
  output: Record<string, unknown>;
}

export interface AI11Output {
  schemaCompliance: boolean;
  rolePurity: boolean;
  driftDetected: boolean;
  violations: string[];
}

const MODULE_REQUIRED_FIELDS: Record<string, string[]> = {
  "AI-01": ["items"],
  "AI-02": ["isCorrect", "errorTags", "confidenceInEvaluation"],
  "AI-03": ["calibrationStatus", "confidenceAccuracyGap", "engagementFlags"],
  "AI-04": ["masteryProbabilities", "gapMap", "certaintyLevel"],
  "AI-05": ["hint", "scaffoldLevel", "mustNotRevealAnswer"],
  "AI-06": ["trend", "plateauFlag", "volatility", "skillTrends"],
  "AI-07": ["summary", "capability", "observedBehaviours", "homeActions", "disclaimers"],
  "AI-08": ["anonymisedRanges", "cohortSignals"],
  "AI-09": ["schemaVersion", "scope", "signals", "recommendedAdjustments", "constraints", "decisionRationale"],
};

const MODULE_FORBIDDEN_PATTERNS: Record<string, RegExp[]> = {
  "AI-02": [/great job/i, /well done/i, /try again/i],
  "AI-05": [/the answer is/i, /correct answer/i, /solution is/i],
  "AI-07": [/dyslexia/i, /adhd/i, /disorder/i, /will fail/i, /percentile/i],
  "AI-08": [/scholarId/i, /studentId/i, /userId/i],
};

export function runSystemAudit(input: AI11Input): AI11Output {
  const violations: string[] = [];
  let schemaCompliance = true;
  let rolePurity = true;
  let driftDetected = false;

  // Check required fields
  const requiredFields = MODULE_REQUIRED_FIELDS[input.moduleId] || [];
  for (const field of requiredFields) {
    if (!(field in input.output)) {
      schemaCompliance = false;
      violations.push("Missing required field: " + field);
    }
  }

  // Check forbidden patterns
  const forbiddenPatterns = MODULE_FORBIDDEN_PATTERNS[input.moduleId] || [];
  const outputStr = JSON.stringify(input.output);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(outputStr)) {
      rolePurity = false;
      violations.push("Role purity violation: " + pattern.toString());
    }
  }

  // AI-05 specific: mustNotRevealAnswer must be true
  if (input.moduleId === "AI-05") {
    const out = input.output as { mustNotRevealAnswer?: boolean };
    if (out.mustNotRevealAnswer !== true) {
      schemaCompliance = false;
      violations.push("AI-05 mustNotRevealAnswer must be true");
    }
  }

  // AI-09 specific: yearLevel must not change
  if (input.moduleId === "AI-09") {
    const out = input.output as { constraints?: { mustNot?: string[] } };
    if (!out.constraints?.mustNot?.includes("change_year_level")) {
      schemaCompliance = false;
      violations.push("AI-09 must include change_year_level in mustNot");
    }
  }

  return { schemaCompliance, rolePurity, driftDetected, violations };
}

export function validateAI11Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI11Output;

  if (typeof data?.schemaCompliance !== "boolean") {
    reasons.push("schemaCompliance must be boolean");
  }
  if (typeof data?.rolePurity !== "boolean") {
    reasons.push("rolePurity must be boolean");
  }
  if (!Array.isArray(data?.violations)) {
    reasons.push("violations must be array");
  }

  return { pass: reasons.length === 0, reasons };
}
