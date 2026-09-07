#!/usr/bin/env bash
# Backup PostgreSQL database safely. Reads DATABASE_URL from server/.env.
# Do not expose credentials; the script reads env file locally.

set -euo pipefail

# Load .env variables (only DATABASE_URL)
if [[ -f "./server/.env" ]]; then
DATABASE_URL=$(grep '^DATABASE_URL=' ./server/.env | cut -d= -f2 | tr -d '\r')
export DATABASE_URL
else
  echo "Server .env not found. Exiting." >&2
  exit 1
fi

BACKUP_DIR="../backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILE="$BACKUP_DIR/ai_platform_backup_$TIMESTAMP.sql"

echo "Backing up database to $FILE"
pg_dump "$DATABASE_URL" > "$FILE"

echo "Backup completed."
