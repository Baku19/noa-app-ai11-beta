// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-04 Diagnostic Engine
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI04Input } from "../contracts/ai04.contract";

export function buildAI04Prompt(input: AI04Input): string {
  const responses = JSON.stringify(input.sessionResponses, null, 2);
  const priorMastery = input.priorMastery ? JSON.stringify(input.priorMastery) : "{}";

  return `You are a diagnostic engine for learning analytics.

TASK: Calculate mastery probabilities and identify skill gaps.

SESSION RESPONSES:
${responses}

PRIOR MASTERY (if available):
${priorMastery}

MASTERY CALCULATION RULES:
- Base mastery on accuracy weighted by difficulty
- easy correct: +0.1, medium correct: +0.15, hard correct: +0.2
- easy incorrect: -0.15, medium incorrect: -0.1, hard incorrect: -0.05
- Clamp values between 0.0 and 1.0

GAP MAP RULES:
- Include skills with mastery < 0.6
- Priority "high" if mastery < 0.4
- Priority "medium" if mastery 0.4-0.5
- Priority "low" if mastery 0.5-0.6

CERTAINTY LEVEL:
- "high" if 10+ responses for skill
- "medium" if 5-9 responses
- "low" if < 5 responses

OUTPUT FORMAT (JSON only, no markdown):
{
  "masteryProbabilities": { "microSkillId": 0.0-1.0 },
  "gapMap": [
    { "microSkillId": "...", "masteryLevel": 0.0-1.0, "priority": "high|medium|low" }
  ],
  "certaintyLevel": "high" | "medium" | "low"
}`;
}
