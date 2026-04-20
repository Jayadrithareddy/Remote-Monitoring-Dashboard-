# 🔧 WebSocket MQTT Configuration

## Important: WebSocket vs Standard MQTT

Your dashboard uses **WebSocket** to connect to MQTT from the browser.

### Port Differences

| Protocol | Port | Used By |
|----------|------|---------|
| MQTT (TCP) | 1883 | C2000, Python scripts |
| WebSocket | 8080 (public) / 9001 (local) | Browser dashboard |

**Both connect to the SAME broker, just different protocols!**

---

## ✅ Default Configuration (Works Out of Box)

The dashboard is pre-configured to use:

```typescript
broker: 'ws://test.mosquitto.org:8080'
topic: 'Jyo/data'
```

**Your C2000 should publish to:**
```
Broker: test.mosquitto.org:1883  (Note: different port!)
Topic: Jyo/data                   (Same topic!)
```

**Both will see each other's messages!** ✅

---

## 🏠 For Local Mosquitto Broker

If you want to use local broker instead of public:

### 1. Configure Mosquitto for WebSocket

Create/edit `/etc/mosquitto/mosquitto.conf` (Linux) or `C:\Program Files\mosquitto\mosquitto.conf` (Windows):

```conf
# Standard MQTT (for C2000, Python scripts)
listener 1883
protocol mqtt

# WebSocket (for browser dashboard)
listener 9001
protocol websockets

# Allow anonymous (for testing)
allow_anonymous true
```

### 2. Restart Mosquitto

**Linux:**
```bash
sudo systemctl restart mosquitto
sudo systemctl status mosquitto
```

**Windows:**
```cmd
net stop mosquitto
net start mosquitto
```

**Mac:**
```bash
brew services restart mosquitto
```

### 3. Update Dashboard Config

Edit `/src/app/components/LiveDataPanel.tsx`:

Find this section:
```typescript
const MQTT_CONFIG = {
  broker: 'ws://test.mosquitto.org:8080',  // ← Change this
  topic: 'Jyo/data',
  // ...
};
```

Change to:
```typescript
const MQTT_CONFIG = {
  broker: 'ws://localhost:9001',  // ← Local WebSocket
  topic: 'Jyo/data',
  // ...
};
```

### 4. Test It

**Terminal 1: Publish**
```bash
mosquitto_pub -h localhost -t "Jyo/data" -m '{"engineSpeed":100,"batteryVolt":1500,"oilPressure":80}'
```

**Terminal 2: Monitor**
```bash
mosquitto_sub -h localhost -t "Jyo/data"
```

**Browser: Dashboard**
Should show the values instantly!

---

## 🌐 Network Configuration

### Same Computer (Localhost)
```
C2000/Publisher → localhost:1883
Dashboard → ws://localhost:9001
```

### Different Computers (LAN)
```
C2000/Publisher → 192.168.1.100:1883
Dashboard → ws://192.168.1.100:9001
```

Update dashboard config with actual IP address:
```typescript
broker: 'ws://192.168.1.100:9001'
```

### Remote (Internet)
Use public broker:
```
C2000/Publisher → test.mosquitto.org:1883
Dashboard → ws://test.mosquitto.org:8080
```

Or set up your own with SSL:
```
C2000/Publisher → your-domain.com:8883 (MQTT over TLS)
Dashboard → wss://your-domain.com:8081 (WebSocket Secure)
```

---

## 🔐 Add Authentication

### 1. Create Password File

```bash
# Create password for user
sudo mosquitto_passwd -c /etc/mosquitto/passwd dashboard_user
# Enter password when prompted
```

### 2. Update mosquitto.conf

```conf
listener 9001
protocol websockets

# Require authentication
allow_anonymous false
password_file /etc/mosquitto/passwd
```

### 3. Restart Mosquitto

```bash
sudo systemctl restart mosquitto
```

### 4. Update Dashboard Config

