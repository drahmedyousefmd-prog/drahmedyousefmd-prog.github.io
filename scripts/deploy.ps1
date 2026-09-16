# Rochetta deploy script ??? GitHub Pages (user site at repo root).
#  1. runs `npm run build` (validate-data + icons + OG image + next build)
#  2. prunes static-export noise (*.txt RSC payloads) from out/
#  3. syncs out/ into the gh-pages working copy
#  4. commits and force-pushes the gh-pages branch
#
# Usage:
#   powershell -File scripts/deploy.ps1                 # full deploy
#   powershell -File scripts/deploy.ps1 -NoPush         # build + sync, no push
#   powershell -File scripts/deploy.ps1 -Dist "D:\site" # custom working copy

param(
  [string]$RepoRoot = (Join-Path $PSScriptRoot ".."),
  [string]$Dist = "C:\Users\hp\AppData\Local\Temp\opencode\rochetta-pages",
  [switch]$NoPush,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$out = Join-Path $RepoRoot "out"

if (-not $SkipBuild) {
  Write-Host "==> npm run build"
  Push-Location $RepoRoot
  cmd /c "npm run build"
  $code = $LASTEXITCODE
  Pop-Location
  if ($code -ne 0) { throw "next build failed with exit code $code" }
}

if (-not (Test-Path $out)) { throw "out/ not found ??? build first" }

Write-Host "==> pruning RSC .txt payloads and __next.* files from out/ (keeping robots.txt)"
Get-ChildItem -LiteralPath $out -Recurse -Force |
  Where-Object { ($_.Name -like "*.txt" -and $_.Name -ne "robots.txt") -or $_.Name -like "__next.*" } |
  ForEach-Object {
    try { $_.Attributes = "Normal" } catch {}
  }
Get-ChildItem -LiteralPath $out -Recurse -Force |
  Where-Object { ($_.Name -like "*.txt" -and $_.Name -ne "robots.txt") -or $_.Name -like "__next.*" } |
  Remove-Item -Recurse -Force

if (-not (Test-Path $Dist)) { throw "deploy working copy missing: $Dist" }
Write-Host "==> syncing out/ -> $Dist"
Get-ChildItem -LiteralPath $Dist -Force |
  Where-Object { $_.Name -notin @(".git", ".nojekyll") } |
  Remove-Item -Recurse -Force
Copy-Item -Path (Join-Path $out "*") -Destination $Dist -Recurse -Force

if (-not (Test-Path (Join-Path $Dist ".nojekyll"))) {
  New-Item -ItemType File -Path (Join-Path $Dist ".nojekyll") | Out-Null
}

$msg = "Deploy: " + (Get-Date -Format "yyyy-MM-dd HH:mm")

Push-Location $Dist
git add -A | Out-Null
git commit -m $msg | Out-Null
git log --oneline -1
if (-not $NoPush) {
  Write-Host "==> force-pushing gh-pages"
  git push -f origin gh-pages
}
Pop-Location
Write-Host "done."