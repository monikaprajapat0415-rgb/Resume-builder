import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp, overlaps } from './p07-hotel.js';
import { signToken } from './p-kit.js';

const as = (id, role = 'guest') => ({ Authorization: `Bearer ${signToken({ id, role, name: `u${id}` })}` });

test('date overlap rule', () => {
  const d = (s) => new Date(`${s}T00:00:00Z`);
  assert.equal(overlaps(d('2026-12-01'), d('2026-12-05'), d('2026-12-04'), d('2026-12-08')), true);
  assert.equal(overlaps(d('2026-12-01'), d('2026-12-05'), d('2026-12-05'), d('2026-12-08')), false);   // same-day turnover is allowed
});

test('project 7: availability, booking, double booking and refunds', async () => {
  const now = new Date('2026-11-10T10:00:00Z');
  const app = createApp({ now: () => now });
  await request(app).post('/api/rooms').set(as(1, 'admin')).send({ number: '101', type: 'double', pricePerNightCents: 300000 });
  await request(app).post('/api/rooms').set(as(1, 'admin')).send({ number: '102', type: 'single', pricePerNightCents: 200000 });

  const book = (user, roomId, checkIn, checkOut) => request(app).post('/api/reservations').set(as(user)).send({ roomId, checkIn, checkOut });

  const first = await book(2, 1, '2026-12-20', '2026-12-23');
  assert.equal(first.status, 201);
  assert.equal(first.body.totalCents, 900000);                                  // 3 nights

  assert.equal((await book(3, 1, '2026-12-22', '2026-12-25')).status, 409);       // overlap: refused
  assert.equal((await book(3, 1, '2026-12-23', '2026-12-25')).status, 201);       // starts on check-out day: allowed

  const free = await request(app).get('/api/availability?checkIn=2026-12-21&checkOut=2026-12-22');
  assert.deepEqual(free.body.map((r) => r.number), ['102']);
  assert.equal((await request(app).get('/api/availability?checkIn=2026-12-22&checkOut=2026-12-20')).status, 422);
  assert.equal((await book(4, 2, '2026-01-01', '2026-01-03')).status, 422);       // in the past

  const early = await request(app).post('/api/reservations/1/cancel').set(as(2));
  assert.equal(early.body.refundCents, 900000);                                   // more than 48 hours ahead: full refund
  assert.equal((await book(5, 1, '2026-12-20', '2026-12-21')).status, 201);       // the dates are free again
  assert.equal((await request(app).post('/api/reservations/3/cancel').set(as(6))).status, 404);   // not your reservation
});

test('late cancellation refunds half, failed payment frees the room', async () => {
  const now = new Date('2026-11-10T10:00:00Z');
  let ok = false;
  const app = createApp({ now: () => now, payments: { charge: async () => ({ ok, id: 'p' }) } });
  await request(app).post('/api/rooms').set(as(1, 'admin')).send({ number: '101', type: 'double', pricePerNightCents: 100000 });
  const body = { roomId: 1, checkIn: '2026-11-11', checkOut: '2026-11-12' };

  assert.equal((await request(app).post('/api/reservations').set(as(2)).send(body)).status, 402);
  ok = true;
  const booked = await request(app).post('/api/reservations').set(as(2)).send(body);      // the failed attempt did not block the room
  assert.equal(booked.status, 201);
  const cancelled = await request(app).post(`/api/reservations/${booked.body.id}/cancel`).set(as(2));
  assert.equal(cancelled.body.refundCents, 50000);                                         // less than 48 hours: half back
});
