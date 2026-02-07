#!/bin/bash

# Deployment script for Alphabyte Protean Project
# This script automates the deployment process on VPS

set -e  # Exit on any error

echo "🚀 Starting Alphabyte Deployment..."

# Variables
PROJECT_DIR="/var/www/alphabyte"
REPO_URL="https://github.com/VipulPhatangare/pip.git"
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
cd $PROJECT_DIR
git pull origin $BRANCH

# Step 2: Install/Update dependencies for brain-server
echo -e "${YELLOW}📦 Installing brain-server dependencies...${NC}"
cd $PROJECT_DIR/brain-server
npm install --production

# Step 3: Build client-site
echo -e "${YELLOW}🔨 Building client-site...${NC}"
cd $PROJECT_DIR/client-site
npm install
npm run build

# Step 4: Build dashboard
echo -e "${YELLOW}🔨 Building dashboard...${NC}"
cd $PROJECT_DIR/dashboard
npm install
npm run build

# Step 5: Restart PM2 processes
echo -e "${YELLOW}🔄 Restarting brain-server with PM2...${NC}"
cd $PROJECT_DIR
pm2 restart ecosystem.config.js

# Step 6: Reload nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "Client Site: https://pip.vipulphatangare.site"
echo "Dashboard: https://pipadmin.vipulphatangare.site"
