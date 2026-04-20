const fs = require('fs');
let payloadStr = fs.readFileSync('raw_mqtt_dump.txt', 'utf8');

payloadStr = payloadStr.replace(/[\r\n]+/g, '');
if (payloadStr.includes('":') && !payloadStr.includes('","') && !payloadStr.includes('", "')) {
  payloadStr = payloadStr.replace(/([0-9])\s*"/g, '$1,"');
  payloadStr = payloadStr.replace(/"\s*"/g, '","');
}
try {
  let j = JSON.parse(payloadStr);
  console.log("SUCCESS:", JSON.stringify(j).substring(0, 100));
} catch(e) {
  console.log("FAILED:", e.message);
  console.log(payloadStr);
}
