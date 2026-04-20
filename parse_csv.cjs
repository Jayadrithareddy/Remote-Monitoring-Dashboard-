const fs = require('fs');
const path = require('path');

function parseCSV(inputPath, outputPath, skipLines = 0, maxRows = 5000) {
    if (!fs.existsSync(inputPath)) {
        console.error(`File not found: ${inputPath}`);
        return 0;
    }

    const content = fs.readFileSync(inputPath, 'utf8');
    const allLines = content.split('\n');
    const lines = allLines.slice(skipLines);

    if (lines.length === 0) return 0;

    // Parse header - handle quoted fields
    const rawHeader = lines[0].replace(/\r/g, '');
    const headers = rawHeader.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const row = [];
        let current = '';
        let inQuotes = false;
        const line = lines[i].replace(/\r/g, '');

        for (let char of line) {
            if (char === '"' && inQuotes) {
                inQuotes = false;
            } else if (char === '"' && !inQuotes) {
                inQuotes = true;
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());

        const obj = {};
        headers.forEach((h, idx) => {
            if (h) {
                obj[h] = row[idx] || '';
            }
        });

        obj._rowIndex = i;
        parsedData.push(obj);
    }

    const subsetData = parsedData.slice(0, maxRows);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(subsetData, null, 2));
    console.log(`Saved ${subsetData.length} records to ${path.basename(outputPath)}`);
    return subsetData.length;
}

function parseAlertCSV(inputPath, outputPath, skipLines = 5) {
    if (!fs.existsSync(inputPath)) {
        console.error(`File not found: ${inputPath}`);
        return;
    }
    const content = fs.readFileSync(inputPath, 'utf8');
    const allLines = content.split('\n');
    const lines = allLines.slice(skipLines);

    if (lines.length === 0) return;

    const headers = lines[0].replace(/\r/g, '').split(',').map(h => h.trim());
    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const row = [];
        let current = '';
        let inQuotes = false;

        for (let char of lines[i].replace(/\r/g, '')) {
            if (char === '"' && inQuotes) {
                inQuotes = false;
            } else if (char === '"' && !inQuotes) {
                inQuotes = true;
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());

        const obj = {};
        headers.forEach((h, idx) => {
            if (h) {
                let key = h;
                if (h === 'Alert Name') key = 'alertName';
                if (h === 'Alert Value') key = 'alertValue';
                if (h === 'Equipment') key = 'equipment';
                if (h === 'Type') key = 'type';
                if (h === 'Created Date') key = 'createdDate';
                obj[key] = row[idx] || '';
            }
        });

        if (!obj.srno && !obj.srNo) {
            obj.srno = i;
        }

        parsedData.push(obj);
    }

    const subsetData = parsedData.slice(0, 1000);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(subsetData, null, 2));
    console.log(`Saved ${subsetData.length} alert records to ${path.basename(outputPath)}`);
}

const BASE = 'c:/Users/Windows 11/Downloads/';
const OUT = 'c:/Users/Windows 11/Downloads/New Compressed (zipped) Folder/src/data/';

console.log('\n=== Parsing Equipment CSV Files (skip 5 metadata rows) ===\n');

// Equipment Details
parseCSV(BASE + 'Total System Assets (1).csv',  OUT + 'totalSystemAssets.json',  5, 100000); // 93,736 rows
parseCSV(BASE + 'commissioneddevices (4).csv',  OUT + 'commissioned.json',       5, 80000);  // 73,911 rows
parseCSV(BASE + 'Yet To Commission.csv',         OUT + 'nonCommissioned.json',    5, 20000);  // 19,824 rows
parseCSV(BASE + 'Assets With KRM List (1).csv', OUT + 'assetsWithKrm.json',      5, 75000);  // 69,680 rows
parseCSV(BASE + 'Active KRM.csv',               OUT + 'activeKrm.json',          5, 45000);  // 43,501 rows
parseCSV(BASE + 'INACTIVE KRM.csv',             OUT + 'inactiveKrm.json',        5, 3000);   // 2,490 rows

// Service Overall
parseCSV(BASE + 'Service Soon List.csv',         OUT + 'serviceSoon.json',        5, 1000);   // count requested: 521
parseCSV(BASE + 'Service Now List.csv',         OUT + 'serviceNow.json',         5, 15000);  // count requested: 12137
parseCSV(BASE + 'Service Due List.csv',          OUT + 'serviceDue.json',         5, 6000);   // count requested: 4545
parseCSV(BASE + 'Service Over Due List.csv',     OUT + 'serviceOverdue.json',     5, 10000);  // count requested: 7446

// Business Insights
parseCSV(BASE + 'Oil Change Required List.csv',  OUT + 'oilChangeRequired.json',  5, 30000);  // count requested: 25386
parseCSV(BASE + 'Check Battery .csv',            OUT + 'checkBattery.json',       5, 1000);   // count requested: 740
parseCSV(BASE + 'DEF Filling List.csv',          OUT + 'defFillingRequired.json', 5, 500);    // count requested: 147

// Alerts
parseCSV(BASE + 'Recurring Alarm Equipment.csv', OUT + 'recurringAlarms.json',    5, 10000);  // count requested: 8014

// Original asset CSV (no metadata rows)
if (fs.existsSync(BASE + 'asset data .csv')) {
    parseCSV(BASE + 'asset data .csv', OUT + 'assetData.json', 0, 1000);
}

// Alerts CSV (skip 5 header rows) - This is for historical alerts log
if (fs.existsSync(BASE + 'Alerts _Export (1).csv')) {
    parseAlertCSV(BASE + 'Alerts _Export (1).csv', OUT + 'alertsData.json', 5);
}

console.log('\n=== Done! ===');
