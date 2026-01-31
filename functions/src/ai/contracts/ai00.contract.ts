// ═══════════════════════════════════════════════════════════════
// CONTRACT: AI-00 Orchestrator
// PURPOSE: Session planning and module coordination
// IMPLEMENTATION: Pure rules engine (no LLM)
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, Difficulty, Domain } from "../../shared/types";

export const MODULE_ID = "AI-00";
export const PROMPT_VERSION = "RULES_ENGINE_1.0";

export interface AI00Input {
  scholarId: string;
  familyId: string;
  yearLevel: number;
  domain: Domain;
  sessionMode: "NAPLAN_BLITZ" | "ONGOING";
  coordinationObject?: {
    recommendedAdjustments: {
      difficultyDelta: number;
      sessionMix: { reinforce: number; target: number; stretch: number };
      focusMicroSkillIds: string[];
    };
  };
  recentlyServedItemIds?: string[];
}

export interface AI00Output {
  sessionPlan: {
    questionCount: number;
    targetDifficulty: Difficulty;
    microSkillIds: string[];
    sessionMix: { reinforce: number; target: number; stretch: number };
  };
  inventoryCheck: {
    sufficient: boolean;
    shortfalls: Array<{ microSkillId: string; difficulty: Difficulty; needed: number }>;
  };
}

export function runOrchestrator(input: AI00Input): AI00Output {
  const defaultMix = { reinforce: 0.3, target: 0.5, stretch: 0.2 };
  const mix = input.coordinationObject?.recommendedAdjustments?.sessionMix || defaultMix;
  
  const focusSkills = input.coordinationObject?.recommendedAdjustments?.focusMicroSkillIds || [];
  
  // Determine difficulty based on coordination delta
  const delta = input.coordinationObject?.recommendedAdjustments?.difficultyDelta || 0;
  let targetDifficulty: Difficulty = "medium";
  if (delta <= -0.5) targetDifficulty = "easy";
  if (delta >= 0.5) targetDifficulty = "hard";

  return {
    sessionPlan: {
      questionCount: 10,
      targetDifficulty,
      microSkillIds: focusSkills,
      sessionMix: mix,
    },
    inventoryCheck: {
      sufficient: true,
      shortfalls: [],
    },
  };
}

export function validateAI00Output(output: unknown): ValidationResult {
  const reasons: string[] = [];
  const data = output as AI00Output;

  if (typeof data?.sessionPlan?.questionCount !== "number") {
    reasons.push("sessionPlan.questionCount must be number");
  }

  const validDifficulties = ["easy", "medium", "hard"];
  if (!validDifficulties.includes(data?.sessionPlan?.targetDifficulty)) {
    reasons.push("sessionPlan.targetDifficulty must be easy, medium, or hard");
  }

  if (typeof data?.inventoryCheck?.sufficient !== "boolean") {
    reasons.push("inventoryCheck.sufficient must be boolean");
  }

  return { pass: reasons.length === 0, reasons };
}
