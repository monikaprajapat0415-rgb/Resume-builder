#!/usr/bin/env bash
# Daily database backup. Run from cron:  0 2 * * * /var/www/app/backup.sh
set -euo pipefail
STAMP=$(date +%F)
DEST=/var/backups/app
mkdir -p "$DEST"
mongodump --uri "$MONGODB_URI" --archive="$DEST/db-$STAMP.gz" --gzip
find "$DEST" -name 'db-*.gz' -mtime +14 -delete        # keep 14 days
# Copy $DEST to another machine or a storage bucket too. A backup on the same disk is not enough.
# And TEST a restore now and then:  mongorestore --uri "$TEST_URI" --archive=... --gzip
