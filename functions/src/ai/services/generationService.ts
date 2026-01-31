// FILE: ai/services/generationService.ts
// PURPOSE: Question generation using AI-01

import { runModule } from "../runtime/geminiService";
import { AI01Input, AI01Output, validateAI01Output } from "../contracts/ai01.contract";
import { runSafetyCheck } from "../contracts/ai10.contract";
import { runSystemAudit } from "../contracts/ai11.contract";
import { saveDraftQuestions, approveQuestions } from "../../db/questionBank.repo";
import { Domain, Difficulty } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

export interface GenerationResult {
  generated: number;
  approved: number;
  rejected: number;
  itemIds: string[];
  runId: string;
}

export async function generateAssessmentItems(
  yearLevel: number,
  domain: Domain,
  microSkillId: string,
  skillTag: string,
  difficultyBand: Difficulty,
  count: number = 3
): Promise<GenerationResult> {
  const ai01Input: AI01Input = {
    yearLevel,
    domain,
    microSkillId,
    skillTag,
    difficultyBand,
    count,
  };

  const ai01Result = await runModule<AI01Output>(
    "AI-01",
    ai01Input,
    (output) => validateAI01Output(output, ai01Input),
    "SYSTEM"
  );

  if (!ai01Result.success || !ai01Result.output) {
    console.error("AI-01 failed:", ai01Result.validationErrors);
    return { generated: 0, approved: 0, rejected: 0, itemIds: [], runId: ai01Result.runId };
  }

  const items = ai01Result.output.items;
  const publicItems: any[] = [];
  const privateItems: any[] = [];
  const approvedIds: string[] = [];
  const rejectedIds: string[] = [];
  const rejectionReasons: string[] = [];

  for (const item of items) {
    const itemId = uuidv4();

    // Run AI-10 safety check on each item
    const safetyResult = runSafetyCheck({
      moduleId: "AI-01",
      outputText: item.prompt + " " + (item.options?.join(" ") || ""),
      targetAudience: "CHILD",
    });

    if (safetyResult.decision === "BLOCK") {
      rejectedIds.push(itemId);
      rejectionReasons.push(...safetyResult.reasonCodes);
      continue;
    }

    // Run AI-11 audit
    const auditResult = runSystemAudit({
      moduleId: "AI-01",
      output: { items: [item] },
    });

    if (!auditResult.schemaCompliance) {
      rejectedIds.push(itemId);
      rejectionReasons.push(...auditResult.violations);
      continue;
    }

    publicItems.push({
      itemId,
      microSkillId,
      domain,
      yearMin: yearLevel,
      yearMax: yearLevel + 1,
      difficultyBand,
      questionType: item.questionType,
      prompt: item.prompt,
      options: item.options,
      isActive: true,
    });

    privateItems.push({
      itemId,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      markingLogic: item.questionType === "mcq" ? "EXACT" : "REGEX",
      distractorRationales: item.distractorRationales,
    });

    approvedIds.push(itemId);
  }

  // Save draft questions
  if (publicItems.length > 0) {
    await saveDraftQuestions(publicItems, privateItems);
    // Auto-approve (AI-11 validated)
    await approveQuestions(approvedIds, "AI-11");
  }

  return {
    generated: items.length,
    approved: approvedIds.length,
    rejected: rejectedIds.length,
    itemIds: approvedIds,
    runId: ai01Result.runId,
  };
}
