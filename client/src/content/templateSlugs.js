// Slug-only list of template landing pages, kept separate from resumeTemplates.js
// on purpose: vite.config.js imports this file to build the sitemap, and vite.config.js
// is loaded by esbuild in a plain Node context that can't resolve image imports
// (.png/.jpg) the way the Vite dev/build pipeline can for the React app itself.
// Keep this file free of any asset imports.

export const templateSlugs = [
  'classic-resume-template',
  'modern-resume-template',
  'minimal-resume-template',
  'resume-template-with-photo',
]
