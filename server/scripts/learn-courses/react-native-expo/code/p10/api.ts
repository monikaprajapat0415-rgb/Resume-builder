import { Product } from "./cart";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Could not load products");
  return res.json();
}
