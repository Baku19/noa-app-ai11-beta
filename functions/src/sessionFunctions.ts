// FILE: sessionFunctions.ts
// PURPOSE: AI-powered session Cloud Functions
// BATCH 7

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { REGION } from "./config/models";
import { evaluateResponse } from "./ai/services/evaluationService";
import { generateHint, getStaticHint } from "./ai/services/hintService";
import { runPostSessionDiagnostics } from "./ai/services/diagnosticService";
import { getQuestionWithAnswer } from "./db/questionBank.repo";
import { syncTopicProgress, syncWeeklyStats, syncConfidenceTracking } from "./ai/services/dataSyncService";

const db = admin.firestore();

export const submitResponse = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { familyId, sessionId, questionId, scholarAnswer, confidenceRating, timeMs } = request.data;

    if (!familyId || !sessionId || !questionId || scholarAnswer === undefined) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const question = await getQuestionWithAnswer(questionId);
    if (!question) {
      throw new HttpsError("not-found", "Question not found");
    }

    const sessionRef = db.collection("families").doc(familyId).collection("sessions").doc(sessionId);
    const responseRef = sessionRef.collection("responses").doc(questionId);

    const existingResponse = await responseRef.get();
    const attemptNumber = existingResponse.exists ? (existingResponse.data()?.attemptNumber || 0) + 1 : 1;

    let evaluation = null;
    try {
      evaluation = await evaluateResponse(
        questionId,
        question.public.questionType,
        question.public.prompt,
        question.private.correctAnswer,
        scholarAnswer,
        confidenceRating || 3,
        timeMs || 0,
        attemptNumber,
        0.7
      );
    } catch (error) {
      console.error("AI evaluation failed, using fallback:", error);
    }

    const isCorrect = evaluation?.isCorrect ?? (scholarAnswer === question.private.correctAnswer);

    await responseRef.set({
      questionId,
      scholarAnswer,
      isCorrect,
      microSkillId: question.public.microSkillId,
      confidenceRating: confidenceRating || null,
      timeMs: timeMs || null,
      attemptNumber,
      errorTags: evaluation?.errorTags || [],
      calibrationStatus: evaluation?.calibrationStatus || null,
      engagementFlags: evaluation?.engagementFlags || null,
      aiRunIds: evaluation?.runIds || null,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return {
      isCorrect,
      errorTags: evaluation?.errorTags || [],
      attemptNumber,
    };
  }
);

export const getAIHint = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { questionId, studentAttempt, scaffoldLevel = 1, errorTags = [] } = request.data;

    if (!questionId) {
      throw new HttpsError("invalid-argument", "Missing questionId");
    }

    const question = await getQuestionWithAnswer(questionId);
    if (!question) {
      throw new HttpsError("not-found", "Question not found");
    }

    const skillTag = question.public.microSkillId;
    const yearLevel = question.public.yearMin;

    let hintResult = null;
    try {
      hintResult = await generateHint(
        yearLevel,
        skillTag,
        question.public.prompt,
        studentAttempt || "",
        errorTags,
        scaffoldLevel as 1 | 2 | 3,
        question.private.correctAnswer
      );
    } catch (error) {
      console.error("AI hint failed, using fallback:", error);
    }

    if (hintResult) {
      return {
        guidanceText: hintResult.hint,
        scaffoldLevel: hintResult.scaffoldLevel,
        aiGenerated: true,
      };
    }

    return {
      guidanceText: getStaticHint(scaffoldLevel, skillTag),
      scaffoldLevel,
      aiGenerated: false,
    };
  }
);

export const finaliseSessionAI = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { familyId, sessionId, scholarId } = request.data;

    if (!familyId || !sessionId || !scholarId) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const sessionRef = db.collection("families").doc(familyId).collection("sessions").doc(sessionId);
    const sessionDoc = await sessionRef.get();
    const sessionData = sessionDoc.data();
    const responsesSnap = await sessionRef.collection("responses").get();

    const sessionResponses: Array<{
      microSkillId: string;
      isCorrect: boolean;
      difficulty: "easy" | "medium" | "hard";
      timeMs: number;
    }> = [];

    let correct = 0;
    let total = 0;
    let totalTimeMs = 0;
    const topicsPracticed: string[] = [];
    const skillTagMap: Record<string, { topic: string; domain: string }> = {};
    let lastCalibrationStatus = "CALIBRATED";

    for (const doc of responsesSnap.docs) {
      const resp = doc.data();
      const question = await getQuestionWithAnswer(resp.questionId);
      if (question) {
        sessionResponses.push({
          microSkillId: question.public.microSkillId,
          isCorrect: resp.isCorrect,
          difficulty: question.public.difficultyBand,
          timeMs: resp.timeMs || 0,
        });
        if (resp.isCorrect) correct++;
        total++;
        totalTimeMs += resp.timeMs || 0;

        const topic = question.public.microSkillId;
        if (!topicsPracticed.includes(topic)) {
          topicsPracticed.push(topic);
        }
        skillTagMap[topic] = { topic, domain: question.public.domain };

        if (resp.calibrationStatus) {
          lastCalibrationStatus = resp.calibrationStatus;
        }
      }
    }

    const recentSessionsSnap = await db.collection("families").doc(familyId)
      .collection("sessions")
      .where("scholarId", "==", scholarId)
      .where("status", "==", "COMPLETED")
      .orderBy("completedAt", "desc")
      .limit(10)
      .get();

    const recentSessions = recentSessionsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        date: data.completedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        domain: data.domain || "numeracy",
        accuracy: data.accuracyRate || 0,
        questionsAttempted: data.questionCount || 0,
      };
    });

    let diagnostics = null;
    try {
      diagnostics = await runPostSessionDiagnostics(scholarId, sessionResponses, recentSessions);
    } catch (error) {
      console.error("AI diagnostics failed:", error);
    }

    const accuracyRate = total > 0 ? correct / total : 0;
    const domain = sessionData?.domain || "numeracy";
    const durationMinutes = Math.round(totalTimeMs / 60000);

    // Sync to UI-expected collections
    try {
      if (diagnostics?.masteryProbabilities) {
        await syncTopicProgress(familyId, scholarId, diagnostics.masteryProbabilities, skillTagMap);
      }

      await syncWeeklyStats(familyId, scholarId, {
        domain,
        durationMinutes: durationMinutes || 15,
        accuracy: accuracyRate,
        topicsPracticed,
      });

      await syncConfidenceTracking(
        familyId,
        scholarId,
        domain,
        lastCalibrationStatus,
        diagnostics?.trend || "NEUTRAL"
      );
    } catch (syncError) {
      console.error("Data sync failed:", syncError);
    }

    await sessionRef.update({
      status: "COMPLETED",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      accuracyRate,
      totalQuestions: total,
      correctAnswers: correct,
      durationMinutes,
      diagnostics: diagnostics ? {
        masteryProbabilities: diagnostics.masteryProbabilities,
        gapMap: diagnostics.gapMap,
        trend: diagnostics.trend,
        plateauFlag: diagnostics.plateauFlag,
        aiRunIds: diagnostics.runIds,
      } : null,
    });

    return { accuracyRate, correct, total, diagnostics };
  }
);
