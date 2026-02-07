# 📝 Git Deployment Quick Reference

Quick reference for pushing code to GitHub and deploying to VPS.

## 🚀 Initial Push to GitHub

If this is your first time pushing to the repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Alphabyte Protean Project"

# Set main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/VipulPhatangare/pip.git

# Push to GitHub
git push -u origin main
```

## 🔄 Regular Updates

After making changes to your code:

```bash
# Check what files have changed
git status

# Add specific files
git add filename.js

# Or add all changes
git add .

# Commit with a descriptive message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

## 📋 Common Git Commands

```bash
# View commit history
git log --oneline

# View remote repository
git remote -v

# Pull latest changes from GitHub
git pull origin main

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View all branches
git branch -a

# Delete a branch
git branch -d feature-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard
```

## 🌐 Deploy to VPS After Push

After pushing to GitHub, deploy on your VPS:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Run deployment script
cd /var/www/alphabyte
./deploy.sh
```

Or manually:
```bash
cd /var/www/alphabyte
git pull origin main
cd brain-server && npm install --production
cd ../client-site && npm install && npm run build
cd ../dashboard && npm install && npm run build
pm2 restart alphabyte-brain-server
sudo nginx -t && sudo systemctl reload nginx
```

## 🔐 GitHub Authentication

If asked for credentials, use:
- **Username:** VipulPhatangare
- **Password:** Use Personal Access Token (not your GitHub password)

### Generate Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Save the token securely

## 📝 Commit Message Best Practices

```bash
# Feature addition
git commit -m "Add user authentication feature"

# Bug fix
git commit -m "Fix: Resolve login redirect issue"

# Update/Improve
git commit -m "Update: Improve dashboard loading performance"

# Style changes
git commit -m "Style: Refactor CSS for mobile responsiveness"

# Documentation
git commit -m "Docs: Update deployment guide"
```

## 🚨 Emergency Rollback

If something breaks after deployment:

```bash
# On VPS
cd /var/www/alphabyte

# Check commit history
git log --oneline

# Rollback to previous commit
git reset --hard <commit-hash>

# Rebuild and restart
./deploy.sh
```

## 📦 .env Files (Never Commit!)

Your `.env` files are ignored by git (in `.gitignore`). When deploying:

1. ✅ `.env.example` - Committed to GitHub
2. ❌ `.env` - NEVER commit (contains secrets)

On VPS, manually create `.env` files based on `.env.example`.

## 🔍 Check What Will Be Committed

```bash
# See changes
git diff

# See staged changes
git diff --staged

# Dry-run - see what would be committed
git status
```

## 🎯 Workflow Summary

**Local Development → GitHub → VPS Deployment**

1. Make changes locally
2. Test locally: `npm run dev`
3. Commit: `git add . && git commit -m "message"`
4. Push: `git push origin main`
5. SSH to VPS: `ssh root@your-vps-ip`
6. Deploy: `cd /var/www/alphabyte && ./deploy.sh`
7. Verify: Visit https://pip.vipulphatangare.site

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
