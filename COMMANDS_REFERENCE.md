# 🚀 Quick Command Reference

Fast reference for common deployment and maintenance commands.

## 📦 Initial Git Push

```bash
git init
git add .
git commit -m "Initial commit - Alphabyte Protean Project"
git branch -M main
git remote add origin https://github.com/VipulPhatangare/pip.git
git push -u origin main
```

## 🔄 Regular Updates

```bash
# Local machine
git add .
git commit -m "Your change description"
git push origin main

# VPS
ssh root@your-vps-ip
cd /var/www/alphabyte
./deploy.sh
```

## 🖥️ VPS Quick Commands

### SSH Connect
```bash
ssh root@your-vps-ip
```

### Check Status
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod
df -h              # Disk space
free -m            # Memory
```

### View Logs
```bash
pm2 logs alphabyte-brain-server
sudo tail -f /var/log/nginx/pip-access.log
sudo tail -f /var/log/nginx/pipadmin-access.log
sudo tail -f /var/log/nginx/pip-error.log
```

### Restart Services
```bash
pm2 restart alphabyte-brain-server
sudo systemctl reload nginx
sudo systemctl restart mongod
```

### Manual Deployment
```bash
cd /var/www/alphabyte
git pull origin main
cd brain-server && npm install --production && cd ..
cd client-site && npm install && npm run build && cd ..
cd dashboard && npm install && npm run build && cd ..
pm2 restart alphabyte-brain-server
sudo nginx -t && sudo systemctl reload nginx
```

## 🔐 SSL Certificate Management

```bash
# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check certificate expiry
sudo certbot certificates
```

## 📊 PM2 Commands

```bash
pm2 status                          # View all processes
pm2 logs alphabyte-brain-server     # View logs
pm2 restart alphabyte-brain-server  # Restart process
pm2 stop alphabyte-brain-server     # Stop process
pm2 start alphabyte-brain-server    # Start process
pm2 delete alphabyte-brain-server   # Delete process
pm2 monit                           # Real-time monitoring
pm2 save                            # Save process list
pm2 startup                         # Enable on boot
```

## 🔧 Nginx Commands

```bash
sudo nginx -t                     # Test configuration
sudo systemctl reload nginx       # Reload (no downtime)
sudo systemctl restart nginx      # Restart nginx
sudo systemctl status nginx       # Check status
sudo vim /etc/nginx/sites-available/pip.vipulphatangare.site
```

## 💾 MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# Inside mongosh:
use alphabyte-protean             # Switch to database
db.users.find()                   # View users
db.properties.find()              # View properties
show collections                  # List all collections
exit                              # Exit mongosh

# Backup
mongodump --db alphabyte-protean --out /var/backups/mongodb/$(date +%Y%m%d)

# Restore
mongorestore --db alphabyte-protean /var/backups/mongodb/YYYYMMDD/alphabyte-protean
```

## 🐛 Debugging

```bash
# Test API locally on VPS
curl http://localhost:3001/api/health

# Test with headers
curl -H "Content-Type: application/json" http://localhost:3001/api/health

# Check if port is listening
sudo netstat -tulpn | grep 3001

# Check DNS
ping pip.vipulphatangare.site
nslookup pip.vipulphatangare.site

# Check firewall
sudo ufw status
```

## 📁 File Locations on VPS

```bash
# Project
/var/www/alphabyte/

# Environment files
/var/www/alphabyte/brain-server/.env
/var/www/alphabyte/client-site/.env
/var/www/alphabyte/dashboard/.env

# Nginx configs
/etc/nginx/sites-available/pip.vipulphatangare.site
/etc/nginx/sites-available/pipadmin.vipulphatangare.site

# Nginx logs
/var/log/nginx/pip-access.log
/var/log/nginx/pip-error.log
/var/log/nginx/pipadmin-access.log
/var/log/nginx/pipadmin-error.log

# PM2 logs
~/.pm2/logs/

# SSL certificates
/etc/letsencrypt/live/pip.vipulphatangare.site/
/etc/letsencrypt/live/pipadmin.vipulphatangare.site/
```

## 🔑 Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or on Linux/Mac
openssl rand -hex 64
```

## 📝 Edit Files on VPS

```bash
# Edit environment
nano /var/www/alphabyte/brain-server/.env

# Edit nginx config
sudo nano /etc/nginx/sites-available/pip.vipulphatangare.site

# Edit PM2 config
nano /var/www/alphabyte/ecosystem.config.js
```

## 🔄 Reset Everything (Danger!)

```bash
# On VPS - Complete reset
cd /var/www/alphabyte
pm2 delete alphabyte-brain-server
rm -rf node_modules
rm -rf client-site/node_modules client-site/dist
rm -rf dashboard/node_modules dashboard/dist
rm -rf brain-server/node_modules

# Then reinstall
git pull origin main
# Follow deployment steps again
```

## 🌐 URLs

- **Client Site:** https://pip.vipulphatangare.site
- **Dashboard:** https://pipadmin.vipulphatangare.site
- **API Health:** https://pipadmin.vipulphatangare.site/api/health
- **GitHub Repo:** https://github.com/VipulPhatangare/pip

## 📚 Documentation

- **Complete Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Pre-Deploy Checklist:** [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
- **Git Reference:** [GIT_REFERENCE.md](GIT_REFERENCE.md)

---

**Bookmark this file for quick reference!** 📌
