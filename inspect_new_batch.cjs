const fs = require('fs');
const path = require('path');

let output = '';

function inspectCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        output += 'NOT FOUND: ' + filePath + '\n';
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    output += '\n=== FILE: ' + path.basename(filePath) + ' === Total lines: ' + lines.length + '\n';
    for (let i = 0; i < 10; i++) {
        if (lines[i] !== undefined) {
            const line = lines[i].replace(/\r/g, '');
            const cols = line.split(',').slice(0, 8);
            output += 'Line ' + i + ': [' + cols.join(' | ') + ']\n';
        }
    }
}

const baseDir = 'C:/Users/Windows 11/Downloads/';
const files = [
    'Service Soon List.csv',
    'Service Now List.csv',
    'Service Due List.csv',
    'Service Over Due List.csv',
    'Oil Change Required List.csv',
    'Check Battery .csv',
    'DEF Filling List.csv',
    'Recurring Alarm Equipment.csv'
];

files.forEach(f => inspectCSV(baseDir + f));

fs.writeFileSync('inspect_new_batch.txt', output);
console.log('Done');