```typescript
const MQTT_CONFIG = {
  broker: 'ws://localhost:9001',
  topic: 'Jyo/data',
  options: {
    username: 'dashboard_user',  // ← Add username
    password: 'your_password',    // ← Add password
    clientId: `mqtt_dashboard_${Math.random().toString(16).slice(3)}`,
    clean: true,
  }
};
```

---

## 🔒 Use Secure WebSocket (WSS)

For production, use encrypted WebSocket:

### 1. Get SSL Certificate

Use Let's Encrypt or self-signed:
```bash
# Self-signed (testing only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout mosquitto.key -out mosquitto.crt
```

### 2. Configure mosquitto.conf

```conf
listener 8081
protocol websockets
certfile /path/to/mosquitto.crt
keyfile /path/to/mosquitto.key
```

### 3. Update Dashboard

```typescript
broker: 'wss://your-domain.com:8081'  // Note: wss:// not ws://
```

---

## 🐛 Troubleshooting

### Connection Refused

**Check if WebSocket listener is enabled:**
```bash
# Linux/Mac
netstat -an | grep 9001

# Windows
netstat -an | findstr 9001
```

Should show: `LISTEN` on port 9001

**If not listening:**
- Check mosquitto.conf has WebSocket listener
- Restart mosquitto
- Check firewall

### Connection Timeout

**Test WebSocket directly:**

Open browser console (F12) and run:
```javascript
const ws = new WebSocket('ws://localhost:9001');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.log('❌ Error:', e);
```

### Firewall Blocking

**Allow WebSocket port:**

**Linux:**
```bash
sudo ufw allow 9001/tcp
```

**Windows:**
```cmd
netsh advfirewall firewall add rule name="MQTT WebSocket" dir=in action=allow protocol=TCP localport=9001
```

### CORS Errors

WebSocket doesn't have CORS! If you see CORS errors, they're from something else.

### Authentication Failed

**Check credentials:**
```bash
# Test with mosquitto_pub
mosquitto_pub -h localhost -p 1883 -u dashboard_user -P your_password -t "test" -m "hello"
```

If this works, credentials are correct.

---

## 📊 Port Summary

| Service | Protocol | Port | Used By |
|---------|----------|------|---------|
| MQTT Standard | TCP | 1883 | C2000, Python |
| MQTT Secure | TCP | 8883 | Production |
| WebSocket | WS | 9001 | Dashboard |
| WebSocket Secure | WSS | 8081 | Production |
| Public WS | WS | 8080 | test.mosquitto.org |

---

## ✅ Verification Steps

### 1. Check Mosquitto Running
```bash
ps aux | grep mosquitto
```

### 2. Check Ports Open
```bash
netstat -an | grep -E "1883|9001"
```

### 3. Test Standard MQTT
```bash
mosquitto_pub -h localhost -t "test" -m "hello"
mosquitto_sub -h localhost -t "test"
```

### 4. Test WebSocket
Browser console:
```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('ws://localhost:9001');
client.on('connect', () => console.log('✅ WebSocket works!'));
```

### 5. Dashboard Connect
- Open http://localhost:5173
- Check for 🟢 Connected
- Look at browser console for MQTT logs

---

## 🎯 Quick Fix for Common Issues

### "Connection Refused"
→ Enable WebSocket listener in mosquitto.conf

### "Timeout"
→ Check firewall, allow port 9001

### "Not Authorized"
→ Use `allow_anonymous true` for testing

### "Can't resolve hostname"
→ Use IP address instead of hostname

### "Connection drops"
→ Increase keepalive in MQTT_CONFIG

---

## 📞 Still Not Working?

1. Check browser console (F12) for exact error
2. Check mosquitto logs:
   ```bash
   tail -f /var/log/mosquitto/mosquitto.log
   ```
3. Try public broker first (test.mosquitto.org:8080)
4. Test with MQTT Explorer tool
5. Verify data format matches exactly

---

**Most Common Solution:** Use public broker first, then move to local once working!

```typescript
// Start with this (no config needed):
broker: 'ws://test.mosquitto.org:8080'

// Then upgrade to local:
broker: 'ws://localhost:9001'
```

---

*For more help, see DIRECT_MQTT_SETUP.md*
