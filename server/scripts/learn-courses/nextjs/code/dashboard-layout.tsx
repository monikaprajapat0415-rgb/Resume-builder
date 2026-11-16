import Link from "next/link";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex gap-6">
      <aside>
        <Link href="/dashboard">Overview</Link>
        <br />
        <Link href="/dashboard/settings">Settings</Link>
      </aside>
      <section>{children}</section>
    </div>
  );
}
