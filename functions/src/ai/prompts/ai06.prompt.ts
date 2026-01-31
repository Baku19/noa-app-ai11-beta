// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-06 Progress Monitor
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI06Input } from "../contracts/ai06.contract";

export function buildAI06Prompt(input: AI06Input): string {
  const sessions = JSON.stringify(input.recentSessions, null, 2);

  return `You are a progress monitoring system for learning analytics.

TASK: Analyze learning trends and detect plateaus.

RECENT SESSIONS:
${sessions}

HISTORICAL ACCURACY: ${input.historicalAccuracy ?? "not available"}

TREND RULES:
- UP: accuracy improved 5%+ over last 3 sessions
- DOWN: accuracy declined 5%+ over last 3 sessions
- NEUTRAL: within 5% variance

PLATEAU DETECTION:
- plateauFlag: true if accuracy stable (within 5%) for 3+ sessions AND not improving

VOLATILITY:
- high: accuracy swings >15% between sessions
- medium: swings 8-15%
- low: swings <8%

ACCELERATION:
- Positive number if improvement accelerating
- Negative if slowing down
- Near zero if steady

OUTPUT FORMAT (JSON only, no markdown):
{
  "trend": "UP" | "NEUTRAL" | "DOWN",
  "plateauFlag": true | false,
  "volatility": "low" | "medium" | "high",
  "accelerationSignal": -1.0 to 1.0,
  "skillTrends": { "microSkillId": "UP" | "NEUTRAL" | "DOWN" }
}`;
}
