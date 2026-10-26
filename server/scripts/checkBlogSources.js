// Run on the VPS now and then: opens every source link saved on blog posts and reports the ones that fail.
// Usage (from server/): node scripts/checkBlogSources.js
import "dotenv/config";
import connectDB from "../configs/db.js";
import Blog from "../models/Blog.js";
await connectDB();
// Remove a dead source from every post:  node scripts/checkBlogSources.js --remove https://example.com/
const ri = process.argv.indexOf('--remove');
if (ri > -1 && process.argv[ri + 1]) {
    const r = await Blog.updateMany({}, { $pull: { sources: { url: process.argv[ri + 1] } } });
    console.log(`Removed ${process.argv[ri + 1]} from ${r.modifiedCount} post(s).`);
    process.exit(0);
}
const posts = await Blog.find({ 'sources.0': { $exists: true } }).select('slug sources').lean();
const urls = new Map();
for (const p of posts) for (const s of p.sources) { if (!urls.has(s.url)) urls.set(s.url, []); urls.get(s.url).push(p.slug); }
let bad = 0;
for (const [url, slugs] of urls) {
    try { const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 link-check' }, signal: AbortSignal.timeout(15000) }); if (r.status >= 400) { bad++; console.log(`FAIL ${r.status} ${url}  (${slugs.length} posts)`); } else console.log(`ok   ${r.status} ${url}`); }
    catch (e) { bad++; console.log(`FAIL ${e.message} ${url}`); }
}
console.log(bad ? `${bad} link(s) need a look` : 'All source links open.');
process.exit(0);
