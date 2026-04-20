# 🚀 Live MQTT Data Integration Guide

## Overview
Connect your MQTT data stream from Node-RED to the Modern HMI Equipment Dashboard.

---

## 🔧 Architecture

```
C2000 Device (Laptop 1)
        ↓
test.mosquitto.org (MQTT Broker)
        ↓
Python Bridge Script
        ↓
Local MQTT Broker (127.0.0.1:1883)
        ↓
Node-RED (HTTP Endpoint)
        ↓
React Dashboard (Live Data Display)
```

---

## 📋 Step-by-Step Setup

### **Step 1: Install Local MQTT Broker (Mosquitto)**

#### Windows:
```bash
# Download from: https://mosquitto.org/download/
# Install and run as service
```

#### Linux/Mac:
```bash
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl start mosquitto
```

Verify it's running:
```bash
mosquitto -v
```

---

### **Step 2: Run Your Python Bridge Script**

Your existing script is perfect! Just run it:

```bash
python mqtt_bridge.py
```

This will forward data from `test.mosquitto.org` to your local broker.

---

### **Step 3: Configure Node-RED**

#### Option A: Import Flow (Easiest)

1. Open Node-RED: `http://localhost:1880`
2. Click **☰ Menu** → **Import**
3. Copy and paste the contents from `node-red-flow.json`
4. Click **Deploy**

#### Option B: Manual Setup

1. **Add MQTT Input Node**
   - Drag `mqtt in` node to canvas
   - Topic: `Jyo/data`
   - Server: `127.0.0.1:1883`
   - Output: `a parsed JSON object`

2. **Add Function Node (Store Data)**
   ```javascript
   // Store the latest data in flow context
   flow.set('latestData', msg.payload);
   return msg;
   ```

3. **Add HTTP Input Node**
   - Method: `GET`
   - URL: `/livedata`

4. **Add Function Node (Get Data)**
   ```javascript
   // Retrieve stored data
   const data = flow.get('latestData') || {
       BatteryVoltage: 0,
       OilPressure: 0,
       EngineSpeed: 0
   };
   msg.payload = data;
   return msg;
   ```

5. **Add HTTP Response Node**
   - Connect to the function node

6. **Connect the nodes:**
   ```
   MQTT In → JSON → Store Function
   HTTP In → Get Function → HTTP Response
   ```

7. Click **Deploy**

---

### **Step 4: Test Node-RED Endpoint**

Open your browser and visit:
```
http://localhost:1880/livedata
```

You should see JSON data like:
```json
{
  "BatteryVoltage": 1500,
  "OilPressure": 94,
  "EngineSpeed": 39
}
```

---

### **Step 5: Dashboard is Ready!**

The React dashboard will automatically:
- ✅ Connect to `http://localhost:1880/livedata`
- ✅ Poll every 1 second for new data
- ✅ Display live metrics in gauge cards
- ✅ Show connection status (green = live, red = demo mode)

---

## 🎯 Expected Data Format

Your MQTT message should be JSON:

```json
{
  "BatteryVoltage": 1500,
  "OilPressure": 94,
  "EngineSpeed": 39,
  "Temperature": 85,
  "FuelLevel": 75
}
```

Add more fields as needed - the dashboard will display them!

---

## 🐛 Troubleshooting

### Problem: Dashboard shows "Demo Mode"
**Solution:** 
- Check if Node-RED is running: `http://localhost:1880`
- Test endpoint: `http://localhost:1880/livedata`
- Check browser console for errors

### Problem: No data in Node-RED
**Solution:**
- Verify Python bridge is running
- Check local MQTT broker: `mosquitto -v`
- Use MQTT Explorer to debug: `mqtt-explorer.com`

### Problem: CORS Error
**Solution:** Add to Node-RED `settings.js`:
```javascript
httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
}
```

---

## 🔄 Alternative: WebSocket Connection (Advanced)

For real-time streaming without polling:

### Node-RED Setup:
1. Add `websocket out` node
2. Path: `/ws/livedata`
3. Connect MQTT → WebSocket

### React Code:
```typescript
const ws = new WebSocket('ws://localhost:1880/ws/livedata');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setLiveData(data);
};
```

---

## 📊 Adding Custom Metrics

To add new metrics to the dashboard:

1. **Update your MQTT payload** to include new fields
2. **Edit `/src/app/components/LiveDataPanel.tsx`**
3. **Add new card** to the `dataCards` array:

```typescript
{
  label: 'Custom Metric',
  value: liveData.CustomMetric || 0,
  unit: 'units',
  icon: Activity,
  color: '#10B981',
  min: 0,
  max: 100,
}
```

---

## ✅ Verification Checklist

- [ ] Local MQTT broker running (mosquitto)
- [ ] Python bridge script running
- [ ] Node-RED running at `http://localhost:1880`
- [ ] HTTP endpoint returns data: `http://localhost:1880/livedata`
- [ ] Dashboard shows "Connected" status (green dot)
- [ ] Live data updating in cards

---

## 🎉 Success!

Your dashboard is now showing **LIVE MQTT DATA** from your equipment!

The live data panel shows:
- ⚡ Battery Voltage
- 💧 Oil Pressure  
- ⚙️ Engine Speed
- 🌡️ Temperature
- 💨 Fuel Level

All updating in real-time with smooth animations! 🚀
