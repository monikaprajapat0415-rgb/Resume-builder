#!/usr/bin/env bash
# healthcheck.sh - is a TCP port open, and does a URL answer 200? Exit code 0 = healthy.
# Usage: ./healthcheck.sh <host> <port> [path]
set -uo pipefail
HOST="${1:?host}"; PORT="${2:?port}"; PATH_="${3:-/}"

if ! (exec 3<>"/dev/tcp/$HOST/$PORT") 2>/dev/null; then
  echo "FAIL: $HOST:$PORT is not accepting connections"; exit 1
fi
CODE=$(curl -s -o /dev/null -m 3 -w '%{http_code}' "http://$HOST:$PORT$PATH_" || true)
if [ "$CODE" = "200" ]; then
  echo "OK: $HOST:$PORT$PATH_ answered 200"; exit 0
fi
echo "FAIL: $HOST:$PORT$PATH_ answered ${CODE:-nothing}"; exit 1
