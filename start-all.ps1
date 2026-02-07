# Start all three Protean systems at once

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  PROTEAN INTERFACE PROTOCOL LAUNCHER" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Function to start a process in a new window
function Start-ProcessInNewWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    Write-Host "Starting $Title..." -ForegroundColor Yellow
    
    $arguments = "-NoExit", "-Command", "cd '$WorkingDirectory'; Write-Host ''; Write-Host '$Title' -ForegroundColor Cyan; Write-Host ''; $Command"
    
    Start-Process powershell -ArgumentList $arguments
}

Write-Host "Starting all three systems..." -ForegroundColor Cyan
Write-Host ""

# Get the base directory
$baseDir = $PSScriptRoot

# Start Brain Server (Port 3001)
Write-Host "[1/3] Launching Brain Server..." -ForegroundColor Magenta
Start-ProcessInNewWindow `
    -Title "BRAIN SERVER (Port 3001)" `
    -Command "npm run dev" `
    -WorkingDirectory "$baseDir\brain-server"

Start-Sleep -Seconds 2

# Start Client Site (Port 5173)
Write-Host "[2/3] Launching Client Site..." -ForegroundColor Magenta
Start-ProcessInNewWindow `
    -Title "CLIENT SITE (Port 5173)" `
    -Command "npm run dev" `
    -WorkingDirectory "$baseDir\client-site"

Start-Sleep -Seconds 2

# Start Dashboard (Port 5174)
Write-Host "[3/3] Launching Dashboard..." -ForegroundColor Magenta
Start-ProcessInNewWindow `
    -Title "DASHBOARD (Port 5174)" `
    -Command "npm run dev" `
    -WorkingDirectory "$baseDir\dashboard"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  ALL SYSTEMS STARTED!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access the applications:" -ForegroundColor Yellow
Write-Host "  - Client Site:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Dashboard:    http://localhost:5174" -ForegroundColor Cyan
Write-Host "  - Brain Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close all terminal windows to stop all services." -ForegroundColor Gray
Write-Host ""
