// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-03 Confidence Interpreter
// PURPOSE: Analyze confidence vs accuracy calibration
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, CalibrationStatus, FatigueRisk } from "../../shared/types";

export const MODULE_ID = "AI-03";
export const PROMPT_VERSION = "1.0";

export interface AI03Input {
  isCorrect: boolean;
  confidenceRating: number;
  timeMs: number;
  difficulty: "easy" | "medium" | "hard";
  attemptNumber: number;
  recentAccuracy: number;
}

export interface AI03Output {
  calibrationStatus: CalibrationStatus;
  confidenceAccuracyGap: number;
  engagementFlags: {
    rapidGuessing: boolean;
    fatigueRisk: FatigueRisk;
  };
}

export function validateAI03Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI03Output;

  const validStatuses = ["OVER_CONFIDENT", "UNDER_CONFIDENT", "CALIBRATED"];
  if (!validStatuses.includes(data?.calibrationStatus)) {
    reasons.push("calibrationStatus must be OVER_CONFIDENT, UNDER_CONFIDENT, or CALIBRATED");
  }

  if (typeof data?.confidenceAccuracyGap !== "number") {
    reasons.push("confidenceAccuracyGap must be number");
  }

  if (typeof data?.engagementFlags?.rapidGuessing !== "boolean") {
    reasons.push("engagementFlags.rapidGuessing must be boolean");
  }

  const validFatigue = ["LOW", "MEDIUM", "HIGH"];
  if (!validFatigue.includes(data?.engagementFlags?.fatigueRisk)) {
    reasons.push("engagementFlags.fatigueRisk must be LOW, MEDIUM, or HIGH");
  }

  return { pass: reasons.length === 0, reasons };
}
