"use client";

import { useState } from "react";

export default function LikeButton({ start }: { start: number }) {
  const [likes, setLikes] = useState(start);
  return <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>;
}
