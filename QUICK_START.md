# ⚡ QUICK START - Live MQTT Data in Dashboard

## 🎯 What You'll Achieve
Connect your C2000 MQTT data to the Modern HMI Dashboard in **5 minutes**!

---

## 📦 Prerequisites

Install these first:

```bash
# 1. Mosquitto (Local MQTT Broker)
# Windows: Download from https://mosquitto.org/download/
# Linux/Mac:
sudo apt-get install mosquitto mosquitto-clients

# 2. Python MQTT Library
pip install paho-mqtt

# 3. Node-RED (if not installed)
npm install -g node-red
```

---

## 🚀 5-Minute Setup

### **1️⃣ Start Local MQTT Broker**

```bash
# Start Mosquitto
mosquitto -v

# Keep this terminal open
```

You should see: `mosquitto version X.X.X running`

---

### **2️⃣ Run MQTT Bridge**

Open a **NEW terminal**:

```bash
# Use the updated script
python mqtt_bridge_updated.py
```

You should see:
```
✅ Connected to local MQTT broker
✅ Connected to test.mosquitto.org
📡 Subscribed to topic: Jyo/data
🚀 Bridge is running!
```

---

### **3️⃣ Test with Simulated Data** (Optional)

Open **ANOTHER terminal** to test:

```bash
python test_mqtt_publisher.py
```

This simulates your C2000 device and publishes test data.

---

### **4️⃣ Configure Node-RED**

Open: `http://localhost:1880`

**Quick Setup:**

1. **MQTT In Node:**
   - Server: `127.0.0.1:1883`
   - Topic: `Jyo/data`

2. **Function Node (Store):**
   ```javascript
   flow.set('latestData', msg.payload);
   return msg;
   ```

3. **HTTP In Node:**
   - Method: `GET`
   - URL: `/livedata`

4. **Function Node (Get):**
   ```javascript
   msg.payload = flow.get('latestData') || {};
   return msg;
   ```

5. **HTTP Response Node**

**Connect:** MQTT → Store → (nothing)
            HTTP In → Get → HTTP Response

6. Click **Deploy** ✅

---

### **5️⃣ Test Node-RED Endpoint**

Open browser:
```
http://localhost:1880/livedata
```

You should see JSON:
```json
{
  "BatteryVoltage": 1500,
  "OilPressure": 94,
  "EngineSpeed": 39
}
```

✅ **If you see this, you're done!**

---

### **6️⃣ Start React Dashboard**

The dashboard is already configured!

Just run:
```bash
npm run dev
```

Open: `http://localhost:5173`

**Check:**
- ✅ Green "Connected" indicator
- ✅ Live data updating every second
- ✅ Gauges showing battery, oil, speed, etc.

---

## 🎉 SUCCESS!

Your dashboard is now showing **LIVE MQTT DATA**!

---

## 📊 What's Happening Behind the Scenes

```
C2000 Device
    ↓ publishes to
test.mosquitto.org (Cloud MQTT)
    ↓ forwarded by
Python Bridge
    ↓ to
127.0.0.1:1883 (Local Mosquitto)
    ↓ received by
Node-RED (stores in memory)
    ↓ served via
HTTP Endpoint /livedata
    ↓ polled by
React Dashboard (every 1 second)
    ↓ displays in
Beautiful HMI Gauges ⚡
```

---

## 🔍 Troubleshooting

### Dashboard shows "Demo Mode"
- ✅ Check Node-RED is running
- ✅ Test: `http://localhost:1880/livedata`
- ✅ Check browser console (F12)

### No data in Node-RED
- ✅ Is Mosquitto running? `mosquitto -v`
- ✅ Is bridge script running?
- ✅ Check Node-RED debug panel

### Bridge connection failed
- ✅ Make sure Mosquitto started first
- ✅ Check port 1883 is not blocked
- ✅ Try `127.0.0.1` instead of `localhost`

---

## 📝 File Checklist

- ✅ `mqtt_bridge_updated.py` - Bridge script
- ✅ `test_mqtt_publisher.py` - Test publisher
- ✅ `node-red-flow.json` - Node-RED config
- ✅ `LiveDataPanel.tsx` - Dashboard component

---

## 🎯 Next Steps

1. **Customize Metrics:**
   - Edit `LiveDataPanel.tsx`
   - Add your own data fields

2. **Add More Sensors:**
   - Modify your C2000 to send more data
   - Dashboard will automatically display it

3. **Historical Data:**
   - Add database storage in Node-RED
   - Use InfluxDB or MongoDB

4. **Alerts:**
   - Set thresholds in dashboard
   - Trigger notifications

---

## 💡 Pro Tips

- Use MQTT Explorer to debug: `http://mqtt-explorer.com/`
- Check Node-RED logs: `node-red-log`
- Monitor Mosquitto: `mosquitto_sub -h 127.0.0.1 -t "Jyo/data"`

---

## 🆘 Need Help?

Common issues and solutions in `MQTT_SETUP_GUIDE.md`

---

**You're all set! Enjoy your live HMI dashboard! 🚀**
