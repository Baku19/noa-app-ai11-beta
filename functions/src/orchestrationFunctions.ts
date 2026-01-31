// FILE: orchestrationFunctions.ts
// PURPOSE: AI-powered session planning and generation functions
// BATCH 7

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { REGION } from "./config/models";
import { createAISessionPlan } from "./ai/services/orchestrationService";
import { generateAssessmentItems } from "./ai/services/generationService";
import { Domain, Difficulty } from "./shared/types";

const db = admin.firestore();

export const createAISession = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { familyId, scholarId, domain, questionCount = 10 } = request.data;

    if (!familyId || !scholarId || !domain) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    // Get scholar info
    const scholarDoc = await db.collection("families").doc(familyId)
      .collection("scholars").doc(scholarId).get();

    if (!scholarDoc.exists) {
      throw new HttpsError("not-found", "Scholar not found");
    }

    const scholar = scholarDoc.data()!;
    const yearLevel = scholar.yearLevel || 5;

    // Get recent diagnostics if available
    const lastSessionSnap = await db.collection("families").doc(familyId)
      .collection("sessions")
      .where("scholarId", "==", scholarId)
      .where("status", "==", "COMPLETED")
      .orderBy("completedAt", "desc")
      .limit(1)
      .get();

    let priorDiagnostics = undefined;
    if (!lastSessionSnap.empty) {
      const lastSession = lastSessionSnap.docs[0].data();
      if (lastSession.diagnostics) {
        priorDiagnostics = lastSession.diagnostics;
      }
    }

    // Get recently served items to avoid repetition
    const recentResponsesSnap = await db.collection("families").doc(familyId)
      .collection("sessions")
      .where("scholarId", "==", scholarId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const recentlyServedItemIds: string[] = [];
    for (const sessionDoc of recentResponsesSnap.docs) {
      const questionIds = sessionDoc.data().questionIds || [];
      recentlyServedItemIds.push(...questionIds);
    }

    // Create AI session plan
    const plan = await createAISessionPlan(
      scholarId,
      familyId,
      yearLevel,
      domain as Domain,
      questionCount,
      recentlyServedItemIds,
      priorDiagnostics
    );

    // Create session document
    const sessionRef = db.collection("families").doc(familyId).collection("sessions").doc();

    await sessionRef.set({
      id: sessionRef.id,
      scholarId,
      familyId,
      domain,
      yearLevel,
      questionIds: plan.questionIds,
      questionCount: plan.questionIds.length,
      targetDifficulty: plan.targetDifficulty,
      sessionMix: plan.sessionMix,
      status: "PLANNED",
      coordinationRunId: plan.coordinationRunId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      sessionId: sessionRef.id,
      questionIds: plan.questionIds,
      questionCount: plan.questionIds.length,
      inventorySufficient: plan.inventorySufficient,
    };
  }
);

export const triggerGeneration = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { yearLevel, domain, microSkillId, skillTag, difficultyBand, count = 3 } = request.data;

    if (!yearLevel || !domain || !microSkillId || !skillTag || !difficultyBand) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const result = await generateAssessmentItems(
      yearLevel,
      domain as Domain,
      microSkillId,
      skillTag,
      difficultyBand as Difficulty,
      count
    );

    return result;
  }
);
