"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortButton() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function sortBy(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sort", value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return <button onClick={() => sortBy("price")}>Sort by price</button>;
}
