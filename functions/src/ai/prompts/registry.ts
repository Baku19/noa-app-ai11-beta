// ═══════════════════════════════════════════════════════════════
// FILE: Prompt Registry
// PURPOSE: Central registry for all AI prompts
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { buildAI01Prompt } from "./ai01.prompt";
import { buildAI02Prompt } from "./ai02.prompt";
import { buildAI03Prompt } from "./ai03.prompt";
import { buildAI04Prompt } from "./ai04.prompt";
import { buildAI05Prompt } from "./ai05.prompt";
import { buildAI06Prompt } from "./ai06.prompt";
import { buildAI07Prompt } from "./ai07.prompt";
import { buildAI08Prompt } from "./ai08.prompt";
import { buildAI09Prompt } from "./ai09.prompt";

export const PROMPT_BUILDERS: Record<string, (input: any) => string> = {
  "AI-01": buildAI01Prompt,
  "AI-02": buildAI02Prompt,
  "AI-03": buildAI03Prompt,
  "AI-04": buildAI04Prompt,
  "AI-05": buildAI05Prompt,
  "AI-06": buildAI06Prompt,
  "AI-07": buildAI07Prompt,
  "AI-08": buildAI08Prompt,
  "AI-09": buildAI09Prompt,
};

export const PROMPT_VERSIONS: Record<string, string> = {
  "AI-01": "1.0",
  "AI-02": "1.0",
  "AI-03": "1.0",
  "AI-04": "1.0",
  "AI-05": "1.0",
  "AI-06": "1.0",
  "AI-07": "1.0",
  "AI-08": "1.0",
  "AI-09": "1.0",
};

export function getPromptBuilder(moduleId: string): ((input: any) => string) | null {
  return PROMPT_BUILDERS[moduleId] || null;
}

export function getPromptVersion(moduleId: string): string {
  return PROMPT_VERSIONS[moduleId] || "unknown";
}

export function hasPrompt(moduleId: string): boolean {
  return moduleId in PROMPT_BUILDERS;
}
