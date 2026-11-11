// A small module to test: it depends on a payment gateway that we replace with a mock in tests.
function totalCents(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
}

async function checkout(items, gateway) {
  if (!items.length) throw new Error('Cart is empty');
  const amountCents = totalCents(items);
  const result = await gateway.charge(amountCents);
  return { amountCents, paid: result.ok };
}

module.exports = { totalCents, checkout };
