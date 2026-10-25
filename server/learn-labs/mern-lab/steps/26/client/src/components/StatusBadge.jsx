// Props are the inputs of a component. This one takes a `status` and picks a class from it.
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
