#!/usr/bin/env bash
# sysinfo.sh - a small health report. Usage: ./sysinfo.sh [disk_warn_percent]
set -euo pipefail
WARN="${1:-80}"

echo "Host:    $(hostname)"
echo "Kernel:  $(uname -sr)"
echo "Uptime:  $(uptime -p 2>/dev/null || uptime)"
echo

echo "Memory (MB):"
free -m | awk 'NR==1 || /^Mem:/'
echo

echo "Disk usage of / :"
USED=$(df -P / | awk 'NR==2 {gsub("%","",$5); print $5}')
echo "  ${USED}% used"
if [ "$USED" -ge "$WARN" ]; then
  echo "  WARNING: more than ${WARN}% full"
  exit 1
fi
echo "  OK (below ${WARN}%)"
