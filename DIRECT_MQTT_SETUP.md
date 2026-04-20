# 🚀 Direct MQTT Connection - No Node-RED Required!

## ✨ What Changed

The dashboard now connects **directly to MQTT broker** without needing Node-RED!

**Benefits:**
- ✅ Simpler setup - no Node-RED needed
- ✅ Real-time updates - instant data display
- ✅ Auto-reconnect - handles disconnections
- ✅ Live sync - stops when data stops

---

## 🔧 How It Works

```
C2000 Device
    ↓
MQTT Broker (WebSocket)
    ↓
React Dashboard ← Direct connection!
    ↓
Live Gauges
```

---

## 📋 Setup Options

### **Option 1: Use Public MQTT Broker** (Easiest for Testing)

**Already configured!** Just run your dashboard:

```bash
npm run dev
```

The dashboard connects to: `ws://test.mosquitto.org:8080`

Your C2000 should publish to: `test.mosquitto.org:1883` (topic: `Jyo/data`)

**That's it!** ✅

---

### **Option 2: Use Local MQTT Broker** (Recommended for Production)

#### **Step 1: Install Mosquitto**

**Windows:**
```bash
# Download from: https://mosquitto.org/download/
# Install with default options
```

**Linux/Mac:**
```bash
sudo apt-get install mosquitto
```

#### **Step 2: Enable WebSocket Support**

Edit Mosquitto config: `mosquitto.conf`

Add these lines:
```conf
# Standard MQTT
listener 1883
protocol mqtt

# WebSocket for browser
listener 9001
protocol websockets
```

#### **Step 3: Restart Mosquitto**

**Windows:**
```bash
net stop mosquitto
net start mosquitto
```

**Linux/Mac:**
```bash
sudo systemctl restart mosquitto
```

#### **Step 4: Update Dashboard Config**

Edit `/src/app/components/LiveDataPanel.tsx`:

```typescript
const MQTT_CONFIG = {
  broker: 'ws://localhost:9001',  // ← Change this
  topic: 'Jyo/data',
  // ... rest
};
```

#### **Step 5: Run Dashboard**

```bash
npm run dev
```

**Done!** Dashboard connects to local broker ✅

---

## 🎯 Your Data Format

Dashboard expects this JSON on topic `Jyo/data`:

```json
{
  "engineSpeed": 75,
  "batteryVolt": 300,
  "oilPressure": 46
}
```

Optional fields (auto-calculated from above if missing):
```json
{
  "temperature": 85,
  "fuelLevel": 75
}
```

---

## 🔌 Connection Flow

```
1. Dashboard loads
   ↓
2. Connects to MQTT broker via WebSocket
   ↓
3. Subscribes to "Jyo/data" topic
   ↓
4. Receives messages in real-time
   ↓
5. Updates gauges instantly
   ↓
6. When data stops → gauges freeze at last value
   ↓
7. When data resumes → gauges update again
```

---

## 📊 What You'll See

### **When Connected (🟢 Green)**
- "Connected" status
- Live data in gauges
- Message count increasing
- Timestamp updating

### **When Disconnected (🔴 Red)**
- "Disconnected" status
- Last known values frozen
- Warning message displayed
- Auto-retry connection

---

## 🛠️ Customization

### **Change MQTT Broker**

Edit `LiveDataPanel.tsx`:

```typescript
const MQTT_CONFIG = {
  broker: 'ws://YOUR_BROKER:PORT',  // WebSocket URL
  topic: 'YOUR_TOPIC',
  // ...
};
```

### **Add Authentication**

```typescript
const MQTT_CONFIG = {
  broker: 'ws://localhost:9001',
  topic: 'Jyo/data',
  options: {
    username: 'your_username',
    password: 'your_password',
    clientId: `mqtt_dashboard_${Math.random().toString(16).slice(3)}`,
    clean: true,
  }
};
```

### **Use Secure WebSocket (WSS)**

```typescript
const MQTT_CONFIG = {
  broker: 'wss://YOUR_BROKER:8081',  // Note: wss:// instead of ws://
  // ...
};
```

---

## 🚦 Testing Your Setup

### **Test 1: Check WebSocket Port**

Open browser console (F12) and run:
```javascript
const ws = new WebSocket('ws://test.mosquitto.org:8080');
ws.onopen = () => console.log('✅ WebSocket works!');
ws.onerror = () => console.log('❌ WebSocket failed!');
```

