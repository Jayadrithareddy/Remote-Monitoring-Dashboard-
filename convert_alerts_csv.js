const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'alerts_export_raw.csv');
const outputPath = path.join(__dirname, 'src', 'data', 'alertsData.json');

const raw = fs.readFileSync(csvPath, 'utf-8');
const lines = raw.split(/\r?\n/);

// Data starts at line index 6 (0-based), after header row at index 5
const dataLines = lines.slice(6);

const results = [];
let srno = 1;

for (const line of dataLines) {
  if (!line.trim() || line.trim() === ',,,,,,,') continue;
  
  // Parse CSV with quoted fields
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  
  const [alertName, alertValue, equipment, type, createdDate] = fields;
  
  if (!alertName || !equipment || !type || !createdDate) continue;
  
  results.push({
    alertName,
    alertValue: alertValue || alertName,
    equipment: equipment.toString(),
    type,
    createdDate,
    srno: srno++
  });
}

console.log(`Parsed ${results.length} alert records`);
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`Written to ${outputPath}`);
