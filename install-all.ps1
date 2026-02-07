# Install dependencies for all three systems

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  PROTEAN INSTALLER" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = $PSScriptRoot

Write-Host "Installing dependencies for all systems..." -ForegroundColor Yellow
Write-Host ""

# Install brain-server dependencies
Write-Host "[1/3] Installing Brain Server dependencies..." -ForegroundColor Magenta
Set-Location "$baseDir\brain-server"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install brain-server dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install client-site dependencies
Write-Host "[2/3] Installing Client Site dependencies..." -ForegroundColor Magenta
Set-Location "$baseDir\client-site"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install client-site dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dashboard dependencies
Write-Host "[3/3] Installing Dashboard dependencies..." -ForegroundColor Magenta
Set-Location "$baseDir\dashboard"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dashboard dependencies" -ForegroundColor Red
    exit 1
}

Set-Location $baseDir

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start all systems, run:" -ForegroundColor Yellow
Write-Host "  .\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
