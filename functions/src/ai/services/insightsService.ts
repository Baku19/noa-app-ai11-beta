// FILE: ai/services/insightsService.ts
// PURPOSE: Parent insights using AI-07

import { runModule } from "../runtime/geminiService";
import { AI07Input, AI07Output, validateAI07Output } from "../contracts/ai07.contract";

export interface ParentInsight {
  summary: string;
  capability: string;
  observedBehaviours: string[];
  homeActions: string[];
  disclaimers: string[];
  runId: string;
}

export async function generateParentInsight(
  scholarName: string,
  yearLevel: number,
  progressSummary: {
    trend: string;
    recentAccuracy: number;
    sessionsCompleted: number;
  },
  strengths: string[],
  focusAreas: string[]
): Promise<ParentInsight | null> {
  const ai07Input: AI07Input = {
    scholarName,
    yearLevel,
    progressSummary,
    strengths,
    focusAreas,
  };

  const ai07Result = await runModule<AI07Output>(
    "AI-07",
    ai07Input,
    validateAI07Output,
    "PARENT"
  );

  if (!ai07Result.success || !ai07Result.output) {
    console.error("AI-07 failed:", ai07Result.validationErrors);
    return null;
  }

  return {
    summary: ai07Result.output.summary,
    capability: ai07Result.output.capability,
    observedBehaviours: ai07Result.output.observedBehaviours,
    homeActions: ai07Result.output.homeActions,
    disclaimers: ai07Result.output.disclaimers,
    runId: ai07Result.runId,
  };
}

export function getStaticInsight(scholarName: string, sessionsCompleted: number): ParentInsight {
  return {
    summary: `${scholarName} has completed ${sessionsCompleted} practice sessions. Keep up the great work!`,
    capability: "Building foundational skills through consistent practice.",
    observedBehaviours: ["Engaging with practice sessions regularly"],
    homeActions: ["Celebrate effort, not just results", "Ask about what they learned today"],
    disclaimers: ["This reflects practice session data only, not classroom performance."],
    runId: "static",
  };
}
