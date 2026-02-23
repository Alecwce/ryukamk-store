param (
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "🚀 Humanizando Git..." -ForegroundColor Cyan

# Stage changes
Write-Host "Adding changes..." -ForegroundColor Gray
git add .

# Commit
Write-Host "Committing with message: $Message" -ForegroundColor Green
git commit -m "$Message"

# Push (optional check if remote exists)
$remote = git remote
if ($remote) {
    Write-Host "Pushing to origin..." -ForegroundColor Yellow
    git push
} else {
    Write-Host "No remote found, skipping push." -ForegroundColor Gray
}

Write-Host "✅ ¡Listo! Cambios guardados." -ForegroundColor Green
