# VPS DEPLOYMENT TESTING GUIDE

## 🔍 COMPLETE SYSTEM CHECK

### 1️⃣ CHECK PM2 PROCESS STATUS
```bash
pm2 status
pm2 logs alphabyte-brain-server --lines 20
```
**EXPECTED:** 
- Status: `online`
- Restarts: `0` (or low number)
- No EADDRINUSE errors in logs

---

### 2️⃣ CHECK PORT 3001 IS LISTENING
```bash
sudo lsof -i:3001
sudo netstat -tlnp | grep 3001
```
**EXPECTED:** Should show Node.js process listening on port 3001

---

### 3️⃣ CHECK ENVIRONMENT VARIABLES
```bash
# Check .env files exist
ls -la /var/www/alphabyte/brain-server/.env
ls -la /var/www/alphabyte/client-site/.env
ls -la /var/www/alphabyte/dashboard/.env

# Verify CORS_ORIGIN is set
cat /var/www/alphabyte/brain-server/.env | grep CORS_ORIGIN
```
**EXPECTED:** 
```
CORS_ORIGIN=https://pip.vipulphatangare.site,https://pipadmin.vipulphatangare.site
```

---

### 4️⃣ CHECK BUILT FRONTEND FILES
```bash
# Check client-site build
ls -lh /var/www/alphabyte/client-site/dist/
ls -la /var/www/alphabyte/client-site/dist/index.html

# Check dashboard build
ls -lh /var/www/alphabyte/dashboard/dist/
ls -la /var/www/alphabyte/dashboard/dist/index.html

# Verify production URLs are in built files
grep -o "pipadmin.vipulphatangare.site" /var/www/alphabyte/client-site/dist/assets/*.js | head -5
```
**EXPECTED:** Should see index.html and assets folder, and production URLs in JS files

---

### 5️⃣ TEST API ENDPOINT DIRECTLY (LOCAL)
```bash
# Test from VPS itself
curl http://localhost:3001/api/health
```
**EXPECTED:** 
```json
{"status":"healthy","service":"Protean Brain Server","version":"1.0.0",...}
```

---

### 6️⃣ TEST API THROUGH NGINX (HTTPS)
```bash
curl -i https://pipadmin.vipulphatangare.site/api/health
```
**EXPECTED:** 
- HTTP Status: `200 OK`
- Should include: `Access-Control-Allow-Origin` header
- JSON response with "status":"healthy"

---

### 7️⃣ CHECK NGINX CONFIGURATION
```bash
# List nginx configs
ls -la /etc/nginx/sites-enabled/

# Test nginx syntax
sudo nginx -t

# Check nginx is running
sudo systemctl status nginx
```
**EXPECTED:** 
- Should see pip-temp.conf and pipadmin-temp.conf (or similar)
- nginx -t should say "syntax is ok"
- nginx status: active (running)

---

### 8️⃣ CHECK SSL CERTIFICATES
```bash
sudo certbot certificates
```
**EXPECTED:** Should show valid certificates for both domains

---

### 9️⃣ CHECK NGINX LOGS
```bash
# Check for errors
sudo tail -50 /var/log/nginx/pipadmin-error.log
sudo tail -50 /var/log/nginx/pip-error.log

# Check access logs
sudo tail -20 /var/log/nginx/pipadmin-access.log
sudo tail -20 /var/log/nginx/pip-access.log
```
**EXPECTED:** No critical errors

---

### 🔟 TEST WEBSOCKET CONNECTION (Advanced)
```bash
# Install websocat if not available (optional)
# Test WebSocket upgrade
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
  -H "Sec-WebSocket-Version: 13" \
  https://pipadmin.vipulphatangare.site/socket.io/
```
**EXPECTED:** Should see "101 Switching Protocols" or similar upgrade response

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: PM2 Process Keeps Restarting
```bash
pm2 stop alphabyte-brain-server
sudo lsof -ti:3001 | xargs sudo kill -9
sleep 2
pm2 delete alphabyte-brain-server
cd /var/www/alphabyte
pm2 start ecosystem.config.js
pm2 save
```

### Issue 2: CORS Errors
```bash
# Verify CORS_ORIGIN has both domains
cat /var/www/alphabyte/brain-server/.env | grep CORS_ORIGIN

# If not set or wrong, fix it:
echo "CORS_ORIGIN=https://pip.vipulphatangare.site,https://pipadmin.vipulphatangare.site" >> /var/www/alphabyte/brain-server/.env

# Restart with updated env
pm2 restart alphabyte-brain-server --update-env
```

### Issue 3: Frontend Not Showing Production URLs
```bash
# Rebuild with explicit env vars
cd /var/www/alphabyte/client-site
rm -rf dist
VITE_BRAIN_SERVER_URL=https://pipadmin.vipulphatangare.site/api \
VITE_WS_URL=wss://pipadmin.vipulphatangare.site \
npm run build

# Verify production URLs are in build
grep -o "pipadmin.vipulphatangare.site" dist/assets/*.js | head -5
```

### Issue 4: Nginx Not Serving Files
```bash
# Check nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check file permissions
ls -la /var/www/alphabyte/client-site/dist/
ls -la /var/www/alphabyte/dashboard/dist/

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/alphabyte/client-site/dist
sudo chown -R www-data:www-data /var/www/alphabyte/dashboard/dist
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] PM2 process online with 0 restarts
- [ ] Port 3001 listening
- [ ] CORS_ORIGIN set correctly in .env
- [ ] Built dist folders exist for client-site and dashboard
- [ ] Production URLs present in built JS files
- [ ] API health endpoint responds: `curl http://localhost:3001/api/health`
- [ ] API through nginx responds: `curl https://pipadmin.vipulphatangare.site/api/health`
- [ ] Nginx configs present and syntax valid
- [ ] SSL certificates valid
- [ ] No critical errors in nginx logs
- [ ] WebSocket upgrade supported

---

## 🧪 FINAL BROWSER TEST

After VPS checks pass:

1. **Clear browser cache completely** (Ctrl+Shift+Delete → All time)
2. **Visit:** https://pip.vipulphatangare.site
3. **Hard refresh:** Ctrl+Shift+R
4. **Open DevTools (F12):**
   - **Console:** No CORS errors
   - **Network > WS:** WebSocket connection should be "101 Switching Protocols"
   - **Network > Fetch/XHR:** API calls should return 200

5. **Test fetch in Console:**
```javascript
fetch('https://pipadmin.vipulphatangare.site/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "healthy", ...}`

---

## 📊 CURRENT STATUS ANALYSIS

### ✅ COMPLETED:
- VPS setup (Node.js, MongoDB, PM2, Nginx, Certbot)
- GitHub repository created and code pushed
- .env files created on VPS
- Nginx configurations created
- SSL certificates obtained
- PM2 process configured and running
- Socket.IO configuration updated

### ⚠️ NEEDS VERIFICATION:
- CORS headers being sent by brain server
- WebSocket proxy working through nginx
- Frontend built with correct production URLs
- Browser cache cleared

### 🔧 LIKELY ISSUE:
Based on your symptoms, one or more of these is happening:
1. **Browser cache** is still serving old files with localhost URLs
2. **CORS_ORIGIN** environment variable not being read by PM2
3. **WebSocket proxy** in nginx needs adjustment
4. **Frontend build** still has localhost URLs baked in

---

## 🎯 RECOMMENDED NEXT STEPS:

Run ALL the checks above in order, copy the output, and share any errors you see.
