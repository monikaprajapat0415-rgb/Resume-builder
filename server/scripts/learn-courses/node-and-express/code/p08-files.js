// Project 8: a file storage API. Upload, list, download and delete, with owners and a storage driver.
import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { AppError, requireAuth, errorHandler, notFoundHandler } from './p-kit.js';

const MAX_BYTES = 2 * 1024 * 1024;
const QUOTA_BYTES = 5 * 1024 * 1024;     // per user
const TYPES = { 'image/png': '.png', 'image/jpeg': '.jpg', 'application/pdf': '.pdf', 'text/plain': '.txt' };

// A driver saves, reads and deletes bytes. This one uses a folder. A Cloudinary or ImageKit driver has the same three functions.
export function folderDriver(folder) {
  return {
    async put(key, buffer) { await fs.writeFile(path.join(folder, key), buffer); },
    async get(key) { return fs.readFile(path.join(folder, key)); },
    async remove(key) { await fs.rm(path.join(folder, key), { force: true }); },
  };
}

export function createApp({ driver }) {
  const app = express();
  const auth = requireAuth();
  const files = new Map();    // id -> metadata (in production: a database table)
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1 } });

  const usedBytes = (userId) => [...files.values()].filter((f) => f.ownerId === userId).reduce((sum, f) => sum + f.size, 0);

  app.post('/api/files', auth, upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) throw new AppError('Send a file in the field "file"', 400);
    const extension = TYPES[file.mimetype];
    if (!extension) throw new AppError('Allowed types: PNG, JPEG, PDF and plain text', 415);
    if (usedBytes(req.user.id) + file.size > QUOTA_BYTES) throw new AppError('Storage quota reached', 413);

    const id = crypto.randomUUID();
    const key = id + extension;               // the stored name never comes from the user
    await driver.put(key, file.buffer);
    const record = { id, key, ownerId: req.user.id, originalName: path.basename(file.originalname), mimetype: file.mimetype, size: file.size, createdAt: new Date().toISOString() };
    files.set(id, record);
    res.status(201).json({ id, name: record.originalName, size: record.size });
  });

  const mine = (req) => {
    const record = files.get(req.params.id);
    if (!record || record.ownerId !== req.user.id) throw new AppError('File not found', 404);   // 404, not 403: do not reveal that it exists
    return record;
  };

  app.get('/api/files', auth, (req, res) => {
    const list = [...files.values()].filter((f) => f.ownerId === req.user.id).map(({ key, ownerId, ...rest }) => rest);
    res.json({ files: list, usedBytes: usedBytes(req.user.id), quotaBytes: QUOTA_BYTES });
  });

  app.get('/api/files/:id', auth, async (req, res) => {
    const record = mine(req);
    res.set({
      'Content-Type': record.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(record.originalName)}"`,
      'X-Content-Type-Options': 'nosniff',     // the browser must not guess a different type
    });
    res.send(await driver.get(record.key));
  });

  app.delete('/api/files/:id', auth, async (req, res) => {
    const record = mine(req);
    await driver.remove(record.key);
    files.delete(record.id);
    res.status(204).end();
  });

  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) return errorHandler(new AppError(err.message, err.code === 'LIMIT_FILE_SIZE' ? 413 : 400), req, res, next);
    errorHandler(err, req, res, next);
  });
  app.use(notFoundHandler);
  return app;
}
