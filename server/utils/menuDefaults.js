// The menu the site shipped with. Each has a stable `key` so "Restore defaults" can
// bring back one that was deleted without duplicating the ones that still exist.
// Keep in sync with client/src/utils/menu.js (the offline fallback).
export const MENU_LOCATIONS = ['header', 'footer_product', 'footer_resources', 'footer_legal'];

export const DEFAULT_MENU = [
    { key: 'h-home', location: 'header', label: 'Home', url: '/' },
    { key: 'h-features', location: 'header', label: 'Features', url: '/features' },
    { key: 'h-testimonials', location: 'header', label: 'Testimonials', url: '/#testimonials' },
    { key: 'h-templates', location: 'header', label: 'Templates', url: '/templates' },
    { key: 'h-products', location: 'header', label: 'Products', url: '/products' },
    { key: 'h-blog', location: 'header', label: 'Blog', url: '/blog' },
    { key: 'h-contact', location: 'header', label: 'Contact Us', url: '/#contact-us' },

    { key: 'fp-home', location: 'footer_product', label: 'Home', url: '/' },
    { key: 'fp-support', location: 'footer_product', label: 'Support', url: '/' },
    { key: 'fp-pricing', location: 'footer_product', label: 'Pricing', url: '/' },
    { key: 'fp-affiliate', location: 'footer_product', label: 'Affiliate', url: '/' },

    { key: 'fr-templates', location: 'footer_resources', label: 'Templates', url: '/templates' },
    { key: 'fr-ats', location: 'footer_resources', label: 'ATS Checker', url: '/features/ats-checker' },
    { key: 'fr-products', location: 'footer_resources', label: 'Products', url: '/products' },
    { key: 'fr-blog', location: 'footer_resources', label: 'Blog', url: '/blog' },
    { key: 'fr-contact', location: 'footer_resources', label: 'Contact', url: '/contact-us' },

    { key: 'fl-privacy', location: 'footer_legal', label: 'Privacy', url: '/privacy-policy' },
    { key: 'fl-terms', location: 'footer_legal', label: 'Terms', url: '/terms-and-conditions' },
].map((item, i) => ({ ...item, order: i }));
