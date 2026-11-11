import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { io as connect } from 'socket.io-client';
import { createChat } from './p06-chat.js';
import { signToken } from './p-kit.js';

const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve));

test('project 6: private chat, presence and history', async () => {
  const { server, io } = createChat();
  await new Promise((resolve) => server.listen(0, resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const token = (id) => signToken({ id, role: 'user', name: id });

  const alice = connect(url, { auth: { token: token('alice') } });
  await once(alice, 'connect');

  const bobConnect = connect(url, { auth: { token: token('bob') } });
  const sawBob = once(alice, 'presence');
  await once(bobConnect, 'connect');
  assert.deepEqual(await sawBob, { user: 'bob', online: true });

  const received = once(bobConnect, 'message');
  const ack = await new Promise((resolve) => alice.emit('message', { to: 'bob', text: ' hello ' }, resolve));
  assert.equal(ack.ok, true);
  assert.equal((await received).text, 'hello');

  const bad = await new Promise((resolve) => alice.emit('message', { to: 'bob', text: '   ' }, resolve));
  assert.equal(bad.ok, false);

  const typing = once(alice, 'typing');
  bobConnect.emit('typing', { to: 'alice' });
  assert.equal((await typing).from, 'bob');

  const history = await request(server).get('/api/messages/alice').set('Authorization', `Bearer ${token('bob')}`);
  assert.equal(history.body.length, 1);
  assert.equal((await request(server).get('/api/messages/alice')).status, 401);

  const offline = once(alice, 'presence');
  bobConnect.close();
  assert.deepEqual(await offline, { user: 'bob', online: false });

  alice.close();
  await io.close();
});
