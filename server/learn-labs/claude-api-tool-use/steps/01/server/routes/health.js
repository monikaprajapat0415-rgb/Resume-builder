import { Router } from 'express';
import { MODEL, hasKey } from '../claude.js';

const router = Router();

// GET /api/health  ->  tells the Angular app that the server is alive
router.get('/health', (req, res) => {
  res.json({ ok: true, model: MODEL, keyConfigured: hasKey() });
});

export default router;
