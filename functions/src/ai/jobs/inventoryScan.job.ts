// FILE: ai/jobs/inventoryScan.job.ts
// PURPOSE: Nightly inventory scan to trigger generation when low

import * as admin from "firebase-admin";
import { countServeableItems } from "../../db/questionBank.repo";
import { generateAssessmentItems } from "../services/generationService";
import { Domain, Difficulty } from "../../shared/types";

const db = admin.firestore();
const MIN_ITEMS_PER_SKILL = 5;
const GENERATION_BATCH_SIZE = 3;

export interface InventoryScanResult {
  scanned: number;
  shortfalls: number;
  generated: number;
  errors: string[];
}

export async function runInventoryScan(): Promise<InventoryScanResult> {
  const result: InventoryScanResult = { scanned: 0, shortfalls: 0, generated: 0, errors: [] };

  try {
    const coverageSnap = await db.collection("coverageMap").get();

    for (const doc of coverageSnap.docs) {
      const skill = doc.data();
      const microSkillId = skill.microSkillId;
      const skillTag = skill.skillTag;
      const domain = skill.domain as Domain;
      const yearMin = skill.yearMin || 3;

      for (const difficulty of ["easy", "medium", "hard"] as Difficulty[]) {
        result.scanned++;

        const count = await countServeableItems(microSkillId, difficulty);

        if (count < MIN_ITEMS_PER_SKILL) {
          result.shortfalls++;

          try {
            const genResult = await generateAssessmentItems(
              yearMin,
              domain,
              microSkillId,
              skillTag,
              difficulty,
              GENERATION_BATCH_SIZE
            );
            result.generated += genResult.approved;
          } catch (error) {
            result.errors.push(`${microSkillId}/${difficulty}: ${(error as Error).message}`);
          }
        }
      }
    }

    // Log scan result
    await db.collection("systemLogs").add({
      type: "INVENTORY_SCAN",
      result,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (error) {
    result.errors.push(`Scan failed: ${(error as Error).message}`);
  }

  return result;
}
