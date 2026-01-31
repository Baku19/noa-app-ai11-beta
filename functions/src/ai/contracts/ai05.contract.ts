// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-05 Guided Tutor
// PURPOSE: Provide hints without revealing answers
// CRITICAL: Must NEVER reveal the correct answer
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult } from "../../shared/types";

export const MODULE_ID = "AI-05";
export const PROMPT_VERSION = "1.0";

export interface AI05Input {
  yearLevel: number;
  skillTag: string;
  prompt: string;
  studentAttempt: string;
  errorTags: string[];
  scaffoldLevel: 1 | 2 | 3;
  correctAnswer: string; // For validation only - NOT sent to model
}

export interface AI05Output {
  hint: string;
  scaffoldLevel: 1 | 2 | 3;
  nextPrompt: string | null;
  mustNotRevealAnswer: true;
}

export function validateAI05Output(output: unknown, input: AI05Input): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI05Output;

  if (typeof data?.hint !== "string" || data.hint.length < 5) {
    reasons.push("hint must be non-empty string");
  }

  if (![1, 2, 3].includes(data?.scaffoldLevel)) {
    reasons.push("scaffoldLevel must be 1, 2, or 3");
  }

  if (data?.mustNotRevealAnswer !== true) {
    reasons.push("mustNotRevealAnswer must be true");
  }

  // CRITICAL: Check for answer leak
  const hintLower = (data?.hint || "").toLowerCase();
  const answerLower = input.correctAnswer.toLowerCase().trim();

  if (answerLower.length > 1 && hintLower.includes(answerLower)) {
    reasons.push("CRITICAL: Hint contains the correct answer");
  }

  // Check for solution patterns
  const solutionPatterns = ["the answer is", "correct answer", "solution is", "equals"];
  for (const pattern of solutionPatterns) {
    if (hintLower.includes(pattern)) {
      reasons.push("Hint contains solution pattern: " + pattern);
    }
  }

  // Check for judgement language
  const judgement = ["wrong", "incorrect", "mistake", "failed"];
  for (const word of judgement) {
    if (hintLower.includes(word)) {
      reasons.push("Hint contains judgement language: " + word);
    }
  }

  return { pass: reasons.length === 0, reasons };
}
