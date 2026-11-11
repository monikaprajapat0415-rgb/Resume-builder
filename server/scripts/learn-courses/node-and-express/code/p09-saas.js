// Project 9: SaaS subscriptions. Plans, subscribe, limits per plan, and billing events from a provider webhook.
import express from 'express';
import crypto from 'node:crypto';
import { AppError, requireAuth, errorHandler, notFoundHandler } from './p-kit.js';

export const PLANS = {
  free: { priceCents: 0, projects: 1 },
  pro: { priceCents: 49900, projects: 10 },
  team: { priceCents: 199900, projects: 100 },
};

export const sign = (raw, secret) => crypto.createHmac('sha256', secret).update(raw).digest('hex');

export function createApp({ billing, webhookSecret, now = () => Date.now() }) {
  const app = express();
  const auth = requireAuth();
  const accounts = new Map();       // userId -> { plan, status, renewsAt }
  const projects = new Map();       // userId -> [names]
  const seen = new Set();

  const accountOf = (id) => accounts.get(id) ?? accounts.set(id, { plan: 'free', status: 'active', renewsAt: null }).get(id);

  // The webhook uses the raw body so the signature can be checked.
  app.post('/webhooks/billing', express.raw({ type: 'application/json' }), (req, res) => {
    const given = req.get('x-signature') ?? '';
    const expected = sign(req.body, webhookSecret);
    if (given.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) return res.status(400).json({ error: 'Bad signature' });
    const event = JSON.parse(req.body.toString('utf8'));
    if (seen.has(event.id)) return res.json({ duplicate: true });
    seen.add(event.id);

    const account = accountOf(event.userId);
    if (event.type === 'subscription.paid') Object.assign(account, { plan: event.plan, status: 'active', renewsAt: now() + 30 * 86_400_000 });
    if (event.type === 'subscription.payment_failed') account.status = 'past_due';
    if (event.type === 'subscription.cancelled') Object.assign(account, { plan: 'free', status: 'active', renewsAt: null });
    res.json({ received: true });
  });

  app.use(express.json());

  app.get('/api/plans', (req, res) => res.json(PLANS));

  // We do NOT activate the plan here. We start a checkout; the paid webhook activates it.
  app.post('/api/subscribe', auth, async (req, res) => {
    const plan = req.body?.plan;
    if (!PLANS[plan] || plan === 'free') throw new AppError('Choose pro or team', 422);
    const checkout = await billing.createCheckout({ userId: req.user.id, plan, amountCents: PLANS[plan].priceCents });
    res.status(201).json({ checkoutUrl: checkout.url });
  });

  app.get('/api/account', auth, (req, res) => res.json({ ...accountOf(req.user.id), limits: PLANS[accountOf(req.user.id).plan], used: (projects.get(req.user.id) ?? []).length }));

  // Entitlement check: what the plan allows is decided on the server, on every request.
  app.post('/api/projects', auth, (req, res) => {
    const account = accountOf(req.user.id);
    if (account.status === 'past_due') throw new AppError('Your last payment failed. Update your payment method.', 402);
    const list = projects.get(req.user.id) ?? [];
    if (list.length >= PLANS[account.plan].projects) throw new AppError(`Your ${account.plan} plan allows ${PLANS[account.plan].projects} project(s). Upgrade to add more.`, 403);
    projects.set(req.user.id, [...list, String(req.body?.name ?? 'Untitled')]);
    res.status(201).json({ count: list.length + 1 });
  });

  app.use(notFoundHandler, errorHandler);
  return app;
}
