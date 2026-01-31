// ═══════════════════════════════════════════════════════════════
// FILE: ai/validation/ruleEngine.ts
// PURPOSE: Reusable deterministic validation rules
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { BANNED_PHRASES } from "../contracts/ai07.contract";

export interface RuleResult {
  pass: boolean;
  code: string;
  message: string;
}

export function checkNoAnswerReveal(text: string, correctAnswer: string): RuleResult {
  const textLower = text.toLowerCase();
  const answerLower = correctAnswer.toLowerCase().trim();

  if (answerLower.length > 1 && textLower.includes(answerLower)) {
    return { pass: false, code: "ANSWER_REVEALED", message: "Text contains correct answer" };
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkNoBannedContent(text: string): RuleResult {
  const textLower = text.toLowerCase();

  for (const phrase of BANNED_PHRASES) {
    if (textLower.includes(phrase.toLowerCase())) {
      return { pass: false, code: "BANNED_CONTENT", message: `Contains banned phrase: ${phrase}` };
    }
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkNoJudgement(text: string): RuleResult {
  const judgementWords = ["wrong", "incorrect", "mistake", "failed", "bad"];
  const textLower = text.toLowerCase();

  for (const word of judgementWords) {
    if (new RegExp(`\\b${word}\\b`, "i").test(textLower)) {
      return { pass: false, code: "JUDGEMENT_LANGUAGE", message: `Contains judgement: ${word}` };
    }
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkNoIdentifiers(text: string): RuleResult {
  if (/scholarId|studentId|userId/i.test(text)) {
    return { pass: false, code: "IDENTIFIER_DETECTED", message: "Contains scholar identifiers" };
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkYearLevelUnchanged(outputYearLevel: number, inputYearLevel: number): RuleResult {
  if (outputYearLevel !== inputYearLevel) {
    return { pass: false, code: "YEAR_LEVEL_CHANGED", message: `Year level changed from ${inputYearLevel} to ${outputYearLevel}` };
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkSessionMixSum(mix: { reinforce: number; target: number; stretch: number }): RuleResult {
  const sum = mix.reinforce + mix.target + mix.stretch;
  if (sum < 0.99 || sum > 1.01) {
    return { pass: false, code: "SESSION_MIX_INVALID", message: `Session mix sums to ${sum}, expected 1.0` };
  }
  return { pass: true, code: "OK", message: "" };
}

export function checkRequiredFields(obj: Record<string, unknown>, fields: string[]): RuleResult {
  for (const field of fields) {
    if (!(field in obj) || obj[field] === undefined) {
      return { pass: false, code: "MISSING_FIELD", message: `Missing required field: ${field}` };
    }
  }
  return { pass: true, code: "OK", message: "" };
}

export function runAllRules(rules: RuleResult[]): { pass: boolean; failures: RuleResult[] } {
  const failures = rules.filter((r) => !r.pass);
  return { pass: failures.length === 0, failures };
}
