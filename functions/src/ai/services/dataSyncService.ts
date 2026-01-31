// FILE: ai/services/dataSyncService.ts
// PURPOSE: Sync AI outputs to Firestore in UI-expected format
// CRITICAL: Must match structure in lib/demoData.js

import * as admin from "firebase-admin";

const db = admin.firestore();

export interface TopicProgressEntry {
  id: string;
  topic: string;
  domain: string;
  strengthState: "strength" | "emerging_strength" | "focus_area" | "emerging_focus";
  sessionsCount: number;
  trend: "improving" | "stable" | "declining" | null;
}

export interface WeeklyStats {
  sessions: number;
  totalMinutes: number;
  topicsPracticed: string[];
  domains: string[];
  strengths: number;
  emergingStrengths: number;
  focusAreas: number;
  streak: number;
  confidence: number;
  accuracyAvg: number;
}

export interface ConfidenceEntry {
  domain: string;
  level: "high" | "moderate" | "building";
  calibrationStatus: string;
  trend: string;
  dataPoints: number;
}

function masteryToStrengthState(mastery: number): TopicProgressEntry["strengthState"] {
  if (mastery >= 0.8) return "strength";
  if (mastery >= 0.6) return "emerging_strength";
  if (mastery >= 0.4) return "focus_area";
  return "emerging_focus";
}

function computeTrend(current: number, previous: number | undefined): TopicProgressEntry["trend"] {
  if (previous === undefined) return null;
  if (current > previous + 0.05) return "improving";
  if (current < previous - 0.05) return "declining";
  return "stable";
}

export async function syncTopicProgress(
  familyId: string,
  scholarId: string,
  masteryProbabilities: Record<string, number>,
  skillTagMap: Record<string, { topic: string; domain: string }>
): Promise<void> {
  const progressRef = db.collection("families").doc(familyId)
    .collection("scholars").doc(scholarId).collection("topicProgress");

  const existingSnap = await progressRef.get();
  const existing: Record<string, any> = {};
  existingSnap.forEach((doc) => {
    existing[doc.id] = doc.data();
  });

  const batch = db.batch();

  for (const [microSkillId, mastery] of Object.entries(masteryProbabilities)) {
    const skillInfo = skillTagMap[microSkillId] || { topic: microSkillId, domain: "numeracy" };
    const prev = existing[microSkillId];

    const entry: TopicProgressEntry = {
      id: microSkillId,
      topic: skillInfo.topic,
      domain: skillInfo.domain,
      strengthState: masteryToStrengthState(mastery),
      sessionsCount: (prev?.sessionsCount || 0) + 1,
      trend: computeTrend(mastery, prev?.masteryLevel),
    };

    const docRef = progressRef.doc(microSkillId);
    batch.set(docRef, { ...entry, masteryLevel: mastery, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }

  await batch.commit();
}

export async function syncWeeklyStats(
  familyId: string,
  scholarId: string,
  sessionData: {
    domain: string;
    durationMinutes: number;
    accuracy: number;
    topicsPracticed: string[];
  }
): Promise<void> {
  const weekId = getWeekId(new Date());
  const statsRef = db.collection("families").doc(familyId)
    .collection("scholars").doc(scholarId).collection("weeklyStats").doc(weekId);

  const existing = await statsRef.get();
  const prev = existing.exists ? existing.data() as WeeklyStats : null;

  const domains = prev?.domains || [];
  if (!domains.includes(sessionData.domain)) {
    domains.push(sessionData.domain);
  }

  const topics = prev?.topicsPracticed || [];
  for (const t of sessionData.topicsPracticed) {
    if (!topics.includes(t)) topics.push(t);
  }

  const sessions = (prev?.sessions || 0) + 1;
  const totalMinutes = (prev?.totalMinutes || 0) + sessionData.durationMinutes;
  const accuracySum = (prev?.accuracyAvg || 0) * (prev?.sessions || 0) + sessionData.accuracy * 100;
  const accuracyAvg = Math.round(accuracySum / sessions);

  await statsRef.set({
    weekId,
    sessions,
    totalMinutes,
    topicsPracticed: topics,
    domains,
    accuracyAvg,
    strengths: prev?.strengths || 0,
    emergingStrengths: prev?.emergingStrengths || 0,
    focusAreas: prev?.focusAreas || 0,
    streak: prev?.streak || 1,
    confidence: prev?.confidence || 70,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function syncConfidenceTracking(
  familyId: string,
  scholarId: string,
  domain: string,
  calibrationStatus: string,
  trend: string
): Promise<void> {
  const confRef = db.collection("families").doc(familyId)
    .collection("scholars").doc(scholarId).collection("confidenceTracking").doc(domain);

  const existing = await confRef.get();
  const dataPoints = (existing.data()?.dataPoints || 0) + 1;

  let level: ConfidenceEntry["level"] = "moderate";
  if (calibrationStatus === "CALIBRATED") level = "high";
  if (calibrationStatus === "UNDER_CONFIDENT") level = "building";

  await confRef.set({
    domain,
    level,
    calibrationStatus,
    trend,
    dataPoints,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function syncParentInsight(
  familyId: string,
  scholarId: string,
  insight: {
    summary: string;
    capability: string;
    observedBehaviours: string[];
    homeActions: string[];
    disclaimers: string[];
    runId: string;
  }
): Promise<void> {
  const insightRef = db.collection("families").doc(familyId)
    .collection("scholars").doc(scholarId).collection("insights").doc("latest");

  await insightRef.set({
    ...insight,
    generatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

function getWeekId(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return year + "-W" + String(week).padStart(2, "0");
}
