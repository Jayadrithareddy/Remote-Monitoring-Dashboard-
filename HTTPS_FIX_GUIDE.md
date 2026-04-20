# 🔒 HTTPS WebSocket Fix

## ✅ Issue Resolved

**Error:** `SecurityError: Failed to construct 'WebSocket': An insecure WebSocket connection may not be initiated from a page loaded over HTTPS.`

**Cause:** Browsers block insecure WebSocket (`ws://`) connections from HTTPS pages for security.

**Solution:** Dashboard now auto-detects the page protocol and uses the appropriate WebSocket:
- HTTP page → `ws://` (insecure WebSocket)
- HTTPS page → `wss://` (secure WebSocket)

---

## 🔧 What Was Changed

The LiveDataPanel component now automatically uses:

```typescript
// HTTP page
http://localhost:5173 → ws://test.mosquitto.org:8080

// HTTPS page  
https://yourdomain.com → wss://test.mosquitto.org:8081
```

**No manual configuration needed!** ✅

---

## 🌐 Broker Ports

### **Public Broker (test.mosquitto.org)**

| Protocol | Port | When Used |
|----------|------|-----------|
| WebSocket (ws://) | 8080 | HTTP pages |
| WebSocket Secure (wss://) | 8081 | HTTPS pages |
| MQTT (standard) | 1883 | C2000 devices |
| MQTT Secure | 8883 | Production |

---

## 🏠 For Local Broker

If using local Mosquitto, configure both ports:

### **1. Edit mosquitto.conf**

```conf
# Standard MQTT (for C2000)
listener 1883
protocol mqtt

# WebSocket (for HTTP pages)
listener 9001
protocol websockets

# Secure WebSocket (for HTTPS pages)
listener 8081
protocol websockets
certfile /path/to/cert.pem
keyfile /path/to/key.pem
```

### **2. Generate SSL Certificate**

**Self-signed (testing only):**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout mosquitto.key -out mosquitto.crt
```

**Production (Let's Encrypt):**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### **3. Update Dashboard Config**

Edit `/src/app/components/LiveDataPanel.tsx`:

```typescript
const MQTT_CONFIG = {
  broker: typeof window !== 'undefined' && window.location.protocol === 'https:' 
    ? 'wss://yourdomain.com:8081'  // Your domain with SSL
    : 'ws://localhost:9001',         // Local without SSL
  topic: 'Jyo/data',
};
```

---

## ✅ Current Configuration

Dashboard is now configured to work with:

### **Development (HTTP)**
- Page: `http://localhost:5173`
- MQTT: `ws://test.mosquitto.org:8080`
- ✅ No SSL needed

### **Production (HTTPS)**
- Page: `https://yourdomain.com`
- MQTT: `wss://test.mosquitto.org:8081`
- ✅ SSL auto-enabled

---

## 🧪 Testing

### **Test HTTP Connection**
```bash
# Run dashboard in HTTP mode
npm run dev

# Should connect to: ws://test.mosquitto.org:8080
# Check console: "✅ Connected to MQTT broker"
```

### **Test HTTPS Connection**
```bash
# Deploy to HTTPS server
# Dashboard auto-switches to: wss://test.mosquitto.org:8081
# Check console: "✅ Connected to MQTT broker"
```

---

## 🔐 Security Notes

### **Development (HTTP)**
- ⚠️ Uses unencrypted WebSocket
- ⚠️ Data visible in network traffic
- ✅ Fine for local testing

### **Production (HTTPS)**
- ✅ Uses encrypted WebSocket (wss://)
- ✅ Data protected with TLS
- ✅ Required for security compliance

---

## 🐛 Troubleshooting

### **Still Getting SSL Error?**

**Check 1: Browser Console**
```javascript
// Open F12, run:
console.log(window.location.protocol);
// Should show: "http:" or "https:"
```

**Check 2: Force Protocol**
```typescript
// In LiveDataPanel.tsx, temporarily force:
broker: 'wss://test.mosquitto.org:8081',  // Always use secure
```

**Check 3: Clear Browser Cache**
```bash
Ctrl+Shift+Delete → Clear cache → Reload
```

---

### **Can't Connect to Secure Broker?**

**Test Secure WebSocket:**
```javascript
// Browser console (F12):
const ws = new WebSocket('wss://test.mosquitto.org:8081');
ws.onopen = () => console.log('✅ Secure WebSocket works!');
ws.onerror = (e) => console.log('❌ Error:', e);
```

**Common Issues:**
1. Firewall blocking port 8081
2. Broker doesn't support WSS
3. Certificate expired/invalid

---

### **Self-Signed Certificate Warning?**

Browsers block self-signed certs. Solutions:

**Option 1: Add Exception (Testing Only)**
1. Visit `https://localhost:8081` in browser
2. Click "Advanced" → "Proceed anyway"
3. Now dashboard can connect

**Option 2: Trust Certificate (Testing Only)**
```bash
# Chrome/Edge
chrome://flags/#allow-insecure-localhost → Enable

# Firefox
about:config → network.websocket.allowInsecureFromHTTPS → true
```

**Option 3: Use Let's Encrypt (Production)**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

---

## 📊 Protocol Decision Tree

```
Is page HTTPS?
    ├─ Yes → Use wss:// (secure WebSocket)
    │         Port: 8081
    │         Requires: SSL certificate
    │
    └─ No → Use ws:// (regular WebSocket)
              Port: 8080 (public) or 9001 (local)
              Requires: Nothing
```

---

## ✅ Summary

**Fixed:** Dashboard now works on both HTTP and HTTPS pages  
**How:** Auto-detects protocol and uses appropriate WebSocket  
**Result:** No more SecurityError! ✅

---

## 🚀 Ready to Use

Just run:
```bash
npm run dev
```

Dashboard will:
1. Detect if page is HTTP or HTTPS
2. Use appropriate WebSocket (ws:// or wss://)
3. Connect automatically
4. Show 🟢 Connected when ready

**No extra configuration needed!** 🎉

---

*Last Updated: February 25, 2026*
