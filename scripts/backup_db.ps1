# PowerShell script to backup PostgreSQL database
# Save as backup_db.ps1 in the scripts directory
# Usage: .\scripts\backup_db.ps1

$ErrorActionPreference = 'Stop'

# Load environment variables from .env if present
$envFile = Join-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) '..\\server\\.env'
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)\s*$') {
      $key = $matches[1].Trim()
      $value = $matches[2].Trim()
      [System.Environment]::SetEnvironmentVariable($key, $value)
    }
  }
}

$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
  Write-Error "DATABASE_URL is not set. Cannot backup database."
}

# Parse the URL: postgresql://user:pass@host:port/dbname
if ($databaseUrl -match '^postgresql://([^:]+):([^@]+)@([^:/]+)(?::(\d+))?/(.+)$') {
  $user = $matches[1]
  $pass = $matches[2]
  $host = $matches[3]
  $port = if ($matches[4]) { $matches[4] } else { '5432' }
  $db   = $matches[5]
} else {
  Write-Error "Unable to parse DATABASE_URL"
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backup_${timestamp}.sql"
$backupPath = Join-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) $backupFile

$env:PGPASSWORD = $pass
$pgDump = "pg_dump"
# Ensure pg_dump is in PATH; otherwise, try common install locations
if (-not (Get-Command $pgDump -ErrorAction SilentlyContinue)) {
  $possible = @( "C:\\Program Files\\PostgreSQL\\13\\bin\\pg_dump.exe", "C:\\Program Files\\PostgreSQL\\14\\bin\\pg_dump.exe", "C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe" )
  foreach ($p in $possible) {
    if (Test-Path $p) { $pgDump = $p; break }
  }
}

& $pgDump -h $host -p $port -U $user -F p -b -v -f $backupPath $db
if ($LASTEXITCODE -eq 0) {
  Write-Host "Database backup saved to $backupPath"
} else {
  Write-Error "pg_dump failed with exit code $LASTEXITCODE"
}
