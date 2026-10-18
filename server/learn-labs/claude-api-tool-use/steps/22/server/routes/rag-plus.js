import { Router } from 'express';
import { answerQuestion } from '../rag/answer.js';

const router = Router();

// POST /api/rag-plus  { question, mode }  ->  { answer, citations, sources, mode }
router.post('/rag-plus', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 500);
  if (!question) return res.status(400).json({ error: { message: 'Please type a question.' } });
  const mode = ['keyword', 'vector', 'hybrid'].includes(req.body?.mode) ? req.body.mode : 'hybrid';
  res.json(await answerQuestion(question, mode));
});

export default router;
