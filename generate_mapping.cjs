const fs = require('fs');

const csvPath = 'c:\\Users\\Windows 11\\Downloads\\Fault Codes Master With System Seggragation.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

const lines = csvContent.split('\n');
const mapping = {};

// Skip header (line 0)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Use a regex to properly handle commas inside quoted fields if any, 
  // but this CSV looks simple enough (comma separated).
  const parts = line.split(',');
  if (parts.length >= 4) {
    const spn = parts[1]?.trim();
    const fmi = parts[2]?.trim();
    const system = parts[3]?.trim();
    
    if (spn && fmi && system) {
      mapping[`${spn},${fmi}`] = system;
    }
  }
}

// Manual mappings for non-SPN alerts
const manualMappings = {
  'W_Low_fuel_level': 'Fuel System',
  'T_Low_fuel_level': 'Fuel System',
  'T_Genset_Low_Speed': 'Air System', // Usually air/combustion related or general engine
  'T_High_Engine_temp': 'Cooling System',
  'T_Low_Coolant_Temp': 'Cooling System',
  'T_Genset_Low_Voltage': 'Electrical System',
  // Add more if needed
};

// Merge mappings
const finalMapping = { ...mapping, ...manualMappings };

const output = `
export const faultSystemMapping: Record<string, string> = ${JSON.stringify(finalMapping, null, 2)};

export const getAffectedSystem = (alertValue: string, alertName: string): string => {
  // Try to match SPN,FMI from alertValue
  const match = alertValue.match(/^(\\d+),(\\d+)/);
  if (match) {
    const key = \`\${match[1]},\${match[2]}\`;
    if (faultSystemMapping[key]) return faultSystemMapping[key];
  }
  
  // Try direct match for alertName or alertValue (for items like W_Low_fuel_level)
  if (faultSystemMapping[alertName]) return faultSystemMapping[alertName];
  if (faultSystemMapping[alertValue]) return faultSystemMapping[alertValue];

  // Heuristic fallbacks
  const str = (alertValue + ' ' + alertName).toLowerCase();
  if (str.includes('fuel')) return 'Fuel System';
  if (str.includes('coolant') || str.includes('temp')) return 'Cooling System';
  if (str.includes('oil') || str.includes('lube')) return 'Lube Oil System';
  if (str.includes('battery') || str.includes('voltage') || str.includes('electrical')) return 'Electrical System';
  if (str.includes('air')) return 'Air System';
  if (str.includes('after-treatment') || str.includes('def')) return 'After-treatment System';

  return 'Other';
};
`;

fs.writeFileSync('c:\\Users\\Windows 11\\Downloads\\New Compressed (zipped) Folder\\src\\app\\data\\faultSystemMapping.ts', output);
console.log('Mapping generated successfully.');
