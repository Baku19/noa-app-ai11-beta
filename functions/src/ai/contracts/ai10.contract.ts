// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-10 Safety Monitor
// PURPOSE: Deterministic safety checks for all AI outputs
// IMPLEMENTATION: Pure rules engine (no LLM)
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, SafetyDecision } from "../../shared/types";
import { BANNED_PHRASES } from "./ai07.contract";

export const MODULE_ID = "AI-10";
export const PROMPT_VERSION = "RULES_ENGINE_1.0";

export interface AI10Input {
  moduleId: string;
  outputText: string;
  targetAudience: "CHILD" | "PARENT" | "SYSTEM";
  correctAnswer?: string;
}

export interface AI10Output {
  decision: SafetyDecision;
  reasonCodes: string[];
}

export function runSafetyCheck(input: AI10Input): AI10Output {
  const reasonCodes: string[] = [];
  let decision: SafetyDecision = "ALLOW";

  const textLower = input.outputText.toLowerCase();

  // Check banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (textLower.includes(phrase.toLowerCase())) {
      reasonCodes.push("BANNED_CONTENT");
      decision = "BLOCK";
      break;
    }
  }

  // Check answer reveal (child-facing)
  if (input.targetAudience === "CHILD" && input.correctAnswer) {
    const answerLower = input.correctAnswer.toLowerCase().trim();
    if (answerLower.length > 1 && textLower.includes(answerLower)) {
      reasonCodes.push("ANSWER_REVEALED");
      decision = "BLOCK";
    }
  }

  // Check judgement language (child-facing)
  if (input.targetAudience === "CHILD") {
    const judgement = ["wrong", "incorrect", "mistake", "failed", "bad"];
    for (const word of judgement) {
      if (new RegExp("\\b" + word + "\\b", "i").test(textLower)) {
        reasonCodes.push("JUDGEMENT_LANGUAGE");
        if (decision === "ALLOW") decision = "ESCALATE";
        break;
      }
    }
  }

  // Check for scholar identifiers
  if (/scholarId|studentId|userId/i.test(input.outputText)) {
    reasonCodes.push("IDENTIFIER_DETECTED");
    decision = "BLOCK";
  }

  return { decision, reasonCodes };
}

export function validateAI10Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI10Output;

  const validDecisions = ["ALLOW", "BLOCK", "ESCALATE"];
  if (!validDecisions.includes(data?.decision)) {
    reasons.push("decision must be ALLOW, BLOCK, or ESCALATE");
  }

  if (!Array.isArray(data?.reasonCodes)) {
    reasons.push("reasonCodes must be array");
  }

  return { pass: reasons.length === 0, reasons };
}
