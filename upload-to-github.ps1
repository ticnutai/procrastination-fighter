# Upload to GitHub Script (PowerShell)

Write-Host "Preparing project for GitHub upload..." -ForegroundColor Cyan

# Check if remote exists
$remotes = git remote -v
if ($remotes -match "origin") {
    Write-Host "Git remote already exists" -ForegroundColor Green
    git remote -v
} else {
    Write-Host "Need to add remote manually:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/[USERNAME]/procrastination-fighter.git" -ForegroundColor White
    Write-Host ""
    Write-Host "Steps to upload:" -ForegroundColor Cyan
    Write-Host "1. Create new repository on GitHub named 'procrastination-fighter'" -ForegroundColor White
    Write-Host "2. Run: git remote add origin [REPO-URL]" -ForegroundColor White
    Write-Host "3. Run: git branch -M main" -ForegroundColor White
    Write-Host "4. Run: git push -u origin main" -ForegroundColor White
    Write-Host ""
}

# Add new files
Write-Host "Adding new files..." -ForegroundColor Cyan
git add .

# Check for changes
$changes = git diff --cached --name-only
if (-not $changes) {
    Write-Host "No new changes to upload" -ForegroundColor Blue
} else {
    Write-Host "Files to be updated:" -ForegroundColor Green
    $changes
    
    Write-Host "Creating commit..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Update: $timestamp"
}

Write-Host ""
Write-Host "Commands to upload to GitHub:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "To create new version:" -ForegroundColor Green
Write-Host "git tag -a v2.0.1 -m 'Version description'" -ForegroundColor White
Write-Host "git push origin v2.0.1" -ForegroundColor White
Write-Host ""
Write-Host "Project ready for upload!" -ForegroundColor Green

# Show project statistics
Write-Host ""
Write-Host "Project Statistics:" -ForegroundColor Cyan
$fileCount = (git ls-files).Count
$htmlFiles = (git ls-files "*.html").Count
$jsFiles = (git ls-files "*.js").Count
$jsonFiles = (git ls-files "*.json").Count

Write-Host "Total files: $fileCount" -ForegroundColor White
Write-Host "HTML files: $htmlFiles" -ForegroundColor White
Write-Host "JavaScript files: $jsFiles" -ForegroundColor White
Write-Host "JSON files: $jsonFiles" -ForegroundColor White
