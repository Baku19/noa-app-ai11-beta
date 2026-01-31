// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-03 Confidence Interpreter
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI03Input } from "../contracts/ai03.contract";

export function buildAI03Prompt(input: AI03Input): string {
  return `You are a confidence calibration analyzer for learning systems.

TASK: Analyze the student's confidence vs actual performance.

DATA:
- Was correct: ${input.isCorrect}
- Confidence rating (1-5): ${input.confidenceRating}
- Time taken: ${input.timeMs}ms
- Difficulty: ${input.difficulty}
- Attempt number: ${input.attemptNumber}
- Recent accuracy: ${input.recentAccuracy}

CALIBRATION RULES:
- OVER_CONFIDENT: High confidence (4-5) but incorrect
- UNDER_CONFIDENT: Low confidence (1-2) but correct
- CALIBRATED: Confidence matches performance

ENGAGEMENT FLAGS:
- rapidGuessing: true if timeMs < 3000 and confidence low
- fatigueRisk: HIGH if time increasing + accuracy dropping
               MEDIUM if one indicator present
               LOW if neither

OUTPUT FORMAT (JSON only, no markdown):
{
  "calibrationStatus": "OVER_CONFIDENT" | "UNDER_CONFIDENT" | "CALIBRATED",
  "confidenceAccuracyGap": -1.0 to 1.0,
  "engagementFlags": {
    "rapidGuessing": true | false,
    "fatigueRisk": "LOW" | "MEDIUM" | "HIGH"
  }
}`;
}
