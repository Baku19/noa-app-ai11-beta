const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  projectId: 'noa-app-ai7'
});
const db = admin.firestore();

async function uploadSchools() {
  const csv = fs.readFileSync('./scripts/SchoolList.csv', 'utf8');
  const lines = csv.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  console.log('Headers:', headers);
  console.log('Total schools:', lines.length - 1);
  
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 7) continue;
    
    const school = {
      name: values[0]?.trim() || '',
      suburb: values[1]?.trim() || '',
      state: values[2]?.trim() || '',
      postcode: values[3]?.trim() || '',
      type: values[4]?.trim() || '',
      sector: values[5]?.trim() || '',
      acaraId: values[6]?.trim().replace('\r', '') || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (!school.name) continue;
    
    const ref = db.collection('schools').doc();
    batch.set(ref, school);
    count++;
    batchCount++;
    
    if (batchCount === 500) {
      await batch.commit();
      console.log(`Uploaded ${count} schools...`);
      batch = db.batch();
      batchCount = 0;
    }
  }
  
  if (batchCount > 0) {
    await batch.commit();
  }
  
  console.log(`Done! Total uploaded: ${count} schools`);
}

uploadSchools().catch(console.error);
