export type TipResult = { tip: number; total: number; perPerson: number };

export function calculateTip(bill: number, tipPercent: number, people: number, roundUp: boolean): TipResult {
  if (bill < 0) throw new Error("bill must not be negative");
  if (people < 1) throw new Error("at least one person");
  let tip = (bill * tipPercent) / 100;
  if (roundUp) tip = Math.ceil(tip);
  const total = bill + tip;
  return { tip, total, perPerson: total / people };
}

export const money = (n: number) => n.toFixed(2);
