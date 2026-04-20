# ⚡ INSTANT SETUP - Direct MQTT Connection

## 🎯 NO NODE-RED NEEDED!

Your dashboard now connects **directly to MQTT** - just like your screenshot shows!

---

## 🚀 3-Step Quick Start

### **1. Start Your Dashboard**

```bash
npm run dev
```

Opens at: http://localhost:5173

---

### **2. Publish MQTT Data**

Your C2000 should publish to:
- **Broker:** `test.mosquitto.org:1883`
- **Topic:** `Jyo/data`
- **Format:**
  ```json
  {"engineSpeed": 75, "batteryVolt": 300, "oilPressure": 46}
  ```

---

### **3. Watch Live Data! ✨**

Dashboard will show:
- 🟢 Connected status
- Live gauge updates
- Real-time values
- Message count

**That's it!** No Node-RED, no HTTP polling, pure MQTT! 🎉

---

## 🧪 Test Without C2000

Use our test publisher:

```bash
python test_mqtt_publisher_direct.py
```

This simulates your C2000 exactly like your screenshot!

You'll see:
```
Received: {"engineSpeed": 75, "batteryVolt": 300, "oilPressure": 46}
Received: {"engineSpeed": 76, "batteryVolt": 400, "oilPressure": 48}
Received: {"engineSpeed": 77, "batteryVolt": 500, "oilPressure": 50}
...
```

And dashboard updates instantly! ⚡

---

## 📊 Data Flow

```
Your C2000
    ↓
test.mosquitto.org:1883
    ↓ (WebSocket on port 8080)
Dashboard (Direct Connection)
    ↓
Live Gauges Update!
```

**Real-time. No delays. No middleman.**

---

## 🔧 What Happens When...

### **You START publishing:**
✅ Dashboard shows 🟢 Connected  
✅ Gauges update instantly  
✅ Message count increases  
✅ Timestamp shows current time  

### **You STOP publishing:**
✅ Dashboard keeps last values  
✅ Still shows 🟢 Connected  
✅ Timestamp freezes at last update  
✅ Ready for next message  

### **Broker disconnects:**
❌ Dashboard shows 🔴 Disconnected  
🔄 Auto-reconnects every 1 second  
✅ Resumes when broker available  

---

## 🎨 What You See on Dashboard

```
╔════════════════════════════════════════════════════╗
║ ⚡ Live Equipment Monitoring (MQTT Direct)        ║
║                    🟢 Connected  Last: 14:23:45   ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║  ⚡ Battery    💧 Oil      ⚙️ Engine   🌡️ Temp    ║
║    300 mV      46 bar     75 RPM     85°C        ║
║  ▓▓▓▓▓░░       ▓▓▓▓░░     ▓▓▓▓▓░     ▓▓▓▓▓░      ║
║                                                     ║
║  Raw MQTT Data:                                    ║
║  {                                                  ║
║    "engineSpeed": 75,                              ║
║    "batteryVolt": 300,                             ║
║    "oilPressure": 46                               ║
║  }                                                  ║
╚════════════════════════════════════════════════════╝
```

---

## 🛠️ For Local Broker

### **1. Enable WebSocket in Mosquitto**

Edit `mosquitto.conf`:
```conf
listener 1883
protocol mqtt

listener 9001
protocol websockets
```

### **2. Update Dashboard**

Edit `/src/app/components/LiveDataPanel.tsx`:
```typescript
const MQTT_CONFIG = {
  broker: 'ws://localhost:9001',  // ← Change this line
  topic: 'Jyo/data',
};
```

### **3. Restart Mosquitto**
```bash
sudo systemctl restart mosquitto
```

### **4. Publish to Local**
```bash
python test_mqtt_publisher_direct.py
# Edit BROKER = "localhost" in the file
```

---

## 🔍 Troubleshooting

### Dashboard shows "Disconnected"?

**Check browser console (F12):**
```
✅ Should see: "Connected to MQTT broker"
❌ If error: Check broker is running and WebSocket enabled
```

**Test WebSocket:**
```bash
# Public broker
telnet test.mosquitto.org 8080

# Local broker
telnet localhost 9001
```

### No data appearing?

**Test MQTT topic:**
```bash
mosquitto_sub -h test.mosquitto.org -t "Jyo/data"
```

You should see your published messages.

### Wrong values?

Check JSON format matches exactly:
```json
{
  "engineSpeed": 75,
  "batteryVolt": 300,
  "oilPressure": 46
}
```

Field names are **case-sensitive**!

---

## 📈 Advantages Over Node-RED

| Feature | Node-RED | Direct MQTT |
|---------|----------|-------------|
| Setup | 3 components | 1 component |
| Latency | 1 second | Instant |
| Dependencies | Many | None |
| When data stops | Polls empty | Shows last |
| Real-time | No | Yes |
| **Better?** | ❌ | ✅ |

---

## ✅ Success Checklist

- [x] Dashboard created with direct MQTT
- [x] Connects to WebSocket MQTT
- [x] Shows live data from your exact format
- [x] Auto-reconnects on disconnect
- [x] No Node-RED needed
- [ ] **YOU RUN THE DASHBOARD**
- [ ] **YOU SEE 🟢 CONNECTED**
- [ ] **GAUGES UPDATE LIVE**

---

## 🎉 You're Done!

Just run:
```bash
npm run dev
```

And start publishing MQTT data!

**The dashboard will automatically:**
- Connect to MQTT
- Subscribe to "Jyo/data"
- Display live values
- Update in real-time
- Handle disconnections
- Show connection status

**No configuration needed. It just works! ⚡**

---

## 📞 Quick Reference

| What | Value |
|------|-------|
| Dashboard URL | http://localhost:5173 |
| MQTT Broker | test.mosquitto.org:1883 |
| WebSocket | test.mosquitto.org:8080 |
| Topic | Jyo/data |
| Data Format | `{"engineSpeed":75,"batteryVolt":300,"oilPressure":46}` |

---

**Start publishing, see results instantly! 🚀**

*For detailed setup: See DIRECT_MQTT_SETUP.md*
