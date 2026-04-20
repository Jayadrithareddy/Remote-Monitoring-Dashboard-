# 🚀 Modern HMI Dashboard - Live MQTT Integration

## 📋 Overview

This integration connects your **C2000 MQTT data stream** to the **Modern Industrial HMI Equipment Dashboard** with real-time monitoring capabilities.

---

## ✨ Features

✅ **Real-time Data Display** - Updates every 1 second  
✅ **Beautiful Gauges** - Industrial HMI-style visualization  
✅ **Live Connection Status** - Green dot when connected  
✅ **Automatic Reconnection** - Handles network interruptions  
✅ **Multiple Metrics** - Battery, Oil, Speed, Temperature, Fuel  
✅ **JSON Data Stream** - View raw MQTT messages  
✅ **Demo Mode** - Simulated data when Node-RED unavailable  

---

## 🏗️ Architecture

```
C2000 → Cloud MQTT → Python Bridge → Local MQTT → Node-RED → Dashboard
```

See `ARCHITECTURE_DIAGRAM.txt` for detailed visual flow.

---

## 📦 What's Included

### **Dashboard Components**
- `LiveDataPanel.tsx` - Main live data display component
- Pre-configured gauge cards for 5 metrics
- Connection status indicator
- Raw JSON data viewer

### **Scripts**
- `mqtt_bridge_updated.py` - Production MQTT bridge
- `test_mqtt_publisher.py` - Test data generator

### **Configuration**
- `node-red-flow.json` - Node-RED flow import
- `simple-node-red-setup.txt` - Manual setup guide

### **Documentation**
- `QUICK_START.md` - 5-minute setup guide
- `MQTT_SETUP_GUIDE.md` - Comprehensive setup
- `ARCHITECTURE_DIAGRAM.txt` - Visual architecture

---

## ⚡ Quick Start

### **Prerequisites**
```bash
# Install Mosquitto MQTT Broker
# Windows: https://mosquitto.org/download/
# Linux/Mac:
sudo apt-get install mosquitto

# Install Python MQTT library
pip install paho-mqtt
```

### **3 Steps to Live Data**

1. **Start Mosquitto**
   ```bash
   mosquitto -v
   ```

2. **Run MQTT Bridge**
   ```bash
   python mqtt_bridge_updated.py
   ```

3. **Configure Node-RED**
   - Import `node-red-flow.json` OR
   - Follow `simple-node-red-setup.txt`

**Done!** 🎉 Dashboard shows live data!

---

## 🎯 Testing Without C2000

Use the test publisher to simulate data:

```bash
python test_mqtt_publisher.py
```

This generates realistic sensor data every 2 seconds.

---

## 📊 Dashboard Location

The live data panel appears on the **Dashboard page**, below the equipment map section.

**Features visible:**
- 5 gauge cards (Battery, Oil, Speed, Temperature, Fuel)
- Progress bars with color-coded values
- Live update timestamp
- Connection status (🟢 Connected / 🔴 Demo Mode)
- Raw JSON data stream viewer

---

## 🔧 Configuration

### **MQTT Topics**
Default: `Jyo/data`

To change, edit:
- `mqtt_bridge_updated.py` → `TOPIC` variable
- Node-RED MQTT In node → Topic field
- Both must match!

### **Update Frequency**
Default: 1 second polling

To change, edit `LiveDataPanel.tsx`:
```typescript
const interval = setInterval(fetchLiveData, 1000); // milliseconds
```

### **Add Custom Metrics**

1. Modify your C2000 to send new fields:
   ```json
   {
     "CustomMetric": 123,
     ...
   }
   ```

2. Edit `LiveDataPanel.tsx`, add to `dataCards`:
   ```typescript
   {
     label: 'Custom Metric',
     value: liveData.CustomMetric || 0,
     unit: 'units',
     icon: Activity,
     color: '#10B981',
     min: 0,
     max: 200,
   }
   ```

---

## 🐛 Troubleshooting

### **Dashboard Shows "Demo Mode"**

**Check:**
1. Is Mosquitto running?
   ```bash
   mosquitto -v
   ```

2. Is Node-RED running?
   ```bash
   node-red
   ```

3. Test HTTP endpoint:
   ```
   http://localhost:1880/livedata
   ```
   Should return JSON data.

4. Check browser console (F12) for errors

---

### **No Data in Node-RED**

