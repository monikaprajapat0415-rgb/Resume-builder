export function generateStaticParams() {
  return [{ slug: "hello-nextjs" }, { slug: "routing-basics" }];
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return <h1>Post: {slug}</h1>;
}
