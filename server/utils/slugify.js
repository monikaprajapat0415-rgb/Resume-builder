export const slugify = (str) =>
    (str || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

// Only http(s), mailto, tel, site-relative and #anchor links are allowed anywhere
// a URL is stored or rendered - blocks javascript:/data: URLs.
export const isSafeUrl = (url) => /^(https?:\/\/|mailto:|tel:|\/|#)/i.test((url || '').trim());
