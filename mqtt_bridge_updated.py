"""
MQTT Bridge Script - Forwards data from Cloud to Local Node-RED
Author: Industrial HMI Dashboard
Purpose: Bridge MQTT data from test.mosquitto.org to localhost for Node-RED
"""

import paho.mqtt.client as mqtt
import json
import time

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Source Broker (C2000 publishes here)
SOURCE_BROKER = "test.mosquitto.org"
SOURCE_PORT   = 1883

# Destination Broker (Node-RED localhost)
DEST_BROKER = "127.0.0.1"  # or "localhost"
DEST_PORT   = 1883

# MQTT Topic
TOPIC = "Jyo/data"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DESTINATION CLIENT (to Node-RED)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

print("🔧 Setting up Destination Client (Node-RED)...")
dest_client = mqtt.Client(client_id="dest_bridge", protocol=mqtt.MQTTv311)

try:
    dest_client.connect(DEST_BROKER, DEST_PORT, 60)
    dest_client.loop_start()
    print(f"✅ Connected to local MQTT broker at {DEST_BROKER}:{DEST_PORT}")
except Exception as e:
    print(f"❌ Failed to connect to local broker: {e}")
    print("💡 Make sure Mosquitto is running on localhost:1883")
    exit(1)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SOURCE CLIENT (from C2000)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def on_connect(client, userdata, flags, rc):
    """Callback when connected to source broker"""
    if rc == 0:
        print(f"✅ Connected to {SOURCE_BROKER}")
        client.subscribe(TOPIC)
        print(f"📡 Subscribed to topic: {TOPIC}")
        print("━" * 60)
        print("🚀 Bridge is running! Forwarding messages...")
        print("━" * 60)
    else:
        print(f"❌ Connection failed with code: {rc}")

def on_message(client, userdata, msg):
    """Callback when message received from source broker"""
    try:
        # Decode the payload
        payload = msg.payload.decode("utf-8")
        
        # Try to parse as JSON to validate
        try:
            data = json.loads(payload)
            print(f"📩 Received: {json.dumps(data, indent=2)}")
        except json.JSONDecodeError:
            print(f"📩 Received (raw): {payload}")
        
        # Forward to local broker
        dest_client.publish(TOPIC, payload)
        print(f"✉️  Forwarded to Node-RED at {DEST_BROKER}")
        print("─" * 60)
        
    except Exception as e:
        print(f"❌ Error processing message: {e}")

def on_disconnect(client, userdata, rc):
    """Callback when disconnected from source broker"""
    if rc != 0:
        print(f"⚠️  Unexpected disconnect from {SOURCE_BROKER}. Reconnecting...")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# START BRIDGE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

print("━" * 60)
print("🌉 MQTT BRIDGE - Cloud to Local Node-RED")
print("━" * 60)
print(f"📥 Source:      {SOURCE_BROKER}:{SOURCE_PORT}")
print(f"📤 Destination: {DEST_BROKER}:{DEST_PORT}")
print(f"📡 Topic:       {TOPIC}")
print("━" * 60)

source_client = mqtt.Client(client_id="source_bridge", protocol=mqtt.MQTTv311)
source_client.on_connect = on_connect
source_client.on_message = on_message
source_client.on_disconnect = on_disconnect

print("🔌 Connecting to source broker...")
try:
    source_client.connect(SOURCE_BROKER, SOURCE_PORT, 60)
    source_client.loop_forever()
except KeyboardInterrupt:
    print("\n\n━" * 60)
    print("🛑 Bridge stopped by user")
    print("━" * 60)
    source_client.disconnect()
    dest_client.disconnect()
except Exception as e:
    print(f"\n❌ Bridge error: {e}")
    source_client.disconnect()
    dest_client.disconnect()
