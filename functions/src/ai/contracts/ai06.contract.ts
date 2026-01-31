// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-06 Progress Monitor
// PURPOSE: Track trends and detect plateaus
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, Trend } from "../../shared/types";

export const MODULE_ID = "AI-06";
export const PROMPT_VERSION = "1.0";

export interface AI06Input {
  scholarId: string;
  recentSessions: Array<{
    date: string;
    domain: string;
    accuracy: number;
    questionsAttempted: number;
  }>;
  historicalAccuracy?: number;
}

export interface AI06Output {
  trend: Trend;
  plateauFlag: boolean;
  volatility: "low" | "medium" | "high";
  accelerationSignal: number;
  skillTrends: Record<string, Trend>;
}

export function validateAI06Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI06Output;

  const validTrends = ["UP", "NEUTRAL", "DOWN"];
  if (!validTrends.includes(data?.trend)) {
    reasons.push("trend must be UP, NEUTRAL, or DOWN");
  }

  if (typeof data?.plateauFlag !== "boolean") {
    reasons.push("plateauFlag must be boolean");
  }

  const validVolatility = ["low", "medium", "high"];
  if (!validVolatility.includes(data?.volatility)) {
    reasons.push("volatility must be low, medium, or high");
  }

  if (typeof data?.accelerationSignal !== "number") {
    reasons.push("accelerationSignal must be number");
  }

  if (typeof data?.skillTrends !== "object") {
    reasons.push("skillTrends must be object");
  }

  return { pass: reasons.length === 0, reasons };
}
