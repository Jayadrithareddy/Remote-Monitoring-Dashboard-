const fs = require('fs');
const path = require('path');

// Paths
const faultCodesCsvPath = path.join(__dirname, 'Service Overall files', 'Fault Codes Master With System Seggragation.csv');
const alertsCsvPath = path.join(__dirname, 'Service Overall files', 'Alerts _Export (1) (1).csv');
const zeptoInfoCsvPath = path.join(__dirname, 'Service Overall files', 'Zepto  - Information Report for Customer.csv');

const outputMappingPath = path.join(__dirname, 'src', 'app', 'data', 'faultSystemMapping.ts');
const outputAlertsJsonPath = path.join(__dirname, 'src', 'app', 'data', 'ServiceOverall', 'alertsData.json');
const outputInfoReportJsonPath = path.join(__dirname, 'src', 'app', 'data', 'ServiceOverall', 'informationReportData.json');

// Helper to parse CSV lines correctly with quoted commas
function parseCsvLine(line) {
  const parts = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

// --- 1. Parse Fault Codes CSV ---
console.log('Parsing Fault Codes...');
const faultCodesContent = fs.readFileSync(faultCodesCsvPath, 'utf8');
const faultLines = faultCodesContent.split(/\r?\n/).filter(l => l.trim());
const mapping = {};

for (let i = 1; i < faultLines.length; i++) {
  const parts = parseCsvLine(faultLines[i]);
  if (parts.length < 5) continue;

  const faultCode = parts[0]; // Numerical ID
  const spnRaw = parts[1];
  const fmiRaw = parts[2];
  const system = parts[3];
  const hmi = parts[4].replace(/"/g, '');

  const spns = spnRaw.split(/[/-]/);
  const fmis = fmiRaw.split(/[/-]/);

  for (const s of spns) {
    for (const f of fmis) {
      const key = `${s.trim()},${f.trim()}`;
      mapping[key] = { faultCode, system, hmi, spn: s.trim(), fmi: f.trim() };
    }
  }
}
const mappingTs = `export const faultSystemMapping: Record<string, { faultCode: string; system: string; hmi: string; spn: string; fmi: string }> = ${JSON.stringify(mapping, null, 2)};`;
fs.writeFileSync(outputMappingPath, mappingTs);
console.log('faultSystemMapping.ts generated.');

// --- 2. Parse Alerts Export CSV ---
console.log('Parsing Alerts Export...');
const alertsContent = fs.readFileSync(alertsCsvPath, 'utf8');
const alertLines = alertsContent.split(/\r?\n/).filter(l => l.trim());
const alertsJson = [];
let alertStartIdx = 0;
for (let i = 0; i < alertLines.length; i++) {
  if (alertLines[i].includes('Alert Name,Alert Value,Equipment')) {
    alertStartIdx = i + 1;
    break;
  }
}
for (let i = alertStartIdx; i < alertLines.length; i++) {
  const parts = parseCsvLine(alertLines[i]);
  if (parts.length < 5) continue;
  alertsJson.push({
    srno: alertsJson.length + 1,
    alertName: parts[0],
    alertValue: parts[1],
    equipment: parts[2],
    type: parts[3],
    createdDate: parts[4]
  });
}
fs.writeFileSync(outputAlertsJsonPath, JSON.stringify(alertsJson, null, 2));
console.log(`alertsData.json generated with ${alertsJson.length} records.`);

// --- 3. Parse Zepto Info Report CSV ---
console.log('Parsing Information Report...');
const infoContent = fs.readFileSync(zeptoInfoCsvPath, 'utf8');
const infoLines = infoContent.split(/\r?\n/).filter(l => l.trim());
const infoJson = [];
for (let i = 1; i < infoLines.length; i++) {
  const parts = parseCsvLine(infoLines[i]);
  if (parts.length < 15) continue;
  infoJson.push({
    _rowIndex: i,
    "ENTRYDATE": parts[0],
    "DeviceDate": parts[1],
    "HWID": parts[2],
    "R_Phase_Voltage": parts[3],
    "Y_Phase_Voltage": parts[4],
    "B_Phase_Voltage": parts[5],
    "CURRENT_R_PHASE": parts[6],
    "CURRENT_Y_PHASE": parts[7],
    "CURRENT_B_PHASE": parts[8],
    "RY_Voltage": parts[9],
    "YB_Voltage": parts[10],
    "BR_Voltage": parts[11],
    "Engine_Oil_Pressure": parts[12],
    "Coolant_Temperature": parts[13],
    "Fuel_Level": parts[14],
    "Battery_voltage": parts[15],
    "RPM": parts[16],
    "Equip_status": parts[17],
    "Total_Engine_Hours": parts[18] || "-",
    "Energy_generated": parts[19] || "-"
  });
}
fs.writeFileSync(outputInfoReportJsonPath, JSON.stringify(infoJson, null, 2));
console.log(`informationReportData.json generated with ${infoJson.length} records.`);
