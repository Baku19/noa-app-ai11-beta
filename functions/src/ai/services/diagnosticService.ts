// FILE: ai/services/diagnosticService.ts
// PURPOSE: Post-session diagnostics using AI-04 and AI-06

import { runModule } from "../runtime/geminiService";
import { AI04Input, AI04Output, validateAI04Output } from "../contracts/ai04.contract";
import { AI06Input, AI06Output, validateAI06Output } from "../contracts/ai06.contract";

export interface DiagnosticResult {
  masteryProbabilities: Record<string, number>;
  gapMap: Array<{ microSkillId: string; masteryLevel: number; priority: string }>;
  trend: string;
  plateauFlag: boolean;
  volatility: string;
  runIds: { ai04: string; ai06: string };
}

export async function runPostSessionDiagnostics(
  scholarId: string,
  sessionResponses: Array<{
    microSkillId: string;
    isCorrect: boolean;
    difficulty: "easy" | "medium" | "hard";
    timeMs: number;
  }>,
  recentSessions: Array<{
    date: string;
    domain: string;
    accuracy: number;
    questionsAttempted: number;
  }>,
  priorMastery?: Record<string, number>
): Promise<DiagnosticResult | null> {
  const ai04Input: AI04Input = { scholarId, sessionResponses, priorMastery };

  const ai04Result = await runModule<AI04Output>("AI-04", ai04Input, validateAI04Output, "SYSTEM");

  if (!ai04Result.success || !ai04Result.output) {
    console.error("AI-04 failed:", ai04Result.validationErrors);
    return null;
  }

  const ai06Input: AI06Input = { scholarId, recentSessions };

  const ai06Result = await runModule<AI06Output>("AI-06", ai06Input, validateAI06Output, "SYSTEM");

  if (!ai06Result.success || !ai06Result.output) {
    console.error("AI-06 failed:", ai06Result.validationErrors);
    return {
      masteryProbabilities: ai04Result.output.masteryProbabilities,
      gapMap: ai04Result.output.gapMap,
      trend: "NEUTRAL",
      plateauFlag: false,
      volatility: "low",
      runIds: { ai04: ai04Result.runId, ai06: "failed" },
    };
  }

  return {
    masteryProbabilities: ai04Result.output.masteryProbabilities,
    gapMap: ai04Result.output.gapMap,
    trend: ai06Result.output.trend,
    plateauFlag: ai06Result.output.plateauFlag,
    volatility: ai06Result.output.volatility,
    runIds: { ai04: ai04Result.runId, ai06: ai06Result.runId },
  };
}
