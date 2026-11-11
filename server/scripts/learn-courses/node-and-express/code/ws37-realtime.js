import http from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Real-time with Socket.IO: authenticate on connect, join a room per user, push notifications.
export function createRealtime({ secret }) {
  const server = http.createServer();
  const io = new Server(server);
  const online = new Set();

  // Middleware runs once per connection: refuse anyone without a valid token.
  io.use((socket, next) => {
    try {
      socket.data.user = jwt.verify(String(socket.handshake.auth?.token ?? ''), secret).sub;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const me = socket.data.user;
    socket.join(`user:${me}`);                       // every user has a private room
    online.add(me);
    io.emit('presence', [...online]);

    socket.on('private-message', ({ to, text }) => {
      if (typeof text !== 'string' || !text.trim() || text.length > 500) return;      // never trust client data
      io.to(`user:${to}`).emit('private-message', { from: me, text: text.trim() });
    });

    socket.on('disconnect', () => {
      // Count a user offline only when their last connection closes.
      if (!io.sockets.adapter.rooms.get(`user:${me}`)) online.delete(me);
      io.emit('presence', [...online]);
    });
  });

  // Other parts of the server (a route, a job) can push a notification to one user:
  const notify = (userId, payload) => io.to(`user:${userId}`).emit('notification', payload);

  return { server, io, notify };
}
