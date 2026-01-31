// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-01 Assessment Generator
// PURPOSE: Generate assessment items for question bank
// MODEL: Flash | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, Difficulty, Domain, QuestionType } from "../../shared/types";

export const MODULE_ID = "AI-01";
export const PROMPT_VERSION = "1.0";

export interface AI01Input {
  yearLevel: number;
  domain: Domain;
  microSkillId: string;
  skillTag: string;
  difficultyBand: Difficulty;
  count: number;
  excludeItemIds?: string[];
}

export interface AI01OutputItem {
  prompt: string;
  questionType: QuestionType;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  distractorRationales?: Record<string, string>;
}

export interface AI01Output {
  items: AI01OutputItem[];
}

export function validateAI01Output(output: unknown, input: AI01Input): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI01Output;

  if (!Array.isArray(data?.items)) {
    reasons.push("items must be an array");
    return { pass: false, reasons };
  }

  if (data.items.length !== input.count) {
    reasons.push(`Expected ${input.count} items, got ${data.items.length}`);
  }

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    if (!item.prompt || item.prompt.length < 10) {
      reasons.push(`Item ${i}: prompt too short`);
    }
    if (!item.correctAnswer) {
      reasons.push(`Item ${i}: missing correctAnswer`);
    }
    if (!item.explanation) {
      reasons.push(`Item ${i}: missing explanation`);
    }
    if (item.questionType === "mcq" && (!item.options || item.options.length !== 4)) {
      reasons.push(`Item ${i}: MCQ must have 4 options`);
    }
  }

  return { pass: reasons.length === 0, reasons };
}
