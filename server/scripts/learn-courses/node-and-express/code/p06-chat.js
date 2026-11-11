// Project 6: real-time chat. Private messages, online status, saved history and a REST endpoint to read it.
import http from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { SECRET } from './p-kit.js';

const pairKey = (a, b) => [a, b].sort().join(':');

export function createChat({ secret = SECRET } = {}) {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const history = new Map();       // "alice:bob" -> messages
  const connections = new Map();   // userId -> number of open sockets

  const verify = (token) => jwt.verify(String(token ?? '').replace(/^Bearer /, ''), secret);

  // REST: read a conversation (the same token rules as the socket).
  app.get('/api/messages/:other', (req, res) => {
    try {
      const me = verify(req.get('authorization')).sub;
      res.json(history.get(pairKey(me, req.params.other)) ?? []);
    } catch {
      res.status(401).json({ error: 'Log in first' });
    }
  });

  io.use((socket, next) => {
    try { socket.data.user = verify(socket.handshake.auth?.token).sub; next(); } catch { next(new Error('unauthorized')); }
  });

  io.on('connection', (socket) => {
    const me = socket.data.user;
    socket.join(`user:${me}`);
    connections.set(me, (connections.get(me) ?? 0) + 1);
    io.emit('presence', { user: me, online: true });
    socket.emit('online-users', [...connections.keys()]);

    socket.on('message', ({ to, text }, ack) => {
      const clean = typeof text === 'string' ? text.trim() : '';
      if (!to || !clean || clean.length > 500) return ack?.({ ok: false, error: 'Message must be 1 to 500 characters' });
      const message = { from: me, to, text: clean, at: new Date().toISOString() };
      const key = pairKey(me, to);
      history.set(key, [...(history.get(key) ?? []), message]);
      io.to(`user:${to}`).emit('message', message);          // reaches every device of the receiver
      ack?.({ ok: true });
    });

    socket.on('typing', ({ to }) => io.to(`user:${to}`).emit('typing', { from: me }));

    socket.on('disconnect', () => {
      const left = (connections.get(me) ?? 1) - 1;
      if (left <= 0) { connections.delete(me); io.emit('presence', { user: me, online: false }); } else connections.set(me, left);
    });
  });

  return { server, io };
}
