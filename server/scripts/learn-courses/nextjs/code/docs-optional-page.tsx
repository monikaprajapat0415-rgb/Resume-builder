import { Suspense } from "react";

async function Doc({ params }: { params: PageProps<"/docs/[[...slug]]">["params"] }) {
  const { slug } = await params; // undefined on /docs itself
  return <p>{slug ? `Doc: ${slug.join("/")}` : "Docs home"}</p>;
}

export default function DocsPage(props: PageProps<"/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Doc params={props.params} />
    </Suspense>
  );
}
