const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
client.on('connect', () => { client.subscribe('Genset/#'); });
client.on('message', (topic, payload) => {
    let payloadStr = payload.toString();
    console.log("RAW EXACT STRING:");
    console.log(JSON.stringify(payloadStr));
    
    // Test the logic
    payloadStr = payloadStr.replace(/[\r\n]+/g, '');
    let originalStripped = payloadStr;
    
    if (payloadStr.includes('":') && !payloadStr.includes('","') && !payloadStr.includes('", "')) {
        payloadStr = payloadStr.replace(/([0-9])\s*"/g, '$1,"');
        payloadStr = payloadStr.replace(/"\s*"/g, '","');
    }
    console.log("---");
    console.log("AFTER LOGIC STRING:");
    console.log(JSON.stringify(payloadStr));
    
    if (originalStripped !== payloadStr) {
        console.log("LOGIC CHANGED SOMETHING.");
    } else {
        console.log("LOGIC DID NOT CHANGE ANYTHING.");
    }
    
    try {
        let j = JSON.parse(payloadStr);
        console.log("PARSE OK!", j["Gen-ID"]);
    } catch(e) {
        console.log("PARSE FAILED:", e.message);
    }
    process.exit(0);
});
