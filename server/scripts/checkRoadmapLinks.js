// Checks every external learning link in the published roadmaps and lists the ones that fail.
// Run it on the server (it needs internet access) now and then: websites move pages.
//   node scripts/checkRoadmapLinks.js
// A 403/429 is often just a site refusing scripts, so those are listed as "check by hand", not as broken.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Roadmap from '../models/Roadmap.js';

await connectDB();
const roadmaps = await Roadmap.find({}).select('slug steps').lean();
const urls = new Map();
for (const r of roadmaps) for (const s of r.steps) for (const x of [...(s.resources || []), ...(s.links || [])]) {
  if (/^https?:\/\//i.test(x.url || '')) urls.set(x.url, [...(urls.get(x.url) || []), r.slug]);
}
console.log(`Checking ${urls.size} links from ${roadmaps.length} roadmaps...`);

const check = async (url) => {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrimeResumeLinkCheck/1.0)' } });
      if (res.ok) return { ok: true, status: res.status };
      if (method === 'GET' || ![403, 404, 405, 501].includes(res.status)) return { ok: false, status: res.status };
    } catch (e) { if (method === 'GET') return { ok: false, status: e.name === 'TimeoutError' ? 'timeout' : (e.cause?.code || e.message) }; }
  }
};

const list = [...urls.keys()];
const bad = [], hand = [];
let i = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (i < list.length) {
    const url = list[i++];
    const r = await check(url);
    if (r.ok) continue;
    (r.status === 403 || r.status === 429 ? hand : bad).push({ url, status: r.status, used: [...new Set(urls.get(url))].slice(0, 3).join(', ') });
  }
}));
bad.sort((a, b) => a.url.localeCompare(b.url));
console.log(bad.length ? `\nBROKEN (${bad.length}): fix in Admin > Career roadmaps or tell me the replacement` : '\nNo broken links.');
bad.forEach((b) => console.log(`  ${b.status}  ${b.url}   (in ${b.used})`));
if (hand.length) { console.log(`\nCHECK BY HAND (${hand.length}): the site refused the script`); hand.forEach((b) => console.log(`  ${b.status}  ${b.url}`)); }
await mongoose.disconnect();
