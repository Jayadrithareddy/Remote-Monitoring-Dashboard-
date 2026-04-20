import paho.mqtt.client as mqtt
import time

# Configuration
BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC = "Jyo/data"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ Connected successfully!")
        client.subscribe(TOPIC)
    else:
        print(f"❌ Connection failed with code {rc}")

def on_message(client, userdata, msg):
    print(f"📩 RECEIVED: '{msg.payload.decode()}'")

# Compatibility for Paho MQTT 2.0+ (which you have installed)
try:
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
except AttributeError:
    # Fallback for older versions
    client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message

print(f"🔗 Connecting to {BROKER}...")
client.connect(BROKER, PORT, 60)
client.loop_start()

try:
    print(f"🚀 Sending 'hi' to {TOPIC}...")
    client.publish(TOPIC, "hi")
    
    # Keep alive for 5 seconds to receive the echo
    time.sleep(5)
    
except KeyboardInterrupt:
    pass
finally:
    client.loop_stop()
    client.disconnect()
    print("👋 Stopped.")
