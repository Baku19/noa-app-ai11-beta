// ═══════════════════════════════════════════════════════════════
// FILE: scripts/seedQuestionBank.cjs
// PURPOSE: Generate baseline items from coverageMap
// CREATES: questionBankPublic + questionBankPrivate
// ═══════════════════════════════════════════════════════════════

const admin = require('firebase-admin');

// Initialize if not already
if (!admin.apps.length) {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// ═══════════════════════════════════════════════════════════════
// QUESTION TEMPLATES BY DOMAIN
// ═══════════════════════════════════════════════════════════════

const TEMPLATES = {
  NUM: {
    FOUNDATION: [
      { type: 'MCQ', prompt: (desc, yr) => `Year ${yr}: ${desc}. Which answer is correct?`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `Year ${yr}: ${desc}. Write your answer.` }
    ],
    CORE: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Select the correct answer.`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Show your working and write the answer.` }
    ],
    STRETCH: [
      { type: 'SHORT', prompt: (desc, yr) => `Challenge: ${desc}. Explain your reasoning.` },
      { type: 'EXTENDED', prompt: (desc, yr) => `${desc}. Solve the problem and explain each step.` }
    ]
  },
  READ: {
    FOUNDATION: [
      { type: 'MCQ', prompt: (desc, yr) => `Read the passage. ${desc}. Choose the best answer.`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Write your answer in one sentence.` }
    ],
    CORE: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Which option best answers the question?`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Use evidence from the text.` }
    ],
    STRETCH: [
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Support your answer with specific details.` },
      { type: 'EXTENDED', prompt: (desc, yr) => `${desc}. Write a detailed response with examples.` }
    ]
  },
  WRITE: {
    FOUNDATION: [
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Write 2-3 sentences.` },
      { type: 'EXTENDED', prompt: (desc, yr) => `${desc}. Write a short paragraph.` }
    ],
    CORE: [
      { type: 'EXTENDED', prompt: (desc, yr) => `${desc}. Write 1-2 paragraphs.` }
    ],
    STRETCH: [
      { type: 'EXTENDED', prompt: (desc, yr) => `${desc}. Write a well-structured response.` }
    ]
  },
  GRAM: {
    FOUNDATION: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Choose the correct option.`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Write the correct form.` }
    ],
    CORE: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Select the grammatically correct sentence.`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Rewrite the sentence correctly.` }
    ],
    STRETCH: [
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Correct the errors and explain why.` }
    ]
  },
  SPELL: {
    FOUNDATION: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Which word is spelled correctly?`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Write the correct spelling.` }
    ],
    CORE: [
      { type: 'MCQ', prompt: (desc, yr) => `${desc}. Choose the correctly spelled word.`, optionCount: 4 },
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Spell the word correctly.` }
    ],
    STRETCH: [
      { type: 'SHORT', prompt: (desc, yr) => `${desc}. Write the word and explain the spelling rule.` }
    ]
  }
};

// MCQ option generators by domain
const MCQ_OPTIONS = {
  NUM: (correct) => {
    const num = parseFloat(correct) || 42;
    return [
      `A) ${num}`,
      `B) ${num + 10}`,
      `C) ${num - 5}`,
      `D) ${num * 2}`
    ];
  },
  READ: () => ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
  GRAM: () => ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
  SPELL: () => ['A) Spelling A', 'B) Spelling B', 'C) Spelling C', 'D) Spelling D'],
  WRITE: () => null // No MCQ for writing
};

// Marking logic by question type
const MARKING_LOGIC = {
  MCQ: 'EXACT',
  SHORT: 'REGEX',
  EXTENDED: 'RUBRIC'
};

// ═══════════════════════════════════════════════════════════════
// MAIN SEEDING FUNCTION
// ═══════════════════════════════════════════════════════════════

async function seedQuestionBank() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  NOA Question Bank Seeding (Option B: Broader Seed)');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Load coverageMap from Firestore
  console.log('Loading coverageMap from Firestore...');
  const coverageSnap = await db.collection('coverageMap').get();
  
  if (coverageSnap.empty) {
    console.error('ERROR: coverageMap is empty. Run seedCoverageMap.cjs first.');
    process.exit(1);
  }
  
  const coverageMap = [];
  coverageSnap.forEach(doc => coverageMap.push(doc.data()));
  console.log(`  Found ${coverageMap.length} micro-skills\n`);

  // 2. Generate items
  const publicItems = [];
  const privateItems = [];
  
  const stats = { 
    byDomain: { NUM: 0, READ: 0, WRITE: 0, GRAM: 0, SPELL: 0 },
    byDifficulty: { FOUNDATION: 0, CORE: 0, STRETCH: 0 },
    byType: { MCQ: 0, SHORT: 0, EXTENDED: 0 }
  };

  for (const skill of coverageMap) {
    const { microSkillId, domain, description, yearMin, yearMax, defaultDifficultyBands, curriculumRef } = skill;
    
    // Create 1 item per difficulty band
    for (const difficultyBand of defaultDifficultyBands) {
      const templates = TEMPLATES[domain]?.[difficultyBand];
      if (!templates || templates.length === 0) continue;
      
      // Pick first template for this difficulty
      const template = templates[0];
      const questionType = template.type;
      const avgYear = Math.round((yearMin + yearMax) / 2);
      
      // Generate item ID
      const seq = '01';
      const itemId = `${microSkillId}-${difficultyBand}-${seq}`;
      
      // Generate prompt
      const prompt = template.prompt(description, avgYear);
      
      // Generate options for MCQ
      let options = null;
      let correctAnswer = null;
      
      if (questionType === 'MCQ') {
        options = MCQ_OPTIONS[domain]?.('A') || ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'];
        correctAnswer = 'A'; // First option is correct
      } else if (questionType === 'SHORT') {
        correctAnswer = 'Sample correct answer';
      }
      
      // Public item (no answer)
      publicItems.push({
        itemId,
        domain,
        microSkillId,
        yearMin,
        yearMax,
        difficultyBand,
        questionType,
        prompt,
        options,
        qaStatus: 'SEED',
        createdBy: 'SEED',
        curriculumRef: curriculumRef || [],
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Private item (with answer)
      const privateItem = {
        itemId,
        correctAnswer,
        markingLogic: MARKING_LOGIC[questionType],
        qaNotes: 'Baseline seed item'
      };
      
      // Add rubric for extended responses
      if (questionType === 'EXTENDED') {
        privateItem.rubric = {
          criteria: ['Content', 'Structure', 'Language'],
          bands: [
            { label: 'Excellent', descriptor: 'Thorough and well-organised response' },
            { label: 'Proficient', descriptor: 'Clear response with good detail' },
            { label: 'Developing', descriptor: 'Basic response with some detail' },
            { label: 'Beginning', descriptor: 'Limited response' }
          ]
        };
      }
      
      privateItems.push(privateItem);
      
      // Update stats
      stats.byDomain[domain]++;
      stats.byDifficulty[difficultyBand]++;
      stats.byType[questionType]++;
    }
  }

  console.log(`Generated ${publicItems.length} items\n`);
  console.log('By Domain:', stats.byDomain);
  console.log('By Difficulty:', stats.byDifficulty);
  console.log('By Type:', stats.byType);
  console.log('');

  // 3. Upload to Firestore in batches
  console.log('Uploading to Firestore...');
  
  const BATCH_SIZE = 500;
  let publicCount = 0;
  let privateCount = 0;
  
  // Upload public items
  for (let i = 0; i < publicItems.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = publicItems.slice(i, i + BATCH_SIZE);
    
    for (const item of chunk) {
      const ref = db.collection('questionBankPublic').doc(item.itemId);
      batch.set(ref, item);
      publicCount++;
    }
    
    await batch.commit();
    console.log(`  questionBankPublic: ${publicCount} / ${publicItems.length}`);
  }
  
  // Upload private items
  for (let i = 0; i < privateItems.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = privateItems.slice(i, i + BATCH_SIZE);
    
    for (const item of chunk) {
      const ref = db.collection('questionBankPrivate').doc(item.itemId);
      batch.set(ref, item);
      privateCount++;
    }
    
    await batch.commit();
    console.log(`  questionBankPrivate: ${privateCount} / ${privateItems.length}`);
  }

  // 4. Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  SEEDING COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n  questionBankPublic:  ${publicCount} items`);
  console.log(`  questionBankPrivate: ${privateCount} items`);
  console.log('\n  By Domain:');
  Object.entries(stats.byDomain).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  console.log('\n  By Difficulty:');
  Object.entries(stats.byDifficulty).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  console.log('\n  By Type:');
  Object.entries(stats.byType).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  console.log('\n  Verify in Firebase Console:');
  console.log('  https://console.firebase.google.com/project/noa-app-ai7/firestore/data/questionBankPublic');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run
seedQuestionBank()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
