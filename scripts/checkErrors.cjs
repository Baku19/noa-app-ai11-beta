const fs = require('fs');
const csv = fs.readFileSync('coverageMap.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  try {
    const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    const bandsRaw = matches[5].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    const refsRaw = matches[6].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    JSON.parse(bandsRaw);
    JSON.parse(refsRaw);
  } catch (err) {
    console.log('Row ' + i + ': ' + err.message);
    console.log('  ' + line.substring(0, 150));
  }
}
console.log('Done');