**Check:**
1. Is MQTT bridge running?
   ```bash
   python mqtt_bridge_updated.py
   ```

2. Is data being published?
   - Use test publisher to verify

3. Check Node-RED debug panel
   - Look for incoming messages

---

### **CORS Errors**

Add to Node-RED `settings.js`:
```javascript
httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
}
```

Restart Node-RED.

---

## 📈 Performance

- **Update Rate:** 1 second (configurable)
- **Latency:** < 500ms (local network)
- **Resource Usage:** Minimal (React polling)
- **Data Size:** ~200 bytes per message

---

## 🔐 Security Notes

**Current Setup (Development):**
- No authentication on MQTT
- HTTP endpoint is public
- Suitable for local testing only

**For Production:**
1. Enable MQTT username/password
2. Use MQTT over TLS (port 8883)
3. Secure Node-RED with authentication
4. Use HTTPS for dashboard
5. Add API key authentication

---

## 🎨 Customization

### **Change Gauge Colors**

Edit `LiveDataPanel.tsx`:
```typescript
{
  label: 'Battery Voltage',
  color: '#22C55E', // ← Change this
  ...
}
```

### **Change Gauge Ranges**

```typescript
{
  min: 0,    // ← Minimum value
  max: 2000, // ← Maximum value
  ...
}
```

### **Add Alerts**

```typescript
if (liveData.Temperature > 90) {
  // Show alert notification
  alert('High Temperature Warning!');
}
```

---

## 📁 File Structure

```
/
├── src/app/components/
│   └── LiveDataPanel.tsx          # Live data component
├── mqtt_bridge_updated.py          # Production MQTT bridge
├── test_mqtt_publisher.py          # Test data generator
├── node-red-flow.json              # Node-RED configuration
├── QUICK_START.md                  # Quick setup guide
├── MQTT_SETUP_GUIDE.md             # Detailed setup
├── ARCHITECTURE_DIAGRAM.txt        # Visual architecture
└── README_MQTT_INTEGRATION.md      # This file
```

---

## 🚦 Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟢 Connected | Receiving live data from Node-RED |
| 🔴 Demo Mode | Using simulated data (Node-RED unavailable) |
| ⚠️ Warning | Data outdated (no updates in 10 seconds) |

---

## 📞 Support

**Common Issues:**

1. **Port 1883 already in use**
   - Check if another MQTT broker is running
   - Change port in all configurations

2. **Connection refused**
   - Verify Mosquitto is running
   - Check firewall settings

3. **Data not updating**
   - Check Node-RED debug panel
   - Verify MQTT bridge is forwarding messages

---

## 🎓 Learning Resources

- **MQTT Basics:** https://mqtt.org/
- **Node-RED Docs:** https://nodered.org/docs/
- **Paho MQTT Python:** https://www.eclipse.org/paho/

---

## 🔄 Data Flow Summary

```
1. C2000 publishes → test.mosquitto.org
2. Python bridge subscribes → forwards to 127.0.0.1
3. Node-RED receives → stores in memory
4. Dashboard polls → displays in gauges
5. User sees real-time data! 🎉
```

---

## ✅ Verification Checklist

- [ ] Mosquitto running (`mosquitto -v`)
- [ ] MQTT bridge running (`python mqtt_bridge_updated.py`)
- [ ] Node-RED running (`http://localhost:1880`)
- [ ] HTTP endpoint works (`http://localhost:1880/livedata`)
- [ ] Dashboard shows 🟢 Connected
- [ ] Data updates every second
- [ ] All gauges show correct values

---

## 🎉 Success Criteria

You've successfully integrated when:

✅ Dashboard shows **🟢 Connected** status  
✅ Gauge values **update in real-time**  
✅ Timestamp shows **current time**  
✅ Raw JSON matches **your MQTT data**  
✅ No console errors in browser  

---

## 🚀 Next Steps

1. **Add Historical Data**
   - Store data in InfluxDB
   - Create trend charts

2. **Add Alerts**
   - Set thresholds
   - Send email notifications

3. **Mobile Dashboard**
   - Responsive design already included
   - Access from phone/tablet

4. **Multiple Devices**
   - Subscribe to multiple topics
   - Show in separate panels

---

**You're all set! Enjoy real-time equipment monitoring! ⚡**

*Questions? Check `MQTT_SETUP_GUIDE.md` for detailed troubleshooting.*
