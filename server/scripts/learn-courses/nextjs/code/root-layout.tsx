import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My First Next.js App",
  description: "A small site built while learning Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
