import { expect } from 'chai';
import { createRequire } from 'node:module';
const { totalCents, checkout } = createRequire(import.meta.url)('./t42-cart.cjs');

describe('cart with Mocha and Chai', () => {
  it('adds price times quantity', () => {
    expect(totalCents([{ priceCents: 250, qty: 2 }])).to.equal(500);
  });

  it('uses a hand-made stub for the gateway', async () => {
    const calls = [];
    const gateway = { charge: async (amount) => { calls.push(amount); return { ok: false }; } };   // a stub that always declines
    const result = await checkout([{ priceCents: 300, qty: 1 }], gateway);
    expect(result.paid).to.equal(false);
    expect(calls).to.deep.equal([300]);
  });

  it('throws for an empty cart', async () => {
    try {
      await checkout([], { charge: async () => ({ ok: true }) });
      expect.fail('should have thrown');
    } catch (error) {
      expect(error.message).to.equal('Cart is empty');
    }
  });
});
