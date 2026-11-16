export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border p-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}
