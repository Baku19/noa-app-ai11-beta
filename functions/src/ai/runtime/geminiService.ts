// ═══════════════════════════════════════════════════════════════
// FILE: ai/runtime/geminiService.ts
// PURPOSE: High-level AI module execution service
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { callGemini, GeminiCallResult } from "./geminiClient";
import { getPromptBuilder, getPromptVersion, hasPrompt } from "../prompts/registry";
import { runSafetyCheck } from "../contracts/ai10.contract";
import { runSystemAudit } from "../contracts/ai11.contract";
import { v4 as uuidv4 } from "uuid";

export interface ModuleRunResult<T> {
  success: boolean;
  output: T | null;
  runId: string;
  moduleId: string;
  promptVersion: string;
  modelVersion: string;
  latencyMs: number;
  tokensUsed: { prompt: number; completion: number };
  validationErrors: string[];
  safetyDecision: string;
}

function parseJsonResponse(text: string): unknown {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return JSON.parse(cleaned.trim());
}

export async function runModule<T>(
  moduleId: string,
  input: unknown,
  validator: (output: unknown, input?: unknown) => { pass: boolean; reasons: string[] },
  targetAudience: "CHILD" | "PARENT" | "SYSTEM" = "SYSTEM",
  correctAnswer?: string
): Promise<ModuleRunResult<T>> {
  const runId = uuidv4();
  const promptVersion = getPromptVersion(moduleId);

  // Check if module has a prompt (rules engines don't)
  if (!hasPrompt(moduleId)) {
    return {
      success: false,
      output: null,
      runId,
      moduleId,
      promptVersion: "RULES_ENGINE",
      modelVersion: "N/A",
      latencyMs: 0,
      tokensUsed: { prompt: 0, completion: 0 },
      validationErrors: ["Module is rules engine, use direct function"],
      safetyDecision: "N/A",
    };
  }

  // Build prompt
  const promptBuilder = getPromptBuilder(moduleId);
  if (!promptBuilder) {
    throw new Error(`No prompt builder for ${moduleId}`);
  }
  const prompt = promptBuilder(input);

  // Call Gemini
  let geminiResult: GeminiCallResult;
  try {
    geminiResult = await callGemini(moduleId, prompt);
  } catch (error) {
    return {
      success: false,
      output: null,
      runId,
      moduleId,
      promptVersion,
      modelVersion: "error",
      latencyMs: 0,
      tokensUsed: { prompt: 0, completion: 0 },
      validationErrors: [(error as Error).message],
      safetyDecision: "ERROR",
    };
  }

  // Parse JSON response
  let parsed: unknown;
  try {
    parsed = parseJsonResponse(geminiResult.text);
  } catch (error) {
    return {
      success: false,
      output: null,
      runId,
      moduleId,
      promptVersion,
      modelVersion: geminiResult.modelVersion,
      latencyMs: geminiResult.latencyMs,
      tokensUsed: { prompt: geminiResult.promptTokens, completion: geminiResult.completionTokens },
      validationErrors: ["JSON parse error: " + (error as Error).message],
      safetyDecision: "PARSE_ERROR",
    };
  }

  // Run AI-10 Safety Check
  const safetyResult = runSafetyCheck({
    moduleId,
    outputText: geminiResult.text,
    targetAudience,
    correctAnswer,
  });

  if (safetyResult.decision === "BLOCK") {
    return {
      success: false,
      output: null,
      runId,
      moduleId,
      promptVersion,
      modelVersion: geminiResult.modelVersion,
      latencyMs: geminiResult.latencyMs,
      tokensUsed: { prompt: geminiResult.promptTokens, completion: geminiResult.completionTokens },
      validationErrors: safetyResult.reasonCodes,
      safetyDecision: "BLOCK",
    };
  }

  // Run AI-11 System Audit
  const auditResult = runSystemAudit({
    moduleId,
    output: parsed as Record<string, unknown>,
  });

  if (!auditResult.schemaCompliance || !auditResult.rolePurity) {
    return {
      success: false,
      output: null,
      runId,
      moduleId,
      promptVersion,
      modelVersion: geminiResult.modelVersion,
      latencyMs: geminiResult.latencyMs,
      tokensUsed: { prompt: geminiResult.promptTokens, completion: geminiResult.completionTokens },
      validationErrors: auditResult.violations,
      safetyDecision: safetyResult.decision,
    };
  }

  // Run contract validator
  const validation = validator(parsed, input);

  return {
    success: validation.pass,
    output: validation.pass ? (parsed as T) : null,
    runId,
    moduleId,
    promptVersion,
    modelVersion: geminiResult.modelVersion,
    latencyMs: geminiResult.latencyMs,
    tokensUsed: { prompt: geminiResult.promptTokens, completion: geminiResult.completionTokens },
    validationErrors: validation.reasons,
    safetyDecision: safetyResult.decision,
  };
}
