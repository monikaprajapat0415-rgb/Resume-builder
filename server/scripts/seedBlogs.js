// One-off migration: copies the blog posts that used to live as static data in
// client/src/content/blogPosts.js into the database, now that the blog is
// admin-managed. Safe to run more than once - existing posts (matched by slug)
// are updated in place rather than duplicated.
//
// Usage (from the server/ directory): node scripts/seedBlogs.js

import "dotenv/config";
import connectDB from "../configs/db.js";
import Blog from "../models/Blog.js";
import { blogPosts } from "../../client/src/content/blogPosts.js";

await connectDB();

for (const post of blogPosts) {
    const result = await Blog.findOneAndUpdate(
        { slug: post.slug },
        {
            title: post.title,
            slug: post.slug,
            description: post.description,
            keywords: post.keywords,
            excerpt: post.excerpt,
            date: post.date,
            readTime: post.readTime,
            content: post.content,
            published: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Seeded: ${result.slug}`);
}

console.log(`Done - ${blogPosts.length} posts seeded/updated.`);
process.exit(0);
