import { Suspense } from "react";
import NavLinks from "@/components/NavLinks";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    <main className="p-6">
      <NavLinks />
      <h1>Welcome</h1>
      <Suspense fallback={<p>Loading search...</p>}>
        <SearchBox />
      </Suspense>
    </main>
  );
}
