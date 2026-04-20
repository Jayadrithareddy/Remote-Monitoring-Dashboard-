import paho.mqtt.client as mqtt

# Configuration
BROKER = "broker.hivemq.com"
PORT = 1883  # Standard MQTT Port so others can easily connect!
TOPIC = "Jyo/data"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"Connected to {BROKER} on Topic: {TOPIC}")
        client.subscribe(TOPIC)
    else:
        print("Failed to connect")

def on_message(client, userdata, msg):
    message = msg.payload.decode()
    if "Hi" in message.lower() or message == "Hi":
        print("Hi")
        # Send a reply back to the dashboard's new reply topic
        client.publish("Genset/reply", "HELLO")
    else: 
        # Fallback if browser sends the old JSON before cache clears
        print("Hi")
        client.publish("Genset/reply", "HELLO")

# Standard TCP Client so ANYONE can use it!
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

print("Starting subscriber...")
client.connect(BROKER, PORT)
client.loop_forever()
