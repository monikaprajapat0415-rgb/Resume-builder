export const P = (text) => ({ type: 'paragraph', text });
export const H = (text) => ({ type: 'heading', text });
export const L = (...items) => ({ type: 'list', items });
export const O = (...items) => ({ type: 'olist', items });
export const N = (text) => ({ type: 'note', text });
export const words = (blocks) => blocks.map((b) => [b.text, ...(b.items || [])].join(' ')).join(' ').split(/\s+/).filter(Boolean).length;
// Stable, official or long-standing home pages only. Deep links move, so we point at the site root.
export const SRC = {
  ncs: { title: 'National Career Service (Government of India)', url: 'https://www.ncs.gov.in/' },
  jobbank: { title: 'Job Bank (Government of Canada)', url: 'https://www.jobbank.gc.ca/' },
  uk: { title: 'National Careers Service (UK)', url: 'https://nationalcareers.service.gov.uk/' },
  cos: { title: 'CareerOneStop (US Department of Labor)', url: 'https://www.careeronestop.org/' },
};
