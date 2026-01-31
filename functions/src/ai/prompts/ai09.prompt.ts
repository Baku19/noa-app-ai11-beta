// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-09 Coordination Extractor
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI09Input } from "../contracts/ai09.contract";

export function buildAI09Prompt(input: AI09Input): string {
  const ai04 = JSON.stringify(input.ai04Summary, null, 2);
  const ai06 = JSON.stringify(input.ai06Summary, null, 2);
  const ai08 = input.ai08Summary ? JSON.stringify(input.ai08Summary, null, 2) : "null";

  return `You are a learning coordination system.

TASK: Generate a coordination object for session planning.

SCHOLAR CONTEXT:
- Year Level: ${input.yearLevel} (LOCKED - cannot change)
- Current Mode: ${input.currentMode}
- Weeks Until NAPLAN: ${input.weeksUntilNaplan ?? "N/A"}

AI-04 DIAGNOSTIC SUMMARY:
${ai04}

AI-06 PROGRESS SUMMARY:
${ai06}

AI-08 COHORT SIGNALS:
${ai08}

DECISION RULES:
- If plateauFlag: increase interleaving, consider difficulty adjustment
- If trend DOWN: increase support, decrease difficulty
- If trend UP: consider fading support, maintain or increase difficulty
- If NAPLAN_BLITZ mode: focus on high-priority gaps

SESSION MIX (must sum to 1.0):
- reinforce: practice mastered skills (0.2-0.4)
- target: focus on current learning edge (0.4-0.6)
- stretch: challenge with harder items (0.1-0.3)

CONSTRAINTS:
- yearLevel is LOCKED - never recommend changing it
- mustNot must include "change_year_level"
- difficultyDelta must be between -1 and 1

OUTPUT FORMAT (JSON only, no markdown):
{
  "schemaVersion": "1.0",
  "scope": { "scholarId": "${input.scholarId}", "validFrom": "ISO_DATE", "validUntil": "ISO_DATE" },
  "signals": { "trend": "...", "plateauFlag": false, "calibrationStatus": "...", "fatigueRisk": "..." },
  "recommendedAdjustments": {
    "supportLevel": "INCREASE" | "MAINTAIN" | "FADE",
    "difficultyDelta": -1 to 1,
    "sessionMix": { "reinforce": 0.3, "target": 0.5, "stretch": 0.2 },
    "focusMicroSkillIds": ["skill1", "skill2"]
  },
  "constraints": { "yearLevel": ${input.yearLevel}, "mustNot": ["change_year_level"] },
  "decisionRationale": ["REASON_CODE_1", "REASON_CODE_2"]
}`;
}
