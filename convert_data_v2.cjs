const fs = require('fs');
const path = require('path');

// Paths
const faultCodesCsvPath = path.join(__dirname, 'Service Overall files', 'Fault Codes Master With System Seggragation.csv');
const alertsCsvPath = path.join(__dirname, 'Service Overall files', 'Alerts _Export (1) (1).csv');
const outputMappingPath = path.join(__dirname, 'src', 'app', 'data', 'faultSystemMapping.ts');
const outputAlertsJsonPath = path.join(__dirname, 'src', 'app', 'data', 'ServiceOverall', 'alertsData.json');

// --- 1. Parse Fault Codes CSV ---
console.log('Parsing Fault Codes...');
const faultCodesContent = fs.readFileSync(faultCodesCsvPath, 'utf8');
const faultLines = faultCodesContent.split('\n').filter(l => l.trim());
const mapping = {};

// Skip header
for (let i = 1; i < faultLines.length; i++) {
  const line = faultLines[i];
  // Simple CSV parser for this specific format (mostly standard)
  const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (parts.length < 5) continue;

  const spnRaw = parts[1].trim();
  const fmiRaw = parts[2].trim();
  const system = parts[3].trim();
  const hmi = parts[4].replace(/"/g, '').trim();

  // Handle multiple SPNs or FMIs (e.g. 110, 16/0)
  const spns = spnRaw.split(/[/-]/);
  const fmis = fmiRaw.split(/[/-]/);

  for (const s of spns) {
    for (const f of fmis) {
      const key = `${s.trim()},${f.trim()}`;
      mapping[key] = { system, hmi, spn: s.trim(), fmi: f.trim() };
    }
  }
}

// Generate TS file
const mappingTs = `export const faultSystemMapping: Record<string, { system: string; hmi: string; spn: string; fmi: string }> = ${JSON.stringify(mapping, null, 2)};`;
fs.writeFileSync(outputMappingPath, mappingTs);
console.log('faultSystemMapping.ts generated.');

// --- 2. Parse Alerts Export CSV ---
console.log('Parsing Alerts Export...');
const alertsContent = fs.readFileSync(alertsCsvPath, 'utf8');
const alertLines = alertsContent.split('\n').filter(l => l.trim());
const alertsJson = [];

// Header is at line 6 (index 5)
// Skip metadata lines
let startIdx = 0;
for (let i = 0; i < alertLines.length; i++) {
  if (alertLines[i].includes('Alert Name,Alert Value,Equipment')) {
    startIdx = i + 1;
    break;
  }
}

for (let i = startIdx; i < alertLines.length; i++) {
  const line = alertLines[i];
  const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (parts.length < 5) continue;

  const alertName = parts[0].trim();
  const alertValue = parts[1].replace(/"/g, '').trim();
  const equipment = parts[2].trim();
  const type = parts[3].trim();
  const createdDate = parts[4].trim();

  alertsJson.push({
    srno: alertsJson.length + 1,
    alertName,
    alertValue,
    equipment,
    type,
    createdDate
  });
}

fs.writeFileSync(outputAlertsJsonPath, JSON.stringify(alertsJson, null, 2));
console.log(`alertsData.json generated with ${alertsJson.length} records.`);
