const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Proper CSV parser that handles quoted fields with commas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seedCoverageMap() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  NOA Coverage Map Seeding (Fixed Parser)');
  console.log('═══════════════════════════════════════════════════════════');
  
  const csvPath = path.join(__dirname, 'coverageMap.csv');
  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.split('\n').filter(line => line.trim());
  
  console.log('Total rows: ' + (lines.length - 1));
  
  const stats = { NUM: 0, READ: 0, WRITE: 0, GRAM: 0, SPELL: 0 };
  let count = 0;
  let errors = 0;
  
  const BATCH_SIZE = 500;
  let batch = db.batch();
  let batchCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const values = parseCSVLine(line);
      
      const microSkillId = values[0];
      const domain = values[1];
      const description = values[2];
      const yearMin = parseInt(values[3]);
      const yearMax = parseInt(values[4]);
      const defaultDifficultyBands = JSON.parse(values[5]);
      const curriculumRef = JSON.parse(values[6]);
      
      if (!['NUM', 'READ', 'WRITE', 'GRAM', 'SPELL'].includes(domain)) {
        console.error('Row ' + i + ': Invalid domain "' + domain + '"');
        errors++;
        continue;
      }
      
      const docRef = db.collection('coverageMap').doc(microSkillId);
      batch.set(docRef, {
        microSkillId,
        domain,
        description,
        yearMin,
        yearMax,
        defaultDifficultyBands,
        curriculumRef,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      stats[domain]++;
      count++;
      batchCount++;
      
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        console.log('  Committed batch: ' + count + ' documents...');
        batch = db.batch();
        batchCount = 0;
      }
      
    } catch (err) {
      console.error('Row ' + i + ': ' + err.message);
      errors++;
    }
  }
  
  if (batchCount > 0) {
    await batch.commit();
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  SEEDING COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n  Total uploaded: ' + count);
  console.log('  Errors: ' + errors);
  console.log('\n  By Domain:');
  console.log('    NUM:   ' + stats.NUM);
  console.log('    READ:  ' + stats.READ);
  console.log('    WRITE: ' + stats.WRITE);
  console.log('    GRAM:  ' + stats.GRAM);
  console.log('    SPELL: ' + stats.SPELL);
  console.log('═══════════════════════════════════════════════════════════\n');
}

seedCoverageMap()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
