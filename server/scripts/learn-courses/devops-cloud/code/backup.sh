#!/usr/bin/env bash
# backup.sh - tar a folder into a dated file and keep only the newest N backups.
# Usage: ./backup.sh <source_dir> <backup_dir> [keep]
set -euo pipefail
SRC="${1:?source dir}"; DEST="${2:?backup dir}"; KEEP="${3:-7}"
[ -d "$SRC" ] || { echo "no such folder: $SRC" >&2; exit 2; }
mkdir -p "$DEST"
STAMP=$(date +%Y%m%d-%H%M%S)
FILE="$DEST/$(basename "$SRC")-$STAMP.tar.gz"
tar -czf "$FILE" -C "$(dirname "$SRC")" "$(basename "$SRC")"
echo "created $(basename "$FILE")"
# delete the oldest ones beyond $KEEP (names sort by date)
ls -1 "$DEST"/*.tar.gz | sort | head -n -"$KEEP" | while read -r old; do
  rm -- "$old"; echo "removed $(basename "$old")"
done
