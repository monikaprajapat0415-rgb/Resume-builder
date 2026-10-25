// Lesson 36: accept one resume file per request, safely.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const here = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(here, '..', 'uploads');
export const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = { '.pdf': 'application/pdf', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Never use the name the client sent as a path. A random name cannot clash and cannot escape the folder.
  filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname).toLowerCase()),
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED[ext]) return cb(Object.assign(new Error('Only PDF, DOC or DOCX files are accepted'), { status: 400 }));
    cb(null, true);
  },
});

// The browser can lie about a file's type, so also look at the first bytes ("magic numbers") of what was saved.
export function looksLikeAllowedFile(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const head = Buffer.alloc(8);
  fs.readSync(fd, head, 0, 8, 0);
  fs.closeSync(fd);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') return head.subarray(0, 5).toString() === '%PDF-';
  if (ext === '.docx') return head[0] === 0x50 && head[1] === 0x4b; // "PK": a zip container
  if (ext === '.doc') return head[0] === 0xd0 && head[1] === 0xcf; // old Office container
  return false;
}

export const removeFile = (storedName) => {
  if (!/^[a-f0-9]{32}\.(pdf|doc|docx)$/.test(storedName || '')) return; // only ever delete names we made
  fs.rm(path.join(UPLOAD_DIR, storedName), { force: true }, () => {});
};
