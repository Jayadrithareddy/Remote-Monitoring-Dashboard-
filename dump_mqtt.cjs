const mqtt = require('mqtt');
const fs = require('fs');
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
client.on('connect', () => { client.subscribe('Genset/#'); });
client.on('message', (topic, payload) => {
    let payloadStr = payload.toString();
    fs.writeFileSync('raw_mqtt_dump.txt', payloadStr, 'utf8');
    console.log("Dumped to raw_mqtt_dump.txt");
    process.exit(0);
});
