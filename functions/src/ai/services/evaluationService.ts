// ═══════════════════════════════════════════════════════════════
// FILE: ai/services/evaluationService.ts
// PURPOSE: Response evaluation using AI-02 and AI-03
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { runModule } from "../runtime/geminiService";
import { AI02Input, AI02Output, validateAI02Output } from "../contracts/ai02.contract";
import { AI03Input, AI03Output, validateAI03Output } from "../contracts/ai03.contract";

export interface EvaluationResult {
  isCorrect: boolean;
  errorTags: string[];
  calibrationStatus: string;
  confidenceAccuracyGap: number;
  engagementFlags: {
    rapidGuessing: boolean;
    fatigueRisk: string;
  };
  runIds: { ai02: string; ai03: string };
}

export async function evaluateResponse(
  itemId: string,
  questionType: "mcq" | "short" | "extended",
  prompt: string,
  correctAnswer: string,
  studentResponse: string,
  confidenceRating: number,
  timeMs: number,
  attemptNumber: number,
  recentAccuracy: number
): Promise<EvaluationResult | null> {
  // AI-02: Evaluate response
  const ai02Input: AI02Input = {
    itemId,
    questionType,
    prompt,
    correctAnswer,
    studentResponse,
    timeMs,
    attemptNumber,
  };

  const ai02Result = await runModule<AI02Output>(
    "AI-02",
    ai02Input,
    validateAI02Output,
    "SYSTEM"
  );

  if (!ai02Result.success || !ai02Result.output) {
    console.error("AI-02 failed:", ai02Result.validationErrors);
    return null;
  }

  // AI-03: Interpret confidence
  const difficulty = "medium"; // TODO: Get from question
  const ai03Input: AI03Input = {
    isCorrect: ai02Result.output.isCorrect,
    confidenceRating,
    timeMs,
    difficulty,
    attemptNumber,
    recentAccuracy,
  };

  const ai03Result = await runModule<AI03Output>(
    "AI-03",
    ai03Input,
    validateAI03Output,
    "SYSTEM"
  );

  if (!ai03Result.success || !ai03Result.output) {
    console.error("AI-03 failed:", ai03Result.validationErrors);
    // Return AI-02 results with defaults for AI-03
    return {
      isCorrect: ai02Result.output.isCorrect,
      errorTags: ai02Result.output.errorTags,
      calibrationStatus: "CALIBRATED",
      confidenceAccuracyGap: 0,
      engagementFlags: { rapidGuessing: false, fatigueRisk: "LOW" },
      runIds: { ai02: ai02Result.runId, ai03: "failed" },
    };
  }

  return {
    isCorrect: ai02Result.output.isCorrect,
    errorTags: ai02Result.output.errorTags,
    calibrationStatus: ai03Result.output.calibrationStatus,
    confidenceAccuracyGap: ai03Result.output.confidenceAccuracyGap,
    engagementFlags: ai03Result.output.engagementFlags,
    runIds: { ai02: ai02Result.runId, ai03: ai03Result.runId },
  };
}
