import * as dotenv from "dotenv";
dotenv.config();

import {onCall, HttpsError, onRequest} from "firebase-functions/v2/https";

import * as admin from "firebase-admin";
import Stripe from "stripe";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const REGION = "australia-southeast1";



// ═══════════════════════════════════════════════════════════════
// createFamilyAndParent - Called by frontend signup
// ═══════════════════════════════════════════════════════════════
export const createFamilyAndParent = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }
    const uid = request.auth.uid;
    const {parentProfile} = request.data;
    const email = parentProfile?.email || request.auth.token.email || "";
    const displayName = parentProfile?.displayName || "";

    // Check if user already has a family
    const existingUser = await db.collection("users").doc(uid).get();
    if (existingUser.exists && existingUser.data()?.familyId) {
      return {familyId: existingUser.data()?.familyId, alreadyExists: true};
    }

    const familyRef = db.collection("families").doc();
    const familyId = familyRef.id;

    await familyRef.set({
      id: familyId,
      familyName: displayName ? `${displayName.split(" ")[0]}'s Family` : "My Family",
      primaryParentUid: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await familyRef.collection("billing").doc("public").set({
      plan: "FREE",
      status: "ACTIVE",
      includedScholars: 0,
      maxScholars: 1,
      features: {
        numeracy: true,
        reading: false,
        writing: false,
        conventions: false,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("users").doc(uid).set({
      uid,
      email,
      displayName,
      familyId,
      role: "PRIMARY_PARENT",
      onboardingComplete: false,
      firstVisitComplete: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await familyRef.collection("parents").doc(uid).set({
      id: uid,
      uid,
      name: displayName,
      email,
      isPrimary: true,
      notificationsEnabled: true,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin.auth().setCustomUserClaims(uid, {familyId});

    return {familyId, success: true};
  }
);

// ═══════════════════════════════════════════════════════════════
// setFamilyPlan - Update family plan
// ═══════════════════════════════════════════════════════════════
export const setFamilyPlan = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }
    const uid = request.auth.uid;
    const {plan, billingCycle} = request.data;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }
    const familyId = userDoc.data()?.familyId;
    if (!familyId) {
      throw new HttpsError("not-found", "Family not found");
    }

    const planLimits: Record<string, {includedScholars: number; maxScholars: number}> = {
      free: {includedScholars: 1, maxScholars: 1},
      single: {includedScholars: 1, maxScholars: 1},
      family: {includedScholars: 2, maxScholars: 5},
    };
    const limits = planLimits[plan] || planLimits.free;

    const features = {
      numeracy: true,
      reading: plan !== "free",
      writing: plan !== "free",
      conventions: plan !== "free",
    };

    await db.collection("families").doc(familyId).update({
      plan,
      billingCycle: billingCycle || null,
      includedScholars: limits.includedScholars,
      maxScholars: limits.maxScholars,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("families").doc(familyId).collection("billing").doc("public").update({
      plan: plan.toUpperCase(),
      features,
      includedScholars: limits.includedScholars,
      maxScholars: limits.maxScholars,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, plan, features};
  }
);

export const createCheckoutSession = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {priceId} = request.data;
    const uid = request.auth.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    const familyId = userDoc.data()?.familyId;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{price: priceId, quantity: 1}],
      success_url: "https://noa-app-ai7.web.app/settings?success=true",
      cancel_url: "https://noa-app-ai7.web.app/settings?canceled=true",
      metadata: {uid, familyId},
    });

    return {url: session.url};
  }
);

export const stripeWebhook = onRequest(
  {region: REGION},
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const {familyId} = session.metadata || {};

      if (familyId) {
        const billingRef = db
          .collection("families")
          .doc(familyId)
          .collection("billing")
          .doc("public");

        await billingRef.update({
          plan: "SINGLE",
          status: "ACTIVE",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.status(200).send("OK");
  }
);

export const createCustomerPortalSession = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const uid = request.auth.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const familyId = userDoc.data()?.familyId;

    const billingRef = db
      .collection("families")
      .doc(familyId)
      .collection("billing")
      .doc("public");
    const billingDoc = await billingRef.get();
    const customerId = billingDoc.data()?.stripeCustomerId;

    if (!customerId) {
      throw new HttpsError("failed-precondition", "No subscription found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://noa-app-ai7.web.app/settings",
    });

    return {url: session.url};
  }
);

// ═══════════════════════════════════════════════════════════════
// generateScholarCode - Creates scholar and generates login code
// ═══════════════════════════════════════════════════════════════
export const generateScholarCode = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const uid = request.auth.uid;
    const {scholarData} = request.data;

    if (!scholarData || !scholarData.name || !scholarData.yearLevel) {
      throw new HttpsError("invalid-argument", "Missing required scholar data");
    }

    // Get user's familyId
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User profile not found");
    }
    const familyId = userDoc.data()?.familyId;
    if (!familyId) {
      throw new HttpsError("failed-precondition", "No family associated with user");
    }

    // Create scholar document
    const scholarRef = db.collection("families").doc(familyId).collection("scholars").doc();
    const scholarId = scholarRef.id;

    // Generate login code
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const codeHash = await bcrypt.hash(code, 12);
    const lookupKey = crypto
      .createHmac("sha256", "noa-scholar-code")
      .update(code)
      .digest("hex");

    // Create scholar with loginCode
    await scholarRef.set({
      name: scholarData.name,
      dateOfBirth: scholarData.dateOfBirth || null,
      yearLevel: scholarData.yearLevel,
      school: scholarData.school || null,
      schoolData: scholarData.schoolData || null,
      avatarColor: scholarData.avatarColor || "bg-emerald-500",
      settings: scholarData.settings || {
        dailySessionMinutes: 20,
        notificationsEnabled: true
      },
      hasLoginCode: true,
      loginCode: code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: uid
    });

    // Create invite code entry
    await db.collection("inviteCodes").doc(lookupKey).set({
      type: "SCHOLAR_LOGIN",
      codeHash,
      familyId,
      scholarId,
      status: "ACTIVE",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      code,
      loginCode: code,
      scholarId,
      scholarName: scholarData.name
    };
  }
);

