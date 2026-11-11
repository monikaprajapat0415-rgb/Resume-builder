#!/usr/bin/env bash
# Safe practice: everything happens inside one new folder.
set -e
mkdir -p demo && cd demo
pwd
echo "hello server" > a.txt
cp a.txt b.txt
ls -l
chmod 600 a.txt              # only the owner can read and write
ls -l a.txt
grep -n "hello" a.txt        # search inside a file
cat a.txt b.txt | wc -l      # a pipe sends the output of one command into the next
echo "second line" >> a.txt  # >> appends, > replaces
head -n 1 a.txt
cd .. && rm -r demo          # remove the folder when you are done
