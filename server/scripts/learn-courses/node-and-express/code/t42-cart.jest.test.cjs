const { totalCents, checkout } = require('./t42-cart.cjs');

describe('totalCents', () => {
  test('adds price times quantity', () => {
    expect(totalCents([{ priceCents: 250, qty: 2 }, { priceCents: 100, qty: 1 }])).toBe(600);
  });
  test('an empty cart is zero', () => expect(totalCents([])).toBe(0));
});

describe('checkout', () => {
  test('charges the gateway with the right amount (mock)', async () => {
    const gateway = { charge: jest.fn().mockResolvedValue({ ok: true }) };
    const result = await checkout([{ priceCents: 500, qty: 2 }], gateway);
    expect(gateway.charge).toHaveBeenCalledWith(1000);
    expect(gateway.charge).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ amountCents: 1000, paid: true });
  });
  test('rejects an empty cart and never calls the gateway', async () => {
    const gateway = { charge: jest.fn() };
    await expect(checkout([], gateway)).rejects.toThrow('Cart is empty');
    expect(gateway.charge).not.toHaveBeenCalled();
  });
});
