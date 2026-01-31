// ═══════════════════════════════════════════════════════════════
// FILE: db/skillMap.repo.ts
// PURPOSE: Bridge skillTag <-> microSkillId mapping
// BATCH 7
// ═══════════════════════════════════════════════════════════════

import * as admin from "firebase-admin";
import { SkillMapping, Domain } from "../shared/types";

const db = admin.firestore();
const COLLECTION = "coverageMap";

// In-memory cache
let cache: Map<string, SkillMapping> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadCache(): Promise<Map<string, SkillMapping>> {
  const now = Date.now();
  if (cache && now - cacheTimestamp < CACHE_TTL_MS) {
    return cache;
  }

  const snapshot = await db.collection(COLLECTION).get();
  cache = new Map();

  snapshot.forEach((doc) => {
    const data = doc.data() as SkillMapping;
    cache!.set(data.skillTagLower, data);
    cache!.set(data.microSkillId, data);
  });

  cacheTimestamp = now;
  return cache;
}

export async function resolveMicroSkillId(skillTag: string): Promise<string | null> {
  const mapping = await loadCache();
  const entry = mapping.get(skillTag.toLowerCase());
  return entry?.microSkillId || null;
}

export async function resolveSkillTag(microSkillId: string): Promise<string | null> {
  const mapping = await loadCache();
  const entry = mapping.get(microSkillId);
  return entry?.skillTag || null;
}

export async function getSkillMapping(skillTag: string): Promise<SkillMapping | null> {
  const mapping = await loadCache();
  return mapping.get(skillTag.toLowerCase()) || null;
}

export async function getMicroSkillIdsByDomain(domain: Domain): Promise<string[]> {
  const mapping = await loadCache();
  const ids: string[] = [];

  mapping.forEach((entry) => {
    if (entry.domain === domain && !ids.includes(entry.microSkillId)) {
      ids.push(entry.microSkillId);
    }
  });

  return ids;
}

export function clearCache(): void {
  cache = null;
  cacheTimestamp = 0;
}
