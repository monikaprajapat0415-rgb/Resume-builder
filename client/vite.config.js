import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { templateSlugs } from './src/content/templateSlugs.js'

// Only public, indexable pages belong in the sitemap. Private/user-specific routes
// (dashboard, builder, individual resume links, auth utility pages, admin) are
// intentionally left out and also blocked in public/robots.txt.
//
// Blog posts are no longer listed individually here: they're created by admins
// through /admin/blogs and live in the database, not as build-time data, so this
// static, build-time sitemap has no way to enumerate them. The /blog index page
// links to every published post, so they're still fully crawlable - just not
// pre-listed in sitemap.xml. If you want every post in the sitemap too, add a
// backend route that serves its own sitemap entries from GET /api/blogs/sitemap/slugs
// and reference it from a <sitemapindex> alongside this one.
const staticRoutes = [
  '/',
  '/contact-us',
  '/privacy-policy',
  '/terms-and-conditions',
  '/blog',
  '/features',
  '/features/ats-checker',
  '/templates',
  '/products',
  ...templateSlugs.map((slug) => `/templates/${slug}`),
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap({
      hostname: 'https://primeresumeai.com',
      dynamicRoutes: staticRoutes,
      exclude: ['/app', '/app/*', '/view/*', '/logout', '/forgot-password', '/reset-password/*', '/verify-email/*', '/admin', '/admin/*'],
      changefreq: 'weekly',
      readable: true,
    })],
})
