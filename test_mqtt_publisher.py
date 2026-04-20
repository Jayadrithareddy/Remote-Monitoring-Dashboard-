import paho.mqtt.client as mqtt
import json

# -------- SOURCE BROKER (C2000 publishes here) --------
SOURCE_BROKER = "broker.hivemq.com"
SOURCE_PORT   = 1883

# -------- DESTINATION BROKER (Node-RED localhost) --------
DEST_BROKER = "127.0.0.1"
DEST_PORT   = 1883

TOPIC = "Genset/001/Data"

# -------- Destination Client (to Node-RED) --------
dest_client = mqtt.Client(client_id="dest_bridge", protocol=mqtt.MQTTv311)
dest_client.connect(DEST_BROKER, DEST_PORT, 60)
dest_client.loop_start()

# -------- Source Client (from C2000) --------
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to test.mosquitto.org")
        client.subscribe(TOPIC)
    else:
        print("Connection failed with code:", rc)

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8")
        print("Received:", payload)

        # Republish to localhost broker
        dest_client.publish(TOPIC, payload)

    except Exception as e:
        print("Error:", e)

source_client = mqtt.Client(client_id="source_bridge", protocol=mqtt.MQTTv311)
source_client.on_connect = on_connect
source_client.on_message = on_message

print("Connecting to source broker...")
source_client.connect(SOURCE_BROKER, SOURCE_PORT, 60)

source_client.loop_forever()