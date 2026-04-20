const fs = require('fs');
let payload = fs.readFileSync('mqtt_output.txt', 'utf16le');
if (!payload.includes('{')) {
    console.log("No JSON found");
    process.exit(1);
}
let payloadStr = payload.substring(payload.indexOf('{'));
payloadStr = payloadStr.trim(); // remove trailing newlines

console.log("Original:", payloadStr);

if (payloadStr.includes('":') && !payloadStr.includes('","') && !payloadStr.includes('", "')) {
    console.log("Applying regex fix...");
    payloadStr = payloadStr.replace(/([0-9])\s*"/g, '$1,"');
    payloadStr = payloadStr.replace(/"\s*"/g, '","');
    console.log("Fixed:", payloadStr);
}

try {
    let data = JSON.parse(payloadStr);
    console.log("Successfully parsed JSON!");
    console.log("Gen-ID:", data['Gen-ID']);
    console.log("Monitoring:", data['--Monitoring Parameters']);
} catch(e) {
    console.error("JSON parse error:", e.message);
}
