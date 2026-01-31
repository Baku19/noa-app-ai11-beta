// FILE: ai/services/orchestrationService.ts
// PURPOSE: Session planning using AI-00 and AI-09

import { runModule } from "../runtime/geminiService";
import { runOrchestrator, AI00Input, AI00Output } from "../contracts/ai00.contract";
import { AI09Input, AI09Output, validateAI09Output } from "../contracts/ai09.contract";
import { getServeableQuestions, getServeableQuestionsByDomain, countServeableItems } from "../../db/questionBank.repo";
import { Difficulty } from "../../shared/types";

export interface SessionPlan {
  questionIds: string[];
  targetDifficulty: Difficulty;
  sessionMix: { reinforce: number; target: number; stretch: number };
  inventorySufficient: boolean;
  coordinationRunId?: string;
}

export async function createAISessionPlan(
  scholarId: string,
  familyId: string,
  yearLevel: number,
  domain: "numeracy" | "reading" | "writing" | "conventions",
  questionCount: number = 10,
  recentlyServedItemIds: string[] = [],
  priorDiagnostics?: { masteryProbabilities: Record<string, number>; gapMap: any[]; trend: string; plateauFlag: boolean }
): Promise<SessionPlan> {
  let coordinationObject: AI09Output | null = null;
  let coordinationRunId: string | undefined;

  // Try to get AI-09 coordination if we have prior diagnostics
  if (priorDiagnostics) {
    const ai09Input: AI09Input = {
      scholarId,
      yearLevel,
      ai04Summary: {
        masteryProbabilities: priorDiagnostics.masteryProbabilities,
        gapMap: priorDiagnostics.gapMap,
      },
      ai06Summary: {
        trend: priorDiagnostics.trend,
        plateauFlag: priorDiagnostics.plateauFlag,
      },
      currentMode: "ONGOING",
    };

    const ai09Result = await runModule<AI09Output>(
      "AI-09",
      ai09Input,
      (output) => validateAI09Output(output, ai09Input),
      "SYSTEM"
    );

    if (ai09Result.success && ai09Result.output) {
      coordinationObject = ai09Result.output;
      coordinationRunId = ai09Result.runId;
    }
  }

  // Run AI-00 orchestrator (rules engine)
  const ai00Input: AI00Input = {
    scholarId,
    familyId,
    yearLevel,
    domain,
    sessionMode: "ONGOING",
    coordinationObject: coordinationObject ? {
      recommendedAdjustments: coordinationObject.recommendedAdjustments,
    } : undefined,
    recentlyServedItemIds,
  };

  const orchestratorOutput: AI00Output = runOrchestrator(ai00Input);

  // Get questions based on plan
  const focusSkills = orchestratorOutput.sessionPlan.microSkillIds;
  const targetDifficulty = orchestratorOutput.sessionPlan.targetDifficulty;

  const questionIds: string[] = [];
  const shortfalls: Array<{ microSkillId: string; difficulty: Difficulty; needed: number }> = [];

  // If we have focus skills from coordination, use them
  if (focusSkills.length > 0) {
    for (const microSkillId of focusSkills) {
      if (questionIds.length >= questionCount) break;

      const needed = Math.ceil(questionCount / focusSkills.length);
      const questions = await getServeableQuestions(
        microSkillId,
        targetDifficulty,
        needed,
        [...recentlyServedItemIds, ...questionIds]
      );

      for (const q of questions) {
        if (questionIds.length < questionCount) {
          questionIds.push(q.itemId);
        }
      }

      const available = await countServeableItems(microSkillId, targetDifficulty);
      if (available < needed) {
        shortfalls.push({ microSkillId, difficulty: targetDifficulty, needed: needed - available });
      }
    }
  }

  // If not enough questions, fill with domain-based query
  if (questionIds.length < questionCount) {
    // getServeableQuestionsByDomain already imported at top
    const fillQuestions = await getServeableQuestionsByDomain(
      domain,
      yearLevel,
      targetDifficulty,
      questionCount - questionIds.length,
      [...recentlyServedItemIds, ...questionIds]
    );

    for (const q of fillQuestions) {
      questionIds.push(q.itemId);
    }
  }

  return {
    questionIds,
    targetDifficulty,
    sessionMix: orchestratorOutput.sessionPlan.sessionMix,
    inventorySufficient: shortfalls.length === 0,
    coordinationRunId,
  };
}
