#!/usr/bin/env bash
# logwatch.sh - summarise a log file. Usage: ./logwatch.sh sample.log
set -euo pipefail
FILE="${1:?usage: logwatch.sh <logfile>}"
[ -r "$FILE" ] || { echo "cannot read $FILE" >&2; exit 2; }

echo "Lines by level:"
awk '{print $3}' "$FILE" | sort | uniq -c | sort -rn

echo
echo "Errors by service:"
grep ' ERROR ' "$FILE" | awk '{print $4}' | sort | uniq -c | sort -rn

echo
echo "Most common error text:"
grep ' ERROR ' "$FILE" | sed 's/^.*ERROR [a-z]* *//' | sort | uniq -c | sort -rn | head -3
