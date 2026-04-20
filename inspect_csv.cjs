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
    'Total System Assets (1).csv',
    'commissioneddevices (4).csv',
    'Yet To Commission.csv',
    'Assets With KRM List (1).csv',
    'Active KRM.csv',
    'INACTIVE KRM.csv',
    'asset data .csv',
];

files.forEach(f => inspectCSV(baseDir + f));

fs.writeFileSync('inspect_output.txt', output);
console.log('Done. Written to inspect_output.txt');
