// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-04 Diagnostic Engine
// PURPOSE: Calculate mastery probabilities and identify gaps
// MODEL: Pro | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-04";
export const PROMPT_VERSION = "1.0";

export interface AI04Input {
  scholarId: string;
  sessionResponses: Array<{
    microSkillId: string;
    isCorrect: boolean;
    difficulty: "easy" | "medium" | "hard";
    timeMs: number;
  }>;
  priorMastery?: Record<string, number>;
}

export interface AI04Output {
  masteryProbabilities: Record<string, number>;
  gapMap: Array<{
    microSkillId: string;
    masteryLevel: number;
    priority: "high" | "medium" | "low";
  }>;
  certaintyLevel: "high" | "medium" | "low";
}

export function validateAI04Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI04Output;

  if (typeof data?.masteryProbabilities !== "object") {
    reasons.push("masteryProbabilities must be object");
  } else {
    for (const [key, val] of Object.entries(data.masteryProbabilities)) {
      if (typeof val !== "number" || val < 0 || val > 1) {
        reasons.push("masteryProbabilities values must be 0-1: " + key);
      }
    }
  }

  if (!Array.isArray(data?.gapMap)) {
    reasons.push("gapMap must be array");
  }

  const validCertainty = ["high", "medium", "low"];
  if (!validCertainty.includes(data?.certaintyLevel)) {
    reasons.push("certaintyLevel must be high, medium, or low");
  }

  return { pass: reasons.length === 0, reasons };
}
