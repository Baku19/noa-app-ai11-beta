// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-08 Cohort Signal Monitor
// CRITICAL: Must NEVER identify individual scholars
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI08Input } from "../contracts/ai08.contract";

export function buildAI08Prompt(input: AI08Input): string {
  const aggData = JSON.stringify(input.aggregatedData, null, 2);

  return `You are a cohort analytics system for learning platforms.

TASK: Generate anonymised cohort signals for Year ${input.yearLevel} ${input.domain}.

SKILL: ${input.microSkillId}
AGGREGATED DATA:
${aggData}

CRITICAL RULES:
- NEVER include scholarId, studentId, userId, or names
- Output must be fully anonymised
- Use statistical ranges only

COHORT BANDS:
- BELOW_Q1: bottom 25%
- Q1_Q2: 25th-50th percentile
- Q2_Q3: 50th-75th percentile  
- ABOVE_Q3: top 25%

SIGNAL RULES:
- COHORT_STRONG: skill accuracy above Q3 for cohort
- COHORT_AVERAGE: skill accuracy between Q1-Q3
- COHORT_NEEDS_FOCUS: skill accuracy below Q1

TARGET QUARTILE:
- Where student should aim next
- Q2 if currently below Q1
- Q3 if currently Q1-Q2
- Q4 if currently Q2-Q3

OUTPUT FORMAT (JSON only, no markdown):
{
  "anonymisedRanges": [
    { "band": "BELOW_Q1", "accuracyRange": { "min": 0, "max": 0.4 }, "description": "..." }
  ],
  "cohortSignals": [
    { "microSkillId": "...", "signal": "COHORT_AVERAGE", "targetQuartile": "Q3" }
  ]
}`;
}
