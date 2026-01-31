// ═══════════════════════════════════════════════════════════════
// FILE: shared/types.ts
// PURPOSE: Shared types and enums for all AI modules
// SCHEMA: v7 compliant | BATCH 7
// ═══════════════════════════════════════════════════════════════

import { Timestamp } from "firebase-admin/firestore";

// QA STATUS (5 states)
export type QaStatus =
  | "SEED"
  | "DRAFT"
  | "AI_APPROVED"
  | "REJECTED"
  | "HUMAN_APPROVED";

// LOCKED: Only these statuses can be served to scholars
export const SERVEABLE_STATUSES: QaStatus[] = ["SEED", "AI_APPROVED"];

// MODULE IDS
export type ModuleId =
  | "AI-00" | "AI-01" | "AI-02" | "AI-03" | "AI-04" | "AI-05"
  | "AI-06" | "AI-07" | "AI-08" | "AI-09" | "AI-10" | "AI-11";

// DOMAINS & DIFFICULTY
export type Domain = "numeracy" | "reading" | "writing" | "conventions";
export const ALL_DOMAINS: Domain[] = ["numeracy", "reading", "writing", "conventions"];

export type Difficulty = "easy" | "medium" | "hard";
export const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

// CORE ENUMS
export type SafetyDecision = "ALLOW" | "BLOCK" | "ESCALATE";
export type CalibrationStatus = "OVER_CONFIDENT" | "UNDER_CONFIDENT" | "CALIBRATED";
export type FatigueRisk = "LOW" | "MEDIUM" | "HIGH";
export type Trend = "UP" | "NEUTRAL" | "DOWN";
export type SupportLevel = "INCREASE" | "MAINTAIN" | "FADE";
export type LanguageLoad = "LOW" | "MEDIUM" | "HIGH";
export type CognitiveDemand = "DOK1" | "DOK2" | "DOK3";
export type QuestionType = "mcq" | "short" | "extended";
export type HealthStatus = "HEALTHY" | "DEGRADED" | "CRITICAL";
export type AuditTier = "HOT" | "WARM" | "COLD";

// INTERFACES
export interface ValidationResult {
  pass: boolean;
  reasons: string[];
}

export interface QuestionItemPublic {
  itemId: string;
  microSkillId: string;
  domain: Domain;
  yearMin: number;
  yearMax: number;
  difficultyBand: Difficulty;
  questionType: QuestionType;
  prompt: string;
  options: string[] | null;
  qaStatus: QaStatus;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface QuestionItemPrivate {
  itemId: string;
  correctAnswer: string;
  explanation: string;
  markingLogic: "EXACT" | "REGEX" | "RUBRIC";
  distractorRationales?: Record<string, string>;
}

export interface SkillMapping {
  microSkillId: string;
  skillTag: string;
  skillTagLower: string;
  domain: Domain;
  yearMin: number;
  yearMax: number;
}
