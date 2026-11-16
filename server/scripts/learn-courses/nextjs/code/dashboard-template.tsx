export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  // A template is created again on every navigation, so state inside it starts fresh.
  return <div className="fade-in">{children}</div>;
}
