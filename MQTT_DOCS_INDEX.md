# 📚 MQTT Integration Documentation Index

Welcome! This guide will help you integrate live MQTT data into your Modern HMI Equipment Dashboard.

---

## 🚀 Getting Started (Start Here!)

### **For Beginners:**
1. Read `QUICK_START.md` - **5-minute setup guide**
2. Follow `CHECKLIST.md` - **Step-by-step checklist**
3. Verify everything works

### **For Experienced Users:**
1. Review `ARCHITECTURE_DIAGRAM.txt` - **Understand the flow**
2. Import `node-red-flow.json` - **Quick Node-RED setup**
3. Run `mqtt_bridge_updated.py` - **Start forwarding data**

---

## 📖 Documentation Files

### **🎯 Quick References**

| File | Use When | Time |
|------|----------|------|
| `QUICK_START.md` | First time setup | 5 min |
| `CHECKLIST.md` | Daily operations | 2 min |
| `simple-node-red-setup.txt` | Manual Node-RED config | 10 min |

### **📘 Detailed Guides**

| File | Use When | Time |
|------|----------|------|
| `MQTT_SETUP_GUIDE.md` | Full setup instructions | 30 min |
| `README_MQTT_INTEGRATION.md` | Complete reference | 1 hour |
| `ARCHITECTURE_DIAGRAM.txt` | Understanding data flow | 15 min |

### **📊 Reference Documents**

| File | Use When |
|------|----------|
| `INTEGRATION_SUMMARY.md` | Overview of everything |
| `MQTT_DOCS_INDEX.md` | This file - navigation |

---

## 🛠️ Code Files

### **Dashboard Components**
```
/src/app/components/LiveDataPanel.tsx
```
The React component that displays live MQTT data in beautiful gauges.

**What it does:**
- Polls Node-RED HTTP endpoint every 1 second
- Displays 5 gauge cards (Battery, Oil, Speed, Temperature, Fuel)
- Shows connection status (🟢 Connected / 🔴 Demo Mode)
- Displays raw JSON data stream

**Customization:**
- Add new metrics
- Change colors
- Adjust update frequency
- Modify gauge ranges

---

### **Python Scripts**

#### **`mqtt_bridge_updated.py`** (Production)
Forwards MQTT data from cloud to local Node-RED.

**Usage:**
```bash
python mqtt_bridge_updated.py
```

**Features:**
- Connects to test.mosquitto.org
- Forwards to 127.0.0.1:1883
- Auto-reconnect
- Detailed logging

---

#### **`test_mqtt_publisher.py`** (Testing)
Simulates C2000 device for testing.

**Usage:**
```bash
python test_mqtt_publisher.py
```

**Features:**
- Generates realistic data
- Publishes every 2 seconds
- Easy to customize

---

### **Node-RED Configuration**

#### **`node-red-flow.json`**
Pre-configured Node-RED flow for MQTT → HTTP.

**How to use:**
1. Open Node-RED: http://localhost:1880
2. Menu → Import → Select file
3. Choose `node-red-flow.json`
4. Click Deploy

**What it includes:**
- MQTT Input (Jyo/data)
- Storage function
- HTTP endpoint (/livedata)
- Response handler

---

## 🎯 Quick Navigation

### **I want to...**

#### **...get started right now**
→ Read `QUICK_START.md`

#### **...understand how it works**
→ Read `ARCHITECTURE_DIAGRAM.txt`

#### **...follow a checklist**
→ Use `CHECKLIST.md`

#### **...configure Node-RED manually**
→ Follow `simple-node-red-setup.txt`

#### **...troubleshoot issues**
→ Check `MQTT_SETUP_GUIDE.md` (Troubleshooting section)

#### **...customize the dashboard**
→ Read `README_MQTT_INTEGRATION.md` (Customization section)

#### **...see all features**
→ Read `INTEGRATION_SUMMARY.md`

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Windows/Linux/Mac** computer
- [ ] **Python 3.7+** installed
- [ ] **Node.js 16+** installed
- [ ] **npm** installed
- [ ] **Internet connection** (for cloud MQTT)
- [ ] **Admin access** (to install software)

---

## 🔄 Typical Setup Flow

```
1. Install Prerequisites
   ↓
2. Install Mosquitto (MQTT Broker)
   ↓
3. Install Python library (paho-mqtt)
   ↓
4. Start Mosquitto
   ↓
5. Run MQTT Bridge
   ↓
6. Configure Node-RED
   ↓
7. Test HTTP Endpoint
   ↓
8. Start Dashboard
   ↓
9. Verify 🟢 Connected
   ↓
10. Success! 🎉
```

**Time Required:** 15-30 minutes (first time)

---

## 📊 System Architecture

