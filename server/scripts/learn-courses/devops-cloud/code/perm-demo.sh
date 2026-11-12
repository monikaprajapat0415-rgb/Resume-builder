#!/usr/bin/env bash
# perm-demo.sh - shows how chmod numbers map to rwx. Runs in a temporary folder.
set -euo pipefail
DIR=$(mktemp -d)
cd "$DIR"
touch notes.txt run.sh secret.key
mkdir shared

chmod 644 notes.txt      # owner read+write, everyone else read
chmod 755 run.sh         # owner all, everyone else read+execute
chmod 600 secret.key     # owner read+write, nobody else
chmod 770 shared         # owner and group all, others nothing

stat -c '%a  %A  %n' notes.txt run.sh secret.key shared
cd /
rm -rf "$DIR"
