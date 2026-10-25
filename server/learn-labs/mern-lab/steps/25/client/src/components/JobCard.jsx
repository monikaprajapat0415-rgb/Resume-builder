// For now this card always shows the same job. In lesson 26 it will receive the job as props.
export default function JobCard() {
  return (
    <article className="card">
      <h2>Dispatcher</h2>
      <p>Acme Logistics · Pune</p>
      <span className="badge">applied</span>
    </article>
  );
}
