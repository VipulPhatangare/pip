# ✅ Pre-Deployment Checklist

Complete this checklist before pushing to GitHub and deploying to VPS.

## 📝 Local Setup

### 1. Environment Files
- [ ] Review `brain-server/.env.example`
- [ ] Review `client-site/.env.example`
- [ ] Review `dashboard/.env.example`
- [ ] Ensure actual `.env` files are in `.gitignore` ✅
- [ ] Generate secure JWT_SECRET for production

### 2. Configuration Files
- [ ] Review `ecosystem.config.js` (PM2 config)
- [ ] Review `nginx-client.conf` (client site nginx)
- [ ] Review `nginx-dashboard.conf` (dashboard nginx)
- [ ] Update domains if different from:
  - Client: `pip.vipulphatangare.site`
  - Dashboard: `pipadmin.vipulphatangare.site`

### 3. Code Review
- [ ] Test all three systems locally:
  ```powershell
  .\start-all.ps1
  ```
- [ ] Verify client connects to brain-server
- [ ] Verify dashboard connects to brain-server
- [ ] Verify WebSocket connections work
- [ ] Test tier transitions
- [ ] Test authentication
- [ ] Test all CRUD operations

### 4. Git Repository
- [ ] Initialize git (if not done):
  ```bash
  git init
  ```
- [ ] Check `.gitignore` is working:
  ```bash
  git status
  # Should NOT see .env files, node_modules, dist folders
  ```
- [ ] Add all files:
  ```bash
  git add .
  ```
- [ ] Create initial commit:
  ```bash
  git commit -m "Initial commit - Ready for deployment"
  ```
- [ ] Set main branch:
  ```bash
  git branch -M main
  ```
- [ ] Add remote:
  ```bash
  git remote add origin https://github.com/VipulPhatangare/pip.git
  ```
- [ ] Push to GitHub:
  ```bash
  git push -u origin main
  ```

## 🌐 VPS Preparation

### 1. VPS Access
- [ ] Have VPS credentials ready
- [ ] Can SSH into VPS:
  ```bash
  ssh root@your-vps-ip
  ```
- [ ] Have sudo/root access

### 2. Domain Setup (Hostinger DNS)
- [ ] Add A record: `pip` → VPS IP
- [ ] Add A record: `pipadmin` → VPS IP
- [ ] Wait 15-30 minutes for DNS propagation
- [ ] Verify DNS:
  ```bash
  ping pip.vipulphatangare.site
  ping pipadmin.vipulphatangare.site
  ```

### 3. Server Software (To be installed)
- [ ] Node.js v18+
- [ ] MongoDB
- [ ] PM2 (Process Manager)
- [ ] Nginx
- [ ] Certbot (for SSL)
- [ ] Git

## 🔐 Security Checklist

### Before Deployment
- [ ] Generated strong JWT_SECRET (64+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Reviewed CORS settings
- [ ] `.env` files in `.gitignore` ✅
- [ ] No sensitive data in code
- [ ] No hardcoded passwords or secrets

### On VPS
- [ ] Create `.env` files from `.env.example`
- [ ] Set strong JWT_SECRET (different from dev)
- [ ] Enable firewall (UFW)
- [ ] Keep MongoDB local (no external access)
- [ ] Use HTTPS only (SSL certificates)
- [ ] Enable fail2ban (optional but recommended)

## 📦 Deployment Steps (Summary)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed steps.

### On VPS:

1. **Install Dependencies**
   ```bash
   # Node.js, MongoDB, PM2, Nginx, Certbot, Git
   ```

2. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/VipulPhatangare/pip.git alphabyte
   cd alphabyte
   ```

3. **Setup Environment Variables**
   ```bash
   # Create .env files in:
   # - brain-server/.env
   # - client-site/.env
   # - dashboard/.env
   ```

4. **Install & Build**
   ```bash
   cd brain-server && npm install --production
   cd ../client-site && npm install && npm run build
   cd ../dashboard && npm install && npm run build
   ```

5. **Configure Nginx**
   ```bash
   sudo cp nginx-*.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/* /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Setup SSL**
   ```bash
   sudo certbot --nginx -d pip.vipulphatangare.site
   sudo certbot --nginx -d pipadmin.vipulphatangare.site
   ```

7. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🧪 Post-Deployment Testing

### Test All Endpoints
- [ ] https://pip.vipulphatangare.site (client site)
- [ ] https://pipadmin.vipulphatangare.site (dashboard)
- [ ] https://pipadmin.vipulphatangare.site/api/health (API health)
- [ ] WebSocket connections working
- [ ] SSL certificates valid
- [ ] HTTP → HTTPS redirects working

### Verify Functionality
- [ ] User can signup/login
- [ ] Properties display correctly
- [ ] Tier transitions work
- [ ] Dashboard shows real-time data
- [ ] Mobile responsiveness
- [ ] All CRUD operations work

### Check Logs
- [ ] PM2 logs clean: `pm2 logs`
- [ ] Nginx access logs: `/var/log/nginx/pip-access.log`
- [ ] No errors in browser console

## 📊 Monitoring Setup

- [ ] PM2 status dashboard: `pm2 monit`
- [ ] Setup log rotation
- [ ] Configure MongoDB backups
- [ ] Monitor disk space: `df -h`
- [ ] Monitor memory: `free -m`

## 🔄 Future Updates

When you make changes:

1. **Local:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **VPS:**
   ```bash
   ssh root@your-vps-ip
   cd /var/www/alphabyte
   ./deploy.sh
   ```

## 📚 Documentation Reference

- **Complete Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Git Workflow:** [GIT_REFERENCE.md](GIT_REFERENCE.md)
- **Quick Summary:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- **Project Overview:** [README.md](README.md)

## 🆘 Troubleshooting Resources

If something goes wrong:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) troubleshooting section
2. PM2 logs: `pm2 logs alphabyte-brain-server`
3. Nginx logs: `sudo tail -f /var/log/nginx/*-error.log`
4. MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
5. Test locally first: `curl http://localhost:3001/api/health`

---

## ✨ Ready to Deploy?

Once all checkboxes are checked:

1. ✅ All local tests pass
2. ✅ Code pushed to GitHub
3. ✅ DNS configured
4. ✅ VPS accessible

**→ Proceed to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

Good luck! 🚀
