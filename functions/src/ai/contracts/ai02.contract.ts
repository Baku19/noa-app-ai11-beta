// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-02 Response Evaluator
// PURPOSE: Grade student responses with error analysis
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-02";
export const PROMPT_VERSION = "1.0";

export interface AI02Input {
  itemId: string;
  questionType: "mcq" | "short" | "extended";
  prompt: string;
  correctAnswer: string;
  studentResponse: string;
  timeMs: number;
  attemptNumber: number;
}

export interface AI02Output {
  isCorrect: boolean;
  errorTags: string[];
  confidenceInEvaluation: number;
}

export const ERROR_TAGS = [
  "computation_error",
  "place_value_confusion",
  "wrong_operation",
  "fraction_error",
  "reading_misinterpretation",
  "partial_completion",
  "conceptual_misunderstanding",
  "careless_mistake",
] as const;

export function validateAI02Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI02Output;

  if (typeof data?.isCorrect !== "boolean") {
    reasons.push("isCorrect must be boolean");
  }

  if (!Array.isArray(data?.errorTags)) {
    reasons.push("errorTags must be array");
  }

  if (typeof data?.confidenceInEvaluation !== "number" ||
      data.confidenceInEvaluation < 0 || data.confidenceInEvaluation > 1) {
    reasons.push("confidenceInEvaluation must be 0-1");
  }

  const outputStr = JSON.stringify(data).toLowerCase();
  const forbidden = ["great job", "well done", "try again", "next time"];
  for (const phrase of forbidden) {
    if (outputStr.includes(phrase)) {
      reasons.push("Contains forbidden phrase: " + phrase);
    }
  }

  return { pass: reasons.length === 0, reasons };
}
