// ═══════════════════════════════════════════════════════════════
// FILE: ai/runtime/geminiClient.ts
// PURPOSE: Gemini API client with retry logic
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getModelForModule, getConfigForModule } from "../../config/models";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface GeminiCallResult {
  text: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  modelVersion: string;
}

export async function callGemini(
  moduleId: string,
  prompt: string,
  maxRetries: number = 3
): Promise<GeminiCallResult> {
  const client = getClient();
  const modelName = getModelForModule(moduleId);
  const config = getConfigForModule(moduleId);

  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: config,
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const startTime = Date.now();

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const latencyMs = Date.now() - startTime;

      const usage = response.usageMetadata;

      return {
        text,
        promptTokens: usage?.promptTokenCount || 0,
        completionTokens: usage?.candidatesTokenCount || 0,
        latencyMs,
        modelVersion: modelName,
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`Gemini call attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError || new Error("Gemini call failed after retries");
}
