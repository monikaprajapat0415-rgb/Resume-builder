import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_BYTES = 1024 * 1024;   // 1 MB
const ALLOWED = { 'image/png': '.png', 'image/jpeg': '.jpg', 'application/pdf': '.pdf' };

// Never trust the type the browser claims. Look at the first bytes of the file.
export function sniff(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (buffer.subarray(0, 5).toString('latin1') === '%PDF-') return 'application/pdf';
  return null;
}

// A storage "driver" has one job. Swap this one for Cloudinary or ImageKit later.
export function localStorageDriver(folder) {
  return {
    async save(buffer, extension) {
      const name = crypto.randomUUID() + extension;          // never use the original name
      await fs.writeFile(path.join(folder, name), buffer);
      return { name, url: `/files/${name}` };
    },
  };
}

export function createApp({ driver }) {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (req, file, cb) => cb(null, Boolean(ALLOWED[file.mimetype])),
  });

  app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Send one PNG, JPEG or PDF in the field "file"' });
    const real = sniff(req.file.buffer);
    if (real !== req.file.mimetype) return res.status(400).json({ error: 'The file content does not match its type' });
    res.status(201).json(await driver.save(req.file.buffer, ALLOWED[real]));
  });

  // Multer errors (such as a file that is too big) arrive here.
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ error: err.message });
    }
    res.status(500).json({ error: 'Something went wrong' });
  });
  return app;
}
