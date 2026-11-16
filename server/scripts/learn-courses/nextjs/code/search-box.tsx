"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBox() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  return <p>You searched for: {q || "nothing yet"}</p>;
}
