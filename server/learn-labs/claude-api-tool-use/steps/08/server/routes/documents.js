import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { client, MODEL, textOf } from '../claude.js';

const router = Router();

// Keep the upload in memory only. We never write the file to disk or a database.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

// Turn upload problems (like a file that is too big) into a clear message.
const receiveFile = (req, res, next) =>
  upload.single('file')(req, res, (err) => {
    if (err) {
      err.status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      err.userMessage = err.code === 'LIMIT_FILE_SIZE' ? 'That file is too large. The limit is 5 MB.' : 'The upload failed. Please try again.';
    }
    next(err);
  });

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const Result = z.object({
  name: z.string().nullable(),
  skills: z.array(z.string()),
  jobs: z.array(z.object({ title: z.string(), company: z.string().nullable() })),
});

// Models sometimes wrap JSON in code fences. Strip them before parsing.
const parseJson = (text) => JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim());

// POST /api/read-document  (multipart form, field "file")
router.post('/read-document', receiveFile, async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: { message: 'Please choose a file.' } });

  const isPdf = file.mimetype === 'application/pdf' && file.buffer.subarray(0, 4).toString() === '%PDF';
  const isImage = IMAGE_TYPES.includes(file.mimetype);
  if (!isPdf && !isImage) {
    return res.status(400).json({ error: { message: 'Upload a PDF, PNG, JPG or WebP file.' } });
  }

  const data = file.buffer.toString('base64');
  const fileBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
    : { type: 'image', source: { type: 'base64', media_type: file.mimetype, data } };

  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: [
        fileBlock,
        { type: 'text', text: 'Read this resume. Reply with JSON only: {"name": string|null, "skills": string[], "jobs": [{"title": string, "company": string|null}]}. Use null when unknown. Do not invent anything.' },
      ],
    }],
  });

  let parsed;
  try {
    parsed = Result.parse(parseJson(textOf(reply)));
  } catch {
    return res.status(422).json({ error: { message: 'We could not read that file clearly. Try a clearer copy.' } });
  }
  res.json({ data: parsed, usage: reply.usage });
});

export default router;
