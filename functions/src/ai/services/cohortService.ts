// FILE: ai/services/cohortService.ts
// PURPOSE: Cohort signals using AI-08

import { runModule } from "../runtime/geminiService";
import { AI08Input, AI08Output, validateAI08Output } from "../contracts/ai08.contract";

export interface CohortSignal {
  microSkillId: string;
  signal: string;
  targetQuartile: string;
}

export interface CohortResult {
  anonymisedRanges: Array<{
    band: string;
    accuracyRange: { min: number; max: number };
    description: string;
  }>;
  cohortSignals: CohortSignal[];
  runId: string;
}

export async function generateCohortSignals(
  yearLevel: number,
  domain: string,
  microSkillId: string,
  aggregatedData: {
    totalScholars: number;
    accuracyDistribution: { q1: number; median: number; q3: number };
    timeDistribution: { q1: number; median: number; q3: number };
  }
): Promise<CohortResult | null> {
  const ai08Input: AI08Input = {
    yearLevel,
    domain,
    microSkillId,
    aggregatedData,
  };

  const ai08Result = await runModule<AI08Output>(
    "AI-08",
    ai08Input,
    validateAI08Output,
    "SYSTEM"
  );

  if (!ai08Result.success || !ai08Result.output) {
    console.error("AI-08 failed:", ai08Result.validationErrors);
    return null;
  }

  return {
    anonymisedRanges: ai08Result.output.anonymisedRanges,
    cohortSignals: ai08Result.output.cohortSignals,
    runId: ai08Result.runId,
  };
}
