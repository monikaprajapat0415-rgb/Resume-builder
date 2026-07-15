import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// Only public, indexable pages belong in the sitemap. Private/user-specific routes
// (dashboard, builder, individual resume links, auth utility pages) are intentionally
// left out and also blocked in public/robots.txt.
const staticRoutes = [
  '/',
  '/contact-us',
  '/privacy-policy',
  '/terms-and-conditions',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap({
      hostname: 'https://primeresumeai.com',
      dynamicRoutes: staticRoutes,
      exclude: ['/app', '/app/*', '/view/*', '/logout', '/forgot-password', '/reset-password/*'],
      changefreq: 'weekly',
      readable: true,
    })],
})



