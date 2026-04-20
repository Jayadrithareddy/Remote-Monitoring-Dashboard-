const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/Windows 11/Downloads/New Compressed (zipped) Folder/Service Overall files';
const equipmentDir = path.join(baseDir, 'Equipment Details');
const businessDir = path.join(baseDir, 'Bussiness Insights');

const files = {
  // Main Folder
  'serviceSoon': path.join(baseDir, 'Service Soon List.xlsx'),
  'serviceNow': path.join(baseDir, 'Service Now List.xlsx'),
  'serviceDue': path.join(baseDir, 'Service Due List.xlsx'),
  'serviceOverdue': path.join(baseDir, 'Service Over Due List.xlsx'),
  'alerts': path.join(baseDir, 'Alerts _Export (1).csv'),
  
  // Equipment Details
  'total': path.join(equipmentDir, 'Total System Assets (1).xlsx'),
  'commissioned': path.join(equipmentDir, 'commissioneddevices (4).xlsx'),
  'yetToCommission': path.join(equipmentDir, 'Yet To Commission.xlsx'),
  'withKrm': path.join(equipmentDir, 'Assets With KRM List (1).xlsx'),
  'activeKrm': path.join(equipmentDir, 'Active KRM.xlsx'),
  'inactiveKrm': path.join(equipmentDir, 'INACTIVE KRM.xlsx'),
  
  // Business Insights
  'oilChange': path.join(businessDir, 'Oil Change Required List.xlsx'),
  'checkBattery': path.join(businessDir, 'Check Battery .xlsx'),
  'defFilling': path.join(businessDir, 'DEF Filling List.xlsx')
};

const results = {};

for (const [key, filePath] of Object.entries(files)) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    // Rough estimate for XLSX if we can't parse or if we have a size-based guess
    // But better to check for CSV versions if they exist
    results[key] = {
        name: path.basename(filePath),
        size: stats.size,
        exists: true
    };
  } else {
    results[key] = { exists: false };
  }
}

// Check for CSV versions
['serviceSoon', 'serviceNow', 'serviceDue', 'serviceOverdue', 'total', 'commissioned', 'yetToCommission', 'withKrm', 'activeKrm', 'inactiveKrm', 'oilChange', 'checkBattery', 'defFilling'].forEach(key => {
    const csvPath = files[key].replace('.xlsx', '.csv');
    if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim()).length;
        results[key].csvLines = lines - 6; // metadata + header
    }
});

console.log(JSON.stringify(results, null, 2));
