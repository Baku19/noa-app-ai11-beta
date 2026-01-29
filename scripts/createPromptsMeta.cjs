const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'noa-app-ai7'
});
const db = admin.firestore();

async function createPromptsMeta() {
  const modules = [
    { id: 'AI-01', name: 'Assessment Generator', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-02', name: 'Response Evaluator', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-03', name: 'Confidence Interpreter', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-04', name: 'Diagnostic Engine', model: 'gemini-1.5-pro', status: 'ACTIVE' },
    { id: 'AI-05', name: 'Guided Tutor', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-06', name: 'Progress Monitor', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-07', name: 'Parent Translator', model: 'gemini-1.5-pro', status: 'ACTIVE' },
    { id: 'AI-08', name: 'Cohort Signal Monitor', model: 'gemini-2.0-flash-exp', status: 'DORMANT' },
    { id: 'AI-09', name: 'Coordination Extractor', model: 'gemini-2.0-flash-exp', status: 'ACTIVE' },
    { id: 'AI-10', name: 'Safety Monitor', model: 'RULES_ENGINE', status: 'ACTIVE' },
    { id: 'AI-11', name: 'System Auditor', model: 'RULES_ENGINE', status: 'ACTIVE' }
  ];

  for (const m of modules) {
    await db.collection('promptsMeta').doc(m.id).set({
      ...m,
      currentVersion: '1.0',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Created: ${m.id} - ${m.name}`);
  }

  console.log('Done! All 11 AI modules registered.');
}

createPromptsMeta().catch(console.error);
