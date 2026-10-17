// Small helpers for writing course content as data.
export const P = (text) => ({ type: 'paragraph', text });
export const H = (text) => ({ type: 'heading', text });
export const L = (...items) => ({ type: 'list', items });
export const O = (...items) => ({ type: 'olist', items });
export const N = (text) => ({ type: 'note', text });
export const C = (lang, text) => ({ type: 'code', lang, text });
export const lesson = (section, slug, title, description, readTime, content, faqs = [], keywords = '') =>
  ({ section, slug, title, description, readTime, content, faqs, keywords, published: true });
