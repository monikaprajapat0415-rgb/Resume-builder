// Money is stored as whole cents so 0.1 + 0.2 style errors never appear.
export function parseCents(text: string): number | null {
  const t = text.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const [whole, frac = ""] = t.split(".");
  const cents = parseInt(whole, 10) * 100 + parseInt(frac.padEnd(2, "0") || "0", 10);
  return cents > 0 ? cents : null;
}

export const asMoney = (cents: number) => (cents / 100).toFixed(2);
