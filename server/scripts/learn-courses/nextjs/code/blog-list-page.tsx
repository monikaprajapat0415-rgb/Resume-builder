import Link from "next/link";

const posts = [
  { slug: "hello-nextjs", title: "Hello Next.js" },
  { slug: "routing-basics", title: "Routing basics" },
];

export default function BlogPage() {
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
        </li>
      ))}
    </ul>
  );
}
