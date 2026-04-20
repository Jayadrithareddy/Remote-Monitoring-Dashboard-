const fs = require('fs');
const files = [
    'Total System Assets (1).csv',
    'commissioneddevices (4).csv',
    'Yet To Commission.csv',
    'Assets With KRM List (1).csv',
    'Active KRM.csv',
    'INACTIVE KRM.csv',
    'Service Soon List.csv',
    'Service Now List.csv',
    'Service Due List.csv',
    'Service Over Due List.csv',
    'Oil Change Required List.csv',
    'Check Battery .csv',
    'DEF Filling List.csv',
    'Recurring Alarm Equipment.csv'
];
const result = {};
files.forEach(f => {
    const p = 'C:/Users/Windows 11/Downloads/' + f;
    if (fs.existsSync(p)) {
        const c = fs.readFileSync(p, 'utf8');
        const lines = c.split('\n').filter(l => l.trim());
        result[f] = lines.length - 6;  // minus 5 metadata + 1 header row
    } else {
        result[f] = 0;
    }
});
fs.writeFileSync('counts_output.txt', JSON.stringify(result, null, 2));
console.log('Done');