// ═══════════════════════════════════════════════════════════════
// regenerateScholarCode - Generate new code for existing scholar
// ═══════════════════════════════════════════════════════════════
export const regenerateScholarCode = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const uid = request.auth.uid;
    const {scholarId} = request.data;

    if (!scholarId) {
      throw new HttpsError("invalid-argument", "Missing scholarId");
    }

    // Get user's familyId
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User profile not found");
    }
    const familyId = userDoc.data()?.familyId;
    if (!familyId) {
      throw new HttpsError("failed-precondition", "No family associated");
    }

    // Verify scholar belongs to family
    const scholarRef = db.collection("families").doc(familyId).collection("scholars").doc(scholarId);
    const scholarDoc = await scholarRef.get();
    if (!scholarDoc.exists) {
      throw new HttpsError("not-found", "Scholar not found");
    }

    // Invalidate old codes
    const oldCodes = await db.collection("inviteCodes")
      .where("scholarId", "==", scholarId)
      .where("status", "==", "ACTIVE")
      .get();

    const batch = db.batch();
    oldCodes.docs.forEach(doc => batch.update(doc.ref, {status: "REVOKED"}));

    // Generate new code
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const codeHash = await bcrypt.hash(code, 12);
    const lookupKey = crypto
      .createHmac("sha256", "noa-scholar-code")
      .update(code)
      .digest("hex");

    // Create new invite code
    batch.set(db.collection("inviteCodes").doc(lookupKey), {
      type: "SCHOLAR_LOGIN",
      codeHash,
      familyId,
      scholarId,
      status: "ACTIVE",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update scholar with new code
    batch.update(scholarRef, {
      hasLoginCode: true,
      loginCode: code
    });

    await batch.commit();

    return {
      success: true,
      loginCode: code,
      scholarId
    };
  }
);

export const validateScholarCode = onCall(
  {region: REGION},
  async (request) => {
    const {code} = request.data;

    const lookupKey = crypto
      .createHmac("sha256", "noa-scholar-code")
      .update(code)
      .digest("hex");
    const inviteDoc = await db.collection("inviteCodes").doc(lookupKey).get();

    if (!inviteDoc.exists) {
      throw new HttpsError("not-found", "Invalid code");
    }

    const invite = inviteDoc.data()!;

    if (invite.status !== "ACTIVE") {
      throw new HttpsError("failed-precondition", "Code expired");
    }

    const isValid = await bcrypt.compare(code, invite.codeHash);
    if (!isValid) {
      throw new HttpsError("permission-denied", "Invalid code");
    }

    const customToken = await admin
      .auth()
      .createCustomToken(`scholar:${invite.scholarId}`, {
        scholarId: invite.scholarId,
        familyId: invite.familyId,
      });

    return {
      token: customToken,
      scholarId: invite.scholarId,
      familyId: invite.familyId,
    };
  }
);

