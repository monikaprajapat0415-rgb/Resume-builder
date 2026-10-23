// Compares the example slugs the server knows with the list vite.config.js uses for its sitemap.
import { EXAMPLES } from '../utils/exampleResumes.js';
import { exampleSlugs } from '../../client/src/content/exampleSlugs.js';
import { STATIC_ROUTES } from '../utils/staticSitemapRoutes.js';

const server = EXAMPLES.map((e) => e.slug).sort().join('|');
const client = [...exampleSlugs].sort().join('|');
const sitemap = STATIC_ROUTES.filter((r) => r.startsWith('/examples/')).map((r) => r.slice(10)).sort().join('|');
const ok = server === client && server === sitemap && STATIC_ROUTES.includes('/examples');
console.log(ok ? `OK: ${EXAMPLES.length} example slugs match in the server, vite.config.js list and STATIC_ROUTES` : 'MISMATCH between server/utils/exampleResumes.js, client/src/content/exampleSlugs.js and STATIC_ROUTES');
process.exit(ok ? 0 : 1);
