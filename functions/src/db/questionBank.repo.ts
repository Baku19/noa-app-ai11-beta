// FILE: db/questionBank.repo.ts
// PURPOSE: Question bank queries with serving rules enforced
// CRITICAL: Only SEED or AI_APPROVED items can be served

import * as admin from "firebase-admin";
import {
  QuestionItemPublic,
  QuestionItemPrivate,
  QaStatus,
  SERVEABLE_STATUSES,
  Difficulty,
  Domain,
} from "../shared/types";

const db = admin.firestore();
const PUBLIC_COLLECTION = "questionBankPublic";
const PRIVATE_COLLECTION = "questionBankPrivate";

export async function getServeableQuestions(
  microSkillId: string,
  difficulty: Difficulty,
  limit: number = 10,
  excludeItemIds: string[] = []
): Promise<QuestionItemPublic[]> {
  const query = db.collection(PUBLIC_COLLECTION)
    .where("microSkillId", "==", microSkillId)
    .where("difficultyBand", "==", difficulty)
    .where("qaStatus", "in", SERVEABLE_STATUSES)
    .where("isActive", "==", true)
    .limit(limit + excludeItemIds.length);

  const snapshot = await query.get();
  const items: QuestionItemPublic[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as QuestionItemPublic;
    if (!excludeItemIds.includes(data.itemId)) {
      items.push(data);
    }
  });

  return items.slice(0, limit);
}

export async function getServeableQuestionsByDomain(
  domain: Domain,
  yearLevel: number,
  difficulty: Difficulty,
  limit: number = 10,
  excludeItemIds: string[] = []
): Promise<QuestionItemPublic[]> {
  const query = db.collection(PUBLIC_COLLECTION)
    .where("domain", "==", domain)
    .where("difficultyBand", "==", difficulty)
    .where("qaStatus", "in", SERVEABLE_STATUSES)
    .where("isActive", "==", true)
    .where("yearMin", "<=", yearLevel)
    .limit(limit + excludeItemIds.length);

  const snapshot = await query.get();
  const items: QuestionItemPublic[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as QuestionItemPublic;
    if (!excludeItemIds.includes(data.itemId) && data.yearMax >= yearLevel) {
      items.push(data);
    }
  });

  return items.slice(0, limit);
}

export async function countServeableItems(
  microSkillId: string,
  difficulty: Difficulty
): Promise<number> {
  const snapshot = await db.collection(PUBLIC_COLLECTION)
    .where("microSkillId", "==", microSkillId)
    .where("difficultyBand", "==", difficulty)
    .where("qaStatus", "in", SERVEABLE_STATUSES)
    .where("isActive", "==", true)
    .count()
    .get();

  return snapshot.data().count;
}

export async function saveDraftQuestions(
  publicItems: Omit<QuestionItemPublic, "qaStatus" | "createdAt">[],
  privateItems: QuestionItemPrivate[]
): Promise<string[]> {
  const batch = db.batch();
  const itemIds: string[] = [];
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (let i = 0; i < publicItems.length; i++) {
    const pub = publicItems[i];
    const priv = privateItems[i];

    const publicRef = db.collection(PUBLIC_COLLECTION).doc(pub.itemId);
    batch.set(publicRef, { ...pub, qaStatus: "DRAFT" as QaStatus, createdAt: now });

    const privateRef = db.collection(PRIVATE_COLLECTION).doc(pub.itemId);
    batch.set(privateRef, priv);

    itemIds.push(pub.itemId);
  }

  await batch.commit();
  return itemIds;
}

export async function approveQuestions(
  itemIds: string[],
  validatedBy: string
): Promise<void> {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const itemId of itemIds) {
    const ref = db.collection(PUBLIC_COLLECTION).doc(itemId);
    batch.update(ref, {
      qaStatus: "AI_APPROVED" as QaStatus,
      validatedBy,
      approvedAt: now,
    });
  }

  await batch.commit();
}

export async function getQuestionPublic(
  itemId: string
): Promise<QuestionItemPublic | null> {
  const doc = await db.collection(PUBLIC_COLLECTION).doc(itemId).get();
  return doc.exists ? (doc.data() as QuestionItemPublic) : null;
}

export async function getQuestionPrivate(
  itemId: string
): Promise<QuestionItemPrivate | null> {
  const doc = await db.collection(PRIVATE_COLLECTION).doc(itemId).get();
  return doc.exists ? (doc.data() as QuestionItemPrivate) : null;
}

export async function getQuestionWithAnswer(
  itemId: string
): Promise<{ public: QuestionItemPublic; private: QuestionItemPrivate } | null> {
  const [pubDoc, privDoc] = await Promise.all([
    db.collection(PUBLIC_COLLECTION).doc(itemId).get(),
    db.collection(PRIVATE_COLLECTION).doc(itemId).get(),
  ]);

  if (!pubDoc.exists || !privDoc.exists) return null;

  return {
    public: pubDoc.data() as QuestionItemPublic,
    private: privDoc.data() as QuestionItemPrivate,
  };
}
