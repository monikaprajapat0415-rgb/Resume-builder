// The server pre-renders a post's meta tags and structured data (JSON-LD) into the HTML so
// crawlers that don't run JavaScript can read them. Once React has rendered the same
// data through <SEO />, drop the server's copy of the JSON-LD so it isn't duplicated.
export const dropServerJsonLd = () => {
  try { document.head.querySelectorAll('script[data-seo-ssr]').forEach((n) => n.remove()) } catch { /* not in a browser */ }
}

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// "Updated" is only worth showing when the post was changed meaningfully after publishing.
export const wasUpdated = (published, modified) => modified && new Date(modified) - new Date(published) > 24 * 3600 * 1000