### **Test 2: Publish Test Message**

Use MQTT Explorer or mosquitto_pub:

```bash
mosquitto_pub -h test.mosquitto.org -t "Jyo/data" -m '{"engineSpeed":100,"batteryVolt":1500,"oilPressure":80}'
```

Dashboard should instantly show these values!

### **Test 3: Use Python Test Publisher**

```bash
python test_mqtt_publisher.py
```

Watch the dashboard update in real-time!

---

## 🐛 Troubleshooting

### **Dashboard Shows "Disconnected"**

**Check:**
1. Is MQTT broker running?
   ```bash
   # For local broker
   mosquitto -v
   ```

2. Is WebSocket enabled?
   - Public: `test.mosquitto.org:8080` ✅ (always enabled)
   - Local: Check mosquitto.conf has `listener 9001` + `protocol websockets`

3. Check browser console (F12) for errors

4. Firewall blocking WebSocket?
   - Allow port 9001 (local) or 8080 (public)

---

### **No Data Appearing**

**Check:**
1. Is your C2000/publisher sending data?
   ```bash
   # Monitor the topic
   mosquitto_sub -h test.mosquitto.org -t "Jyo/data"
   ```

2. Is the topic name correct?
   - Dashboard expects: `Jyo/data`
   - Check your publisher uses same topic

3. Is the data format JSON?
   - Must be valid JSON string
   - Use `JSON.stringify(data)` in publisher

---

### **CORS Errors**

Not an issue with MQTT! WebSocket doesn't have CORS restrictions.

If you see CORS errors, they're from something else (images, API calls, etc.)

---

### **Connection Drops**

**Solutions:**
1. Check network stability
2. Increase `keepalive` timeout:
   ```typescript
   options: {
     keepalive: 60,  // seconds
     // ...
   }
   ```
3. Use local broker instead of public (more reliable)

---

## 📈 Performance

- **Latency:** < 100ms (local), < 500ms (public)
- **Update Rate:** As fast as data arrives (no polling delay!)
- **Connection:** WebSocket (persistent, low overhead)
- **Auto-reconnect:** 1 second intervals

---

## 🔐 Security Notes

### **Current Setup (Development)**
⚠️ No authentication  
⚠️ Unencrypted WebSocket (ws://)  
⚠️ Public broker (anyone can read your data)

### **For Production**
✅ Use local broker with authentication  
✅ Use WSS (encrypted WebSocket)  
✅ Set up firewall rules  
✅ Use VPN for remote access  

---

## 🎉 Comparison: Node-RED vs Direct

| Feature | Node-RED Method | Direct MQTT |
|---------|----------------|-------------|
| Setup Complexity | High (3 components) | Low (1 component) |
| Real-time | Polling (1 second) | Instant (WebSocket) |
| Dependencies | Node-RED + Mosquitto | Mosquitto only |
| Latency | 0.5-1.5 seconds | < 100ms |
| Reliability | Medium | High |
| **Recommended** | ❌ | ✅ |

---

## 🚀 Quick Start Summary

### **For Testing (Easiest)**
```bash
# 1. Run dashboard
npm run dev

# 2. Publish data to test.mosquitto.org:1883 topic "Jyo/data"
python test_mqtt_publisher.py

# Done! Dashboard shows live data ✅
```

### **For Production (Recommended)**
```bash
# 1. Install Mosquitto with WebSocket support
sudo apt-get install mosquitto

# 2. Configure WebSocket listener (port 9001)
# Edit mosquitto.conf

# 3. Update dashboard config to ws://localhost:9001

# 4. Run dashboard
npm run dev

# 5. Publish data to localhost:1883 topic "Jyo/data"
# Done! ✅
```

---

## 📞 Need Help?

**Check console logs:**
- Open browser console (F12)
- Look for MQTT connection messages
- Green checkmarks ✅ = working
- Red X ❌ = errors

**Common messages:**
```
🔌 Connecting to MQTT broker: ws://test.mosquitto.org:8080
✅ Connected to MQTT broker
📡 Subscribed to topic: Jyo/data
📩 Received: {"engineSpeed": 75, ...}
```

---

## 🎯 What's Next?

1. ✅ **You're Done!** The dashboard is ready to use
2. Start your C2000 publisher
3. Watch the live data flow!

**No Node-RED needed. No HTTP polling. Pure real-time MQTT! 🚀**

---

*Last Updated: February 25, 2026*