```
C2000 Device (Laptop 1)
        ↓
Cloud MQTT (test.mosquitto.org)
        ↓
Python Bridge Script
        ↓
Local MQTT (127.0.0.1:1883)
        ↓
Node-RED (HTTP Endpoint)
        ↓
React Dashboard (Live Gauges)
```

For detailed diagram, see `ARCHITECTURE_DIAGRAM.txt`

---

## 🎨 What You'll See

When everything is working:

**Dashboard shows:**
- ⚡ Battery Voltage: 1500 mV (with green gauge)
- 💧 Oil Pressure: 94 bar (with blue gauge)
- ⚙️ Engine Speed: 39 RPM (with orange gauge)
- 🌡️ Temperature: 85°C (with red gauge)
- 💨 Fuel Level: 75% (with purple gauge)

**Plus:**
- 🟢 Connected status
- Last Update timestamp
- Raw JSON data viewer
- Smooth animations

---

## 🐛 Troubleshooting Quick Links

| Problem | Solution Document | Section |
|---------|------------------|---------|
| Dashboard shows "Demo Mode" | `MQTT_SETUP_GUIDE.md` | Troubleshooting |
| No data in Node-RED | `CHECKLIST.md` | Verification |
| CORS errors | `README_MQTT_INTEGRATION.md` | Security Notes |
| Python import errors | `QUICK_START.md` | Prerequisites |
| Port conflicts | `MQTT_SETUP_GUIDE.md` | Common Issues |

---

## 📞 Support Resources

### **Documentation Hierarchy**
```
QUICK_START.md (5 min)
    ↓
CHECKLIST.md (operations)
    ↓
MQTT_SETUP_GUIDE.md (detailed)
    ↓
README_MQTT_INTEGRATION.md (complete reference)
```

### **When to Use Each**

**Starting out?**  
→ `QUICK_START.md`

**Running daily?**  
→ `CHECKLIST.md`

**Having issues?**  
→ `MQTT_SETUP_GUIDE.md`

**Need full reference?**  
→ `README_MQTT_INTEGRATION.md`

**Want overview?**  
→ `INTEGRATION_SUMMARY.md`

---

## 🎯 Success Criteria

You're successful when:

✅ All terminals running without errors  
✅ Dashboard shows 🟢 Connected  
✅ Data updates every second  
✅ Gauges show correct values  
✅ Timestamp shows current time  
✅ No console errors  

---

## 🚀 Next Steps After Setup

1. **Verify everything works** (use CHECKLIST.md)
2. **Customize the dashboard** (README_MQTT_INTEGRATION.md)
3. **Add your own metrics** (LiveDataPanel.tsx)
4. **Set up alerts** (future enhancement)
5. **Add data logging** (future enhancement)

---

## 📁 Complete File Structure

```
/
├── 📄 QUICK_START.md              ← Start here!
├── 📄 CHECKLIST.md                ← Daily operations
├── 📄 MQTT_SETUP_GUIDE.md         ← Detailed setup
├── 📄 README_MQTT_INTEGRATION.md  ← Complete reference
├── 📄 INTEGRATION_SUMMARY.md      ← Overview
├── 📄 ARCHITECTURE_DIAGRAM.txt    ← Visual flow
├── 📄 simple-node-red-setup.txt   ← Manual Node-RED
├── 📄 MQTT_DOCS_INDEX.md          ← This file
│
├── 🐍 mqtt_bridge_updated.py      ← MQTT bridge
├── 🐍 test_mqtt_publisher.py      ← Test publisher
├── 🔧 node-red-flow.json          ← Node-RED config
│
└── src/app/components/
    └── ⚛️ LiveDataPanel.tsx       ← Dashboard component
```

---

## 💡 Pro Tips

1. **Print `CHECKLIST.md`** for daily reference
2. **Bookmark `MQTT_SETUP_GUIDE.md`** for troubleshooting
3. **Keep terminals organized** (name them)
4. **Test incrementally** (one step at a time)
5. **Save your Node-RED flows** regularly

---

## 📊 Documentation Statistics

| Metric | Count |
|--------|-------|
| Total Documentation Files | 8 |
| Code Files | 3 |
| Total Pages | ~50 |
| Total Words | ~15,000 |
| Setup Time | 15-30 min |
| Read Time | 2-3 hours (all docs) |

---

## 🎉 You're Ready!

Everything you need is here. Pick your starting point:

**Beginner?** → `QUICK_START.md`  
**Experienced?** → `ARCHITECTURE_DIAGRAM.txt`  
**Need checklist?** → `CHECKLIST.md`  
**Want everything?** → `README_MQTT_INTEGRATION.md`

---

**Good luck with your MQTT integration! 🚀**

*Last Updated: February 24, 2026*
