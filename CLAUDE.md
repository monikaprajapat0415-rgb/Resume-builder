# Prime Resume AI: working agreements

## SEO on every change (standing rule)

Every feature, page or content change must include its SEO work in the same delivery. Do not ship a page without it.
Before calling a change done, go through this list and say in the closing message what was done or why an item does not apply.

1. **Title and description**: unique per page, title under about 60 characters, description under 160. Set in the page's `<SEO />` and in the server-rendered shell if the page has one.
2. **Canonical and robots**: one canonical URL. Filtered, paginated, empty or private views are `noindex, follow`. Private pages (dashboard, admin, forms) use `noindex`.
3. **Server-rendered HTML** for any public page that should rank: add a route in `server/routes/seoRoutes.js` that returns the real h1, copy and links (see `jobSeoController.js`). Unknown or closed items return 404.
4. **Structured data (JSON-LD)**: BreadcrumbList on every page; plus the right type: JobPosting, FAQPage, ItemList, Article, etc. The browser and the server must agree.
5. **Sitemap**: add new public URLs to `getBlogSitemapXml` (database-backed) or `STATIC_ROUTES` (static). Only list pages that have content and are indexable. Never list pending, rejected or hidden items.
6. **nginx**: new public paths must be proxied to Node if they are server-rendered. Check `nginx-blog-snippet.conf` and say if it needs a change.
7. **Internal links**: link new pages from related pages (index, siblings, footer or menu) so crawlers and people can reach them.
8. **Content quality**: real helpful copy, no stuffed keywords, no invented numbers. Write for the audiences we serve: India, UK, Canada and African countries; corporate, factory, skilled trade and daily wage workers.
9. **Test it**: fetch the page without JavaScript and check title, canonical, robots, h1, JSON-LD and sitemap. Then check it in the browser: one title, one canonical, no console errors, no horizontal scroll on a 390px phone.
10. **After deploy**: rebuild the client (`npm run build`), restart pm2, then request indexing of new URL types in Search Console.

## Other rules
- Privacy: never send a job seeker's name, email, phone or user id to employers before the seeker accepts a request.
- Employer jobs and employers need admin approval before they are public.
