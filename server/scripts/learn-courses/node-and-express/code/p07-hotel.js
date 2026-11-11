// Project 7: hotel booking. Rooms, availability by date range, reservations, cancellation and payment.
import express from 'express';
import { AppError, requireAuth, requireRole, errorHandler, notFoundHandler } from './p-kit.js';

const DAY = 86_400_000;
const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value)) || Number.isNaN(date.getTime())) throw new AppError('Dates must look like 2026-12-24', 422);
  return date;
};

// Two stays overlap when each starts before the other ends. Check-out day is free for the next guest.
export const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

export function createApp({ payments = { charge: async () => ({ ok: true, id: 'pay_demo' }) }, now = () => new Date() } = {}) {
  const app = express();
  app.use(express.json());
  const auth = requireAuth();
  const rooms = new Map();
  const reservations = [];

  app.post('/api/rooms', auth, requireRole('admin'), (req, res) => {
    const { number, type, pricePerNightCents } = req.body ?? {};
    if (!number || !type || !Number.isInteger(pricePerNightCents) || pricePerNightCents < 1) throw new AppError('number, type and pricePerNightCents are required', 422);
    const room = { id: rooms.size + 1, number, type, pricePerNightCents };
    rooms.set(room.id, room);
    res.status(201).json(room);
  });

  const isFree = (roomId, start, end) =>
    !reservations.some((r) => r.roomId === roomId && r.status === 'confirmed' && overlaps(start, end, new Date(r.checkIn), new Date(r.checkOut)));

  app.get('/api/availability', (req, res) => {
    const start = parseDate(req.query.checkIn);
    const end = parseDate(req.query.checkOut);
    if (end <= start) throw new AppError('checkOut must be after checkIn', 422);
    res.json([...rooms.values()].filter((room) => isFree(room.id, start, end) && (!req.query.type || room.type === req.query.type)));
  });

  app.post('/api/reservations', auth, async (req, res) => {
    const room = rooms.get(Number(req.body?.roomId));
    if (!room) throw new AppError('Room not found', 404);
    const start = parseDate(req.body.checkIn);
    const end = parseDate(req.body.checkOut);
    if (end <= start) throw new AppError('checkOut must be after checkIn', 422);
    if (start < new Date(now().toISOString().slice(0, 10))) throw new AppError('checkIn cannot be in the past', 422);
    if (!isFree(room.id, start, end)) throw new AppError('Room is not available for those dates', 409);

    const nights = (end - start) / DAY;
    const totalCents = nights * room.pricePerNightCents;
    // Reserve first, then charge, so two people cannot both pay for the same room.
    const reservation = { id: reservations.length + 1, roomId: room.id, userId: req.user.id, checkIn: req.body.checkIn, checkOut: req.body.checkOut, nights, totalCents, status: 'confirmed' };
    reservations.push(reservation);
    const payment = await payments.charge({ amountCents: totalCents, reservationId: reservation.id });
    if (!payment.ok) { reservation.status = 'payment_failed'; throw new AppError('Payment failed', 402); }
    reservation.paymentId = payment.id;
    res.status(201).json(reservation);
  });

  // Cancellation rule: free until 48 hours before check-in, after that 50% refund.
  app.post('/api/reservations/:id/cancel', auth, (req, res) => {
    const reservation = reservations.find((r) => r.id === Number(req.params.id));
    if (!reservation || (reservation.userId !== req.user.id && req.user.role !== 'admin')) throw new AppError('Reservation not found', 404);
    if (reservation.status !== 'confirmed') throw new AppError('Reservation is not active', 409);
    const hoursLeft = (new Date(reservation.checkIn) - now()) / 3_600_000;
    reservation.status = 'cancelled';
    reservation.refundCents = hoursLeft >= 48 ? reservation.totalCents : Math.floor(reservation.totalCents / 2);
    res.json(reservation);
  });

  app.use(notFoundHandler, errorHandler);
  return app;
}
