import test from 'node:test';
import assert from 'node:assert/strict';
import { io as connect } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { createRealtime } from './ws37-realtime.js';

const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve));

test('auth, private messages and notifications', async () => {
  const { server, io, notify } = createRealtime({ secret: 's' });
  await new Promise((resolve) => server.listen(0, resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const token = (sub) => jwt.sign({ sub }, 's');

  // No token: refused.
  const anon = connect(url, { auth: {}, reconnection: false });
  const refusal = await once(anon, 'connect_error');
  assert.equal(refusal.message, 'unauthorized');
  anon.close();

  const alice = connect(url, { auth: { token: token('alice') } });
  const bob = connect(url, { auth: { token: token('bob') } });
  await Promise.all([once(alice, 'connect'), once(bob, 'connect')]);

  const incoming = once(bob, 'private-message');
  alice.emit('private-message', { to: 'bob', text: '  hi Bob  ' });
  assert.deepEqual(await incoming, { from: 'alice', text: 'hi Bob' });

  const note = once(alice, 'notification');
  notify('alice', { title: 'Order shipped' });
  assert.equal((await note).title, 'Order shipped');

  alice.close(); bob.close();
  await io.close();
});
