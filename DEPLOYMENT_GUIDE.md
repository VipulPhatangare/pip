# 🚀 Deployment Guide - Alphabyte Protean Project

Complete guide to deploy the Alphabyte Protean project on Hostinger VPS using GitHub, Nginx, and PM2.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Server Setup](#initial-server-setup)
- [Domain Configuration](#domain-configuration)
- [Deploy Application](#deploy-application)
- [Post-Deployment](#post-deployment)
- [Maintenance & Updates](#maintenance--updates)

---

## 🔧 Prerequisites

Before starting, ensure you have:
- Hostinger VPS with Ubuntu 20.04/22.04
- Root or sudo access to VPS
- Two domains configured:
  - `pip.vipulphatangare.site` → Client Site
  - `pipadmin.vipulphatangare.site` → Dashboard + API
- GitHub account with repository access

---

## 🖥️ Initial Server Setup

### 1. Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### 2. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js (v18 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x.x
npm --version
```

### 4. Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 5. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### 6. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 7. Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8. Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3001/tcp  # Brain Server
sudo ufw enable
sudo ufw status
```

---

## 🌐 Domain Configuration

### Configure DNS Records in Hostinger

Go to your Hostinger DNS management and add these A records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | pip | Your_VPS_IP | 14400 |
| A | pipadmin | Your_VPS_IP | 14400 |

**Wait 15-30 minutes** for DNS propagation.

### Verify DNS Propagation

```bash
ping pip.vipulphatangare.site
ping pipadmin.vipulphatangare.site
```

---

## 📦 Deploy Application

### 1. Create Project Directory

```bash
sudo mkdir -p /var/www/alphabyte
sudo chown -R $USER:$USER /var/www/alphabyte
cd /var/www/alphabyte
```

### 2. Clone Repository from GitHub

```bash
git init
git remote add origin https://github.com/VipulPhatangare/pip.git
git pull origin main
```

Or if starting fresh:
```bash
cd /var/www
git clone https://github.com/VipulPhatangare/pip.git alphabyte
cd alphabyte
```

### 3. Configure Environment Variables

#### Brain Server (.env)
```bash
cd /var/www/alphabyte/brain-server
nano .env
```

Add:
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://pip.vipulphatangare.site,https://pipadmin.vipulphatangare.site
LOG_LEVEL=info
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_STRING_HERE
MONGODB_URI=mongodb://localhost:27017/alphabyte-protean
```

**IMPORTANT:** Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Client Site (.env)
```bash
cd /var/www/alphabyte/client-site
nano .env
```

Add:
```env
VITE_BRAIN_SERVER_URL=https://pipadmin.vipulphatangare.site/api
VITE_WS_URL=wss://pipadmin.vipulphatangare.site
```

#### Dashboard (.env)
```bash
cd /var/www/alphabyte/dashboard
nano .env
```

Add:
```env
VITE_BRAIN_SERVER_URL=https://pipadmin.vipulphatangare.site/api
VITE_WS_URL=wss://pipadmin.vipulphatangare.site
```

### 4. Install Dependencies and Build

#### Brain Server
```bash
cd /var/www/alphabyte/brain-server
npm install --production
```

#### Client Site
```bash
cd /var/www/alphabyte/client-site
npm install
npm run build
```

#### Dashboard
```bash
cd /var/www/alphabyte/dashboard
npm install
npm run build
```

### 5. Seed Database (Optional)

```bash
cd /var/www/alphabyte/brain-server
npm run seed
```

### 6. Setup PM2 for Brain Server

```bash
cd /var/www/alphabyte
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Copy and run the command that PM2 outputs.

Verify it's running:
```bash
pm2 status
pm2 logs alphabyte-brain-server
```

### 7. Configure Nginx

#### Copy Nginx configurations
```bash
sudo cp /var/www/alphabyte/nginx-client.conf /etc/nginx/sites-available/pip.vipulphatangare.site
sudo cp /var/www/alphabyte/nginx-dashboard.conf /etc/nginx/sites-available/pipadmin.vipulphatangare.site
```

#### Enable sites
```bash
sudo ln -s /etc/nginx/sites-available/pip.vipulphatangare.site /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/pipadmin.vipulphatangare.site /etc/nginx/sites-enabled/
```

#### Test Nginx configuration
```bash
sudo nginx -t
```

#### Reload Nginx
```bash
sudo systemctl reload nginx
```

### 8. Setup SSL Certificates with Let's Encrypt

```bash
# For client site
sudo certbot --nginx -d pip.vipulphatangare.site

# For dashboard
sudo certbot --nginx -d pipadmin.vipulphatangare.site
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended: 2)

### 9. Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

---

## ✅ Post-Deployment

### 1. Verify Deployments

Visit in your browser:
- **Client Site:** https://pip.vipulphatangare.site
- **Dashboard:** https://pipadmin.vipulphatangare.site

### 2. Check Logs

```bash
# PM2 logs
pm2 logs alphabyte-brain-server

# Nginx logs
sudo tail -f /var/log/nginx/pip-access.log
sudo tail -f /var/log/nginx/pipadmin-access.log
```

### 3. Monitor PM2 Status

```bash
pm2 status
pm2 monit
```

### 4. Create Directory for Logs

```bash
mkdir -p /var/www/alphabyte/logs
```

---

## 🔄 Maintenance & Updates

### Update Deployment (Pull Latest Code)

Use the automated deployment script:

```bash
cd /var/www/alphabyte
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
cd /var/www/alphabyte

# Pull latest code
git pull origin main

# Update brain-server
cd brain-server
npm install --production
pm2 restart alphabyte-brain-server

# Rebuild client-site
cd ../client-site
npm install
npm run build

# Rebuild dashboard
cd ../dashboard
npm install
npm run build

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx
```

### MongoDB Backup

```bash
# Create backup
mongodump --db alphabyte-protean --out /var/backups/mongodb/$(date +%Y%m%d)

# Restore backup
mongorestore --db alphabyte-protean /var/backups/mongodb/YYYYMMDD/alphabyte-protean
```

### PM2 Commands

```bash
pm2 status                           # Check status
pm2 logs alphabyte-brain-server      # View logs
pm2 restart alphabyte-brain-server   # Restart server
pm2 stop alphabyte-brain-server      # Stop server
pm2 start alphabyte-brain-server     # Start server
pm2 monit                            # Monitor processes
```

### Nginx Commands

```bash
sudo nginx -t                  # Test configuration
sudo systemctl reload nginx    # Reload nginx
sudo systemctl restart nginx   # Restart nginx
sudo systemctl status nginx    # Check status
```

---

## 🐛 Troubleshooting

### Issue: Can't connect to MongoDB

```bash
sudo systemctl status mongod
sudo systemctl restart mongod
sudo tail -f /var/log/mongodb/mongod.log
```

### Issue: PM2 process not starting

```bash
pm2 logs alphabyte-brain-server --lines 100
cd /var/www/alphabyte/brain-server
node server.js  # Test directly
```

### Issue: Nginx 502 Bad Gateway

```bash
# Check if brain-server is running
pm2 status
curl http://localhost:3001/api/health  # Test locally

# Check Nginx error logs
sudo tail -f /var/log/nginx/pipadmin-error.log
```

### Issue: SSL Certificate Problems

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Issue: CORS Errors

Check that `CORS_ORIGIN` in `/var/www/alphabyte/brain-server/.env` includes both domains:
```
CORS_ORIGIN=https://pip.vipulphatangare.site,https://pipadmin.vipulphatangare.site
```

---

## 📊 Monitoring

### Setup PM2 Web Dashboard (Optional)

```bash
pm2 install pm2-server-monit
```

### Check Resource Usage

```bash
htop
df -h          # Disk space
free -m        # Memory usage
pm2 monit      # PM2 monitoring
```

---

## 🔐 Security Checklist

- [x] SSL certificates installed
- [x] Firewall configured
- [x] Strong JWT_SECRET set
- [x] MongoDB secured (no external access)
- [x] Environment variables protected
- [x] Regular backups configured
- [ ] Consider setting up fail2ban
- [ ] Consider MongoDB authentication

---

## 📞 Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/`
3. MongoDB logs: `/var/log/mongodb/mongod.log`

---

**Deployment Date:** $(date)
**Version:** 1.0.0
