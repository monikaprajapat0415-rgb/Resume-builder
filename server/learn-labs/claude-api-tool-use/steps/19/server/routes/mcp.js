import { Router } from 'express';
import { listServers, callTool } from '../mcp/client.js';

const router = Router();

// GET /api/mcp/servers  ->  { servers: [{ name, tools: [...] }] }
router.get('/mcp/servers', async (req, res) => {
  res.json({ servers: await listServers() });
});

// POST /api/mcp/call  { server, tool, args }  ->  { result }
router.post('/mcp/call', async (req, res) => {
  const { server, tool, args } = req.body || {};
  if (typeof server !== 'string' || typeof tool !== 'string') {
    return res.status(400).json({ error: { message: 'server and tool are required.' } });
  }
  const result = await callTool(server, tool, args && typeof args === 'object' ? args : {});
  res.json({ result });
});

export default router;
