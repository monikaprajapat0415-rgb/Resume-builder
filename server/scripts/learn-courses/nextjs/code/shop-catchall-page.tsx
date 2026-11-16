import { Suspense } from "react";

async function Parts({ params }: { params: PageProps<"/shop/[...slug]">["params"] }) {
  const { slug } = await params; // always an array, for example ["shoes", "running"]
  return <p>Path parts: {slug.join(" / ")}</p>;
}

export default function ShopPage(props: PageProps<"/shop/[...slug]">) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Parts params={props.params} />
    </Suspense>
  );
}
