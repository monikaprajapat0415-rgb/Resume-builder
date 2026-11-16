"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];
  return (
    <nav className="flex gap-4">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "font-bold" : ""}>
          {l.label}
        </Link>
      ))}
      <button onClick={() => router.push("/pricing")}>See pricing</button>
    </nav>
  );
}
