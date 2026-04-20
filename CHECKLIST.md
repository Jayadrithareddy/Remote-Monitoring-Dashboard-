# ✅ Setup Checklist - Live MQTT Integration

## 📦 Pre-Installation

- [ ] Windows/Linux/Mac computer with admin access
- [ ] Python 3.7+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Internet connection (for cloud MQTT)

---

## 🔧 Installation Steps

### **1. Install MQTT Broker**

**Windows:**
- [ ] Download Mosquitto from https://mosquitto.org/download/
- [ ] Run installer (use default options)
- [ ] Verify: Open CMD, run `mosquitto -v`

**Linux/Mac:**
- [ ] Run: `sudo apt-get install mosquitto mosquitto-clients`
- [ ] Verify: `mosquitto -v`

---

### **2. Install Python Dependencies**

- [ ] Open terminal/command prompt
- [ ] Run: `pip install paho-mqtt`
- [ ] Verify: `pip list | grep paho-mqtt`

---

### **3. Install Node-RED (if not installed)**

- [ ] Run: `npm install -g node-red`
- [ ] Verify: `node-red --version`

---

## 🚀 Running the System

### **Terminal 1: Start Mosquitto**

- [ ] Open terminal/CMD
- [ ] Run: `mosquitto -v`
- [ ] Should see: "mosquitto version X.X.X running"
- [ ] **Keep this terminal open!**

---

### **Terminal 2: Run MQTT Bridge**

- [ ] Open NEW terminal
- [ ] Navigate to project folder: `cd /path/to/project`
- [ ] Run: `python mqtt_bridge_updated.py`
- [ ] Should see: "✅ Connected to local MQTT broker"
- [ ] Should see: "✅ Connected to test.mosquitto.org"
- [ ] **Keep this terminal open!**

---

### **Terminal 3: Test Publisher (Optional)**

- [ ] Open NEW terminal
- [ ] Navigate to project folder
- [ ] Run: `python test_mqtt_publisher.py`
- [ ] Should see: "📤 Published #0: Battery: 1500 mV..."
- [ ] **This simulates your C2000 device**

---

### **4. Configure Node-RED**

- [ ] Open browser: http://localhost:1880
- [ ] Click ☰ (hamburger menu) → Import
- [ ] Click "select a file to import"
- [ ] Choose `node-red-flow.json`
- [ ] Click "Import"
- [ ] Click "Deploy" (red button, top-right)
- [ ] Should see: "Successfully deployed"

---

### **5. Test Node-RED Endpoint**

- [ ] Open browser: http://localhost:1880/livedata
- [ ] Should see JSON like:
  ```json
  {
    "BatteryVoltage": 1500,
    "OilPressure": 94,
    "EngineSpeed": 39
  }
  ```
- [ ] **If you see this, Node-RED is working! ✅**

---

### **6. Start React Dashboard**

- [ ] Open NEW terminal
- [ ] Navigate to project folder
- [ ] Run: `npm run dev`
- [ ] Should see: "Local: http://localhost:5173"
- [ ] Open browser: http://localhost:5173

---

## ✅ Verification

### **Dashboard Checks**

- [ ] Dashboard loads without errors
- [ ] See "Live Equipment Monitoring (MQTT)" section
- [ ] Status shows: 🟢 **Connected**
- [ ] Timestamp shows current time
- [ ] 5 gauge cards visible (Battery, Oil, Speed, Temp, Fuel)
- [ ] Gauge values updating every second
- [ ] Progress bars animating
- [ ] Raw JSON data displayed at bottom

---

### **Data Flow Checks**

- [ ] C2000/Test Publisher → Shows "Published" messages
- [ ] MQTT Bridge → Shows "Received" and "Forwarded" messages
- [ ] Node-RED → Shows data in debug panel
- [ ] Dashboard → Shows same values as MQTT messages

---

## 🐛 Troubleshooting

### **If Dashboard Shows "Demo Mode" (🔴)**

- [ ] Check Terminal 1: Is Mosquitto running?
- [ ] Check Terminal 2: Is MQTT bridge running?
- [ ] Check Node-RED: Open http://localhost:1880
- [ ] Check endpoint: Open http://localhost:1880/livedata
- [ ] Check browser console (F12) for errors

---

### **If No Data Appears**

- [ ] Restart Mosquitto (Ctrl+C, then `mosquitto -v`)
- [ ] Restart MQTT bridge (Ctrl+C, then `python mqtt_bridge_updated.py`)
- [ ] Check Node-RED debug panel (bug icon on right)
- [ ] Run test publisher: `python test_mqtt_publisher.py`
- [ ] Check topic matches: "Jyo/data" everywhere

---

### **If Node-RED Won't Deploy**

- [ ] Check for red triangles on nodes
- [ ] Double-click each node, verify configuration
- [ ] Delete all nodes, reimport `node-red-flow.json`
- [ ] Restart Node-RED: Ctrl+C, then `node-red`

---

## 📊 System Status

| Component | Status | How to Check |
|-----------|--------|--------------|
| Mosquitto | ⬜ | Terminal shows "running" |
| MQTT Bridge | ⬜ | Terminal shows "Forwarding messages" |
| Node-RED | ⬜ | http://localhost:1880 loads |
| HTTP Endpoint | ⬜ | http://localhost:1880/livedata returns JSON |
| Dashboard | ⬜ | Shows 🟢 Connected |

✅ = Working  
❌ = Not Working  
⬜ = Not Checked

---

## 🎯 Success Criteria

**You're done when ALL these are true:**

1. ✅ Dashboard shows **🟢 Connected** (not Demo Mode)
2. ✅ "Last Update" timestamp shows **current time**
3. ✅ Gauge values are **changing** (not static)
4. ✅ Raw JSON data **matches** your MQTT messages
5. ✅ No errors in browser console (F12)
6. ✅ No errors in any terminal windows

---

## 📝 Daily Startup Order

To restart the system:

1. **Start Mosquitto** (`mosquitto -v`)
2. **Wait 5 seconds**
3. **Start MQTT Bridge** (`python mqtt_bridge_updated.py`)
4. **Wait 5 seconds**
5. **Start Node-RED** (`node-red`)
6. **Wait 10 seconds**
7. **Start Dashboard** (`npm run dev`)
8. **Open browser** (http://localhost:5173)

---

## 🛑 Daily Shutdown Order

To safely stop the system:

1. **Close browser**
2. **Stop Dashboard** (Ctrl+C in Terminal 4)
3. **Stop Node-RED** (Ctrl+C in Node-RED terminal)
4. **Stop MQTT Bridge** (Ctrl+C in Terminal 2)
5. **Stop Mosquitto** (Ctrl+C in Terminal 1)

---

## 📞 Quick Reference

| Need | Command | URL |
|------|---------|-----|
| Start Mosquitto | `mosquitto -v` | - |
| Start Bridge | `python mqtt_bridge_updated.py` | - |
| Start Test Pub | `python test_mqtt_publisher.py` | - |
| Start Node-RED | `node-red` | http://localhost:1880 |
| Test Endpoint | - | http://localhost:1880/livedata |
| Start Dashboard | `npm run dev` | http://localhost:5173 |

---

## 🎉 You're All Set!

Once all checkboxes are ✅, you have a **fully functional real-time MQTT dashboard**!

**Next:** See `README_MQTT_INTEGRATION.md` for customization options.

---

*Print this checklist and keep it handy for daily operations!*
