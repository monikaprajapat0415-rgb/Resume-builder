import LikeButton from "./LikeButton";

// A Server Component: it can be async and read data directly.
export default async function ArticleCard() {
  const article = { title: "Server and client together", likes: 3 };
  return (
    <article>
      <h2>{article.title}</h2>
      <LikeButton start={article.likes} />
    </article>
  );
}
