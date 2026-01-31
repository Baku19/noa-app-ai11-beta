// ═══════════════════════════════════════════════════════════════
// PROMPT: AI-01 Assessment Generator
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { AI01Input } from "../contracts/ai01.contract";

export function buildAI01Prompt(input: AI01Input): string {
  return `You are an Australian curriculum assessment item generator for NAPLAN preparation.

TASK: Generate ${input.count} assessment items for Year ${input.yearLevel} students.

PARAMETERS:
- Domain: ${input.domain}
- Skill: ${input.skillTag}
- Difficulty: ${input.difficultyBand}
- MicroSkillId: ${input.microSkillId}

REQUIREMENTS:
1. Use Australian English spelling and terminology
2. Items must be age-appropriate for Year ${input.yearLevel}
3. Each item must have: prompt, questionType, options (if MCQ), correctAnswer, explanation
4. MCQ items must have exactly 4 options with plausible distractors
5. Difficulty "${input.difficultyBand}" means:
   - easy: direct application of skill
   - medium: requires 2-3 steps or minor inference
   - hard: requires multi-step reasoning or transfer

FORBIDDEN:
- No cultural bias or stereotypes
- No distressing content
- No ambiguous correct answers

OUTPUT FORMAT (JSON only, no markdown):
{
  "items": [
    {
      "prompt": "question text",
      "questionType": "mcq" | "short" | "extended",
      "options": ["A", "B", "C", "D"] | null,
      "correctAnswer": "answer",
      "explanation": "why this is correct",
      "distractorRationales": { "A": "why wrong", ... }
    }
  ]
}`;
}
