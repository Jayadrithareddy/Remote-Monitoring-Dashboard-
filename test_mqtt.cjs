const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
console.log("Connecting...");
client.on('connect', () => {
    console.log("Connected to broker");
    client.subscribe('Genset/#');
});
client.on('message', (topic, message) => {
    console.log("Received on", topic);
    console.log(message.toString());
    process.exit(0);
});
setTimeout(() => { console.log("Timeout waiting for message"); process.exit(0); }, 30000);
