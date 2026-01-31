// ═══════════════════════════════════════════════════════════════
// FILE: config/models.ts
// PURPOSE: Gemini model configuration
// BATCH 7
// ═══════════════════════════════════════════════════════════════

export const MODELS = {
  FLASH: process.env.GEMINI_FLASH_MODEL || "gemini-2.0-flash-exp",
  PRO: process.env.GEMINI_PRO_MODEL || "gemini-1.5-pro",
} as const;

export type ModelKey = keyof typeof MODELS;

export const MODULE_MODEL_MAP: Record<string, ModelKey> = {
  "AI-01": "FLASH",
  "AI-02": "FLASH",
  "AI-03": "FLASH",
  "AI-04": "PRO",
  "AI-05": "FLASH",
  "AI-06": "FLASH",
  "AI-07": "PRO",
  "AI-08": "FLASH",
  "AI-09": "FLASH",
};

export const GENERATION_CONFIG = {
  FLASH: { temperature: 0, maxOutputTokens: 4096, topP: 1, topK: 1 },
  PRO: { temperature: 0, maxOutputTokens: 8192, topP: 1, topK: 1 },
} as const;

export function getModelForModule(moduleId: string): string {
  const modelKey = MODULE_MODEL_MAP[moduleId];
  if (!modelKey) return MODELS.FLASH;
  return MODELS[modelKey];
}

export function getConfigForModule(moduleId: string) {
  const modelKey = MODULE_MODEL_MAP[moduleId] || "FLASH";
  return GENERATION_CONFIG[modelKey];
}

export const REGION = "australia-southeast1";
