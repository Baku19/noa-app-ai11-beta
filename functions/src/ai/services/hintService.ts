// FILE: ai/services/hintService.ts
// PURPOSE: Hint generation using AI-05 (CRITICAL: no answer reveal)

import { runModule } from "../runtime/geminiService";
import { AI05Input, AI05Output, validateAI05Output } from "../contracts/ai05.contract";

export interface HintResult {
  hint: string;
  scaffoldLevel: 1 | 2 | 3;
  nextPrompt: string | null;
  runId: string;
}

export async function generateHint(
  yearLevel: number,
  skillTag: string,
  prompt: string,
  studentAttempt: string,
  errorTags: string[],
  scaffoldLevel: 1 | 2 | 3,
  correctAnswer: string
): Promise<HintResult | null> {
  const ai05Input: AI05Input = {
    yearLevel,
    skillTag,
    prompt,
    studentAttempt,
    errorTags,
    scaffoldLevel,
    correctAnswer,
  };

  const ai05Result = await runModule<AI05Output>(
    "AI-05",
    ai05Input,
    (output) => validateAI05Output(output, ai05Input),
    "CHILD",
    correctAnswer
  );

  if (!ai05Result.success || !ai05Result.output) {
    console.error("AI-05 failed:", ai05Result.validationErrors);
    return null;
  }

  return {
    hint: ai05Result.output.hint,
    scaffoldLevel: ai05Result.output.scaffoldLevel,
    nextPrompt: ai05Result.output.nextPrompt,
    runId: ai05Result.runId,
  };
}

export function getStaticHint(scaffoldLevel: number, skillTag: string): string {
  const hints: Record<number, string> = {
    1: "Take another look at the question. What is it really asking?",
    2: "Think about " + skillTag + ". What do you know about this?",
    3: "Break it down step by step. What is the first thing to figure out?",
  };
  return hints[scaffoldLevel] || hints[1];
}
