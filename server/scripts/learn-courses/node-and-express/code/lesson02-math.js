export function add(a, b) { return a + b; }
export const TAX = 0.18;
export default function price(net) { return Math.round(net * (1 + TAX)); }
