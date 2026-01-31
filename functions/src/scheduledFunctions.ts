// FILE: scheduledFunctions.ts
// PURPOSE: Scheduled batch jobs
// BATCH 7

import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { REGION } from "./config/models";
import { runInventoryScan } from "./ai/jobs/inventoryScan.job";
import { runCohortSignalsJob } from "./ai/jobs/cohortSignals.job";
import { generateParentInsight, getStaticInsight } from "./ai/services/insightsService";
import { syncParentInsight } from "./ai/services/dataSyncService";
import * as admin from "firebase-admin";

const db = admin.firestore();

// Nightly inventory scan - 2:00 AM AEST
export const dailyInventoryScan = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "Australia/Sydney",
    region: REGION,
  },
  async () => {
    console.log("Starting daily inventory scan...");
    const result = await runInventoryScan();
    console.log("Inventory scan complete:", result);
  }
);

// Nightly cohort signals - 3:00 AM AEST
export const dailyCohortSignals = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Australia/Sydney",
    region: REGION,
  },
  async () => {
    console.log("Starting cohort signals job...");
    const result = await runCohortSignalsJob();
    console.log("Cohort signals complete:", result);
  }
);

// Parent insight generation
export const getParentInsight = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { familyId, scholarId } = request.data;

    if (!familyId || !scholarId) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const scholarDoc = await db.collection("families").doc(familyId)
      .collection("scholars").doc(scholarId).get();

    if (!scholarDoc.exists) {
      throw new HttpsError("not-found", "Scholar not found");
    }

    const scholar = scholarDoc.data()!;

    const sessionsSnap = await db.collection("families").doc(familyId)
      .collection("sessions")
      .where("scholarId", "==", scholarId)
      .where("status", "==", "COMPLETED")
      .orderBy("completedAt", "desc")
      .limit(10)
      .get();

    const sessionsCompleted = sessionsSnap.size;

    if (sessionsCompleted < 3) {
      return getStaticInsight(scholar.displayName || "Your child", sessionsCompleted);
    }

    let recentAccuracy = 0;
    let trend = "NEUTRAL";
    const strengths: string[] = [];
    const focusAreas: string[] = [];

    const accuracies: number[] = [];
    sessionsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.accuracyRate !== undefined) {
        accuracies.push(data.accuracyRate);
      }
    });

    if (accuracies.length > 0) {
      recentAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;

      if (accuracies.length >= 3) {
        const recent = accuracies.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
        const older = accuracies.slice(-3).reduce((a, b) => a + b, 0) / 3;
        if (recent > older + 0.05) trend = "UP";
        else if (recent < older - 0.05) trend = "DOWN";
      }
    }

    let insight = await generateParentInsight(
      scholar.displayName || "Your child",
      scholar.yearLevel || 5,
      { trend, recentAccuracy, sessionsCompleted },
      strengths,
      focusAreas
    );

    if (!insight) {
      insight = getStaticInsight(scholar.displayName || "Your child", sessionsCompleted);
    }

    await syncParentInsight(familyId, scholarId, insight);
    return insight;
  }
);

// Manual trigger for testing
export const manualInventoryScan = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }
    const result = await runInventoryScan();
    return result;
  }
);