export const sendParentInvite = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {email, name, familyId} = request.data;

    const inviteCode = crypto.randomBytes(16).toString("hex");

    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await db.collection("inviteCodes").doc(inviteCode).set({
      type: "PARENT_INVITE",
      email,
      name,
      familyId,
      invitedBy: request.auth.uid,
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt,
    });

    return {success: true, inviteCode};
  }
);

export const acceptParentInvite = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {inviteCode} = request.data;
    const uid = request.auth.uid;

    const inviteDoc = await db.collection("inviteCodes").doc(inviteCode).get();

    if (!inviteDoc.exists || inviteDoc.data()?.status !== "PENDING") {
      throw new HttpsError("not-found", "Invalid invite");
    }

    const invite = inviteDoc.data()!;
    const familyId = invite.familyId;

    await db.collection("users").doc(uid).update({
      familyId,
      role: "SECONDARY_PARENT",
    });

    const parentRef = db
      .collection("families")
      .doc(familyId)
      .collection("parents")
      .doc(uid);

    await parentRef.set({
      uid,
      name: invite.name,
      email: invite.email,
      role: "SECONDARY_PARENT",
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await inviteDoc.ref.update({status: "ACCEPTED"});

    await admin.auth().setCustomUserClaims(uid, {familyId});

    return {success: true, familyId};
  }
);

export const createSessionPlan = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {familyId, scholarId, domain, questionCount = 10} = request.data;

    const sessionRef = db
      .collection("families")
      .doc(familyId)
      .collection("sessions")
      .doc();

    const questionsSnap = await db
      .collection("questionBankPublic")
      .where("domain", "==", domain)
      .where("isActive", "==", true)
      .limit(questionCount)
      .get();

    const questionIds = questionsSnap.docs.map((d) => d.id);

    await sessionRef.set({
      id: sessionRef.id,
      scholarId,
      familyId,
      domain,
      questionIds,
      questionCount: questionIds.length,
      status: "PLANNED",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {sessionId: sessionRef.id, questionIds};
  }
);

export const finaliseSession = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {familyId, sessionId} = request.data;

    const sessionRef = db
      .collection("families")
      .doc(familyId)
      .collection("sessions")
      .doc(sessionId);
    const responsesSnap = await sessionRef.collection("responses").get();

    let correct = 0;
    let total = 0;

    for (const respDoc of responsesSnap.docs) {
      const resp = respDoc.data();
      const privateQ = await db
        .collection("questionBankPrivate")
        .doc(resp.questionId)
        .get();

      if (privateQ.exists) {
        const isCorrect = resp.scholarAnswer === privateQ.data()?.correctAnswer;
        if (isCorrect) correct++;
        total++;

        await respDoc.ref.update({
          evaluation: {
            isCorrect,
            evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        });
      }
    }

    const accuracyRate = total > 0 ? correct / total : 0;

    await sessionRef.collection("serverData").doc("resultsPublic").set({
      totalQuestions: total,
      correctAnswers: correct,
      accuracyRate,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sessionRef.update({
      status: "COMPLETED",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {accuracyRate, correct, total};
  }
);

export const getHint = onCall(
  {region: REGION},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {questionId, scaffoldLevel = 1} = request.data;

    const questionDoc = await db
      .collection("questionBankPublic")
      .doc(questionId)
      .get();

    if (!questionDoc.exists) {
      throw new HttpsError("not-found", "Question not found");
    }

    const question = questionDoc.data()!;

    const hints: Record<number, string> = {
      1: "Take another look at the question. What is it really asking?",
      2: `Think about ${question.skillTag}. What do you know about this?`,
      3: "Break it down step by step. What's the first thing to figure out?",
    };

    return {
      guidanceText: hints[scaffoldLevel] || hints[1],
      scaffoldLevel,
    };
  }
);

// AI-powered session functions (Batch 7)
export { submitResponse, getAIHint, finaliseSessionAI } from "./sessionFunctions";


// AI-powered orchestration functions (Batch 7)
export { createAISession, triggerGeneration } from "./orchestrationFunctions";

