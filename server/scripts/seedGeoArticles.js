// Phase 2 (GEO) content: 7 new articles with key takeaways, FAQ and sources, plus those fields for the existing posts.
// New articles are saved as DRAFTS so you can read each one and publish from /admin/blogs (pass --publish to publish at once).
// Existing posts: only takeaways, faqs and sources are added (and only when the post has none). Text is never changed.
// Re-run safe. Usage (from server/):  node scripts/seedGeoArticles.js [--publish] [--force] [--dry]
import "dotenv/config";
import connectDB from "../configs/db.js";
import Blog from "../models/Blog.js";
import { articles1 } from "./geo-articles/articles1.js";
import { articles2 } from "./geo-articles/articles2.js";
import { enrich } from "./geo-articles/enrich.js";

const publish = process.argv.includes('--publish');
const force = process.argv.includes('--force');
const dry = process.argv.includes('--dry');
const articles = [...articles1, ...articles2];

await connectDB();
for (const p of articles) {
    const exists = await Blog.findOne({ slug: p.slug });
    if (exists && !force) { console.log(`Exists, skipped: ${p.slug}${exists.published ? ' (published)' : ' (draft)'}`); continue; }
    if (dry) { console.log(`Would create: ${p.slug}`); continue; }
    await Blog.findOneAndUpdate({ slug: p.slug }, { ...p, date: new Date(), modifiedAt: new Date(), published: publish }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
    console.log(`${publish ? 'Published' : 'Draft saved'}: ${p.slug}`);
}
for (const [slug, f] of Object.entries(enrich)) {
    const post = await Blog.findOne({ slug });
    if (!post) { console.log(`Not found (no GEO fields added): ${slug}`); continue; }
    const set = {};
    if (!post.takeaways?.length || force) set.takeaways = f.takeaways;
    if (!post.faqs?.length || force) set.faqs = f.faqs;
    if (!post.sources?.length || force) set.sources = f.sources;
    if (!Object.keys(set).length) { console.log(`Already has GEO fields: ${slug}`); continue; }
    if (dry) { console.log(`Would add ${Object.keys(set).join(', ')}: ${slug}`); continue; }
    await Blog.updateOne({ slug }, { $set: { ...set, modifiedAt: new Date() } });
    console.log(`GEO fields added: ${slug}`);
}
process.exit(0);
