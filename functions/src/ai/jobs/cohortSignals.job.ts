// FILE: ai/jobs/cohortSignals.job.ts
// PURPOSE: Nightly cohort signal aggregation

import * as admin from "firebase-admin";
import { generateCohortSignals } from "../services/cohortService";

const db = admin.firestore();

export interface CohortJobResult {
  skillsProcessed: number;
  signalsGenerated: number;
  errors: string[];
}

export async function runCohortSignalsJob(): Promise<CohortJobResult> {
  const result: CohortJobResult = { skillsProcessed: 0, signalsGenerated: 0, errors: [] };

  try {
    const coverageSnap = await db.collection("coverageMap").get();

    for (const doc of coverageSnap.docs) {
      const skill = doc.data();
      result.skillsProcessed++;

      const responsesSnap = await db.collectionGroup("responses")
        .where("microSkillId", "==", skill.microSkillId)
        .limit(1000)
        .get();

      if (responsesSnap.empty) continue;

      const accuracies: number[] = [];
      const times: number[] = [];

      responsesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.isCorrect !== undefined) {
          accuracies.push(data.isCorrect ? 1 : 0);
        }
        if (data.timeMs) {
          times.push(data.timeMs);
        }
      });

      if (accuracies.length < 10) continue;

      accuracies.sort((a, b) => a - b);
      times.sort((a, b) => a - b);

      const q1Idx = Math.floor(accuracies.length * 0.25);
      const medIdx = Math.floor(accuracies.length * 0.5);
      const q3Idx = Math.floor(accuracies.length * 0.75);

      const aggregatedData = {
        totalScholars: accuracies.length,
        accuracyDistribution: {
          q1: accuracies[q1Idx],
          median: accuracies[medIdx],
          q3: accuracies[q3Idx],
        },
        timeDistribution: {
          q1: times[q1Idx] || 0,
          median: times[medIdx] || 0,
          q3: times[q3Idx] || 0,
        },
      };

      try {
        const signals = await generateCohortSignals(
          skill.yearMin || 5,
          skill.domain,
          skill.microSkillId,
          aggregatedData
        );

        if (signals) {
          await db.collection("cohortSignals").doc(skill.microSkillId).set({
            ...signals,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          result.signalsGenerated++;
        }
      } catch (error) {
        result.errors.push(skill.microSkillId + ": " + (error as Error).message);
      }
    }

    await db.collection("systemLogs").add({
      type: "COHORT_SIGNALS",
      result,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (error) {
    result.errors.push("Job failed: " + (error as Error).message);
  }

  return result;
}
