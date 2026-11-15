Set-Location -LiteralPath $PSScriptRoot
$port = 8080

Write-Host ""
Write-Host "  Maatje" -ForegroundColor Cyan
Write-Host "  Op deze pc:   http://localhost:$port"
try {
  Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } |
    ForEach-Object { Write-Host "  Zelfde wifi:  http://$($_.IPAddress):$port" }
} catch {}
Write-Host ""
Write-Host "  Laat dit venster open zolang jullie spelen."
Write-Host "  Andere telefoons moeten op dezelfde wifi zitten."
Write-Host "  Vraagt Windows om toestemming, sta het toe op prive-netwerken."
Write-Host ""

if (Get-Command node -ErrorAction SilentlyContinue) {
  node (Join-Path $PSScriptRoot "server.js")
  exit
}
Write-Host "Node is nodig voor accounts en groepen."
if (Get-Command py -ErrorAction SilentlyContinue) {
  py -m http.server $port --bind 0.0.0.0
  exit
}
if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $port --bind 0.0.0.0
  exit
}

Write-Host "Geen Python of Node gevonden."
Write-Host "Op een telefoon spelen kan wel: open index.html."
Write-Host "Voor een code op meerdere telefoons heb je Python of Node nodig, of een gratis link (Netlify, GitHub Pages)."
