import crypto from "node:crypto";

// Signature: hex HMAC-SHA256 of the raw request body, keyed with PLAN_WEBHOOK_SECRET, sent in
// `x-signature` (our own format) or `x-razorpay-signature` (Razorpay uses the same scheme).
export const verifySignature = (raw, header, secret) => {
    if (!secret || !raw || !header) return false;
    const want = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    const got = String(header).trim().toLowerCase().replace(/^sha256=/, '');
    const a = Buffer.from(want), b = Buffer.from(got);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const email = (v) => String(v || '').trim().toLowerCase().slice(0, 200);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Turns a notice into { eventId, email, amount, currency, days?, lifetime?, provider } or null
// (null = not a payment we act on). Two shapes are understood:
//  1. Ours:      { id, type: "payment.succeeded", email, amount, currency, days | lifetime }
//  2. Razorpay:  { event: "payment.captured", payload: { payment: { entity: { id, email, amount, currency, notes: { days } } } } }
//     (Razorpay amounts are in the smallest unit; we store them as sent and never convert.)
export const parseEvent = (body) => {
    if (!body || typeof body !== 'object') return null;
    if (body.event && body.payload?.payment?.entity) {
        if (body.event !== 'payment.captured') return null;
        const e = body.payload.payment.entity;
        return { provider: 'razorpay', eventId: `rzp:${e.id}`, email: email(e.email || e.notes?.email), amount: num(e.amount), currency: String(e.currency || '').toUpperCase().slice(0, 6), days: num(e.notes?.days), lifetime: e.notes?.lifetime === true || e.notes?.lifetime === 'true' };
    }
    if (body.type === 'payment.succeeded' && body.id) {
        return { provider: 'generic', eventId: `gen:${String(body.id).slice(0, 120)}`, email: email(body.email), amount: num(body.amount), currency: String(body.currency || '').toUpperCase().slice(0, 6), days: num(body.days), lifetime: body.lifetime === true };
    }
    return null;
};

// Days to grant when the notice does not say: from the plan's billing period in Admin > Paid plan.
export const defaultDays = (period) => (period === 'year' ? 365 : period === 'month' ? 30 : 0 /* one-off = lifetime */);
