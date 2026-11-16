import type { Metadata } from "next";

const products: Record<string, { name: string; about: string }> = {
  "1": { name: "Notebook", about: "A plain paper notebook." },
  "2": { name: "Pen", about: "A blue ballpoint pen." },
};

export function generateStaticParams() {
  return Object.keys(products).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = products[id];
  return {
    title: product ? product.name : "Product not found",
    description: product?.about,
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = products[id];
  return <h1>{product ? product.name : "Unknown product"}</h1>;
}
