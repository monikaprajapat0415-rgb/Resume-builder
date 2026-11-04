import { create } from "zustand";

export type Product = { id: number; title: string; price: number; image: string; category: string };
type Line = { product: Product; qty: number };

type CartState = {
  lines: Line[];
  add: (p: Product) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  lines: [],
  add: (p) =>
    set((s) => {
      const found = s.lines.find((l) => l.product.id === p.id);
      return found
        ? { lines: s.lines.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l)) }
        : { lines: [...s.lines, { product: p, qty: 1 }] };
    }),
  decrease: (id) =>
    set((s) => ({
      lines: s.lines.flatMap((l) => (l.product.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])),
    })),
  remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) })),
  clear: () => set({ lines: [] }),
}));

export const cartCount = (lines: Line[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (lines: Line[]) => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
