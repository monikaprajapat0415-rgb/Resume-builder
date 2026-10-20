// The menu the site shipped with. Each has a stable `key` so "Restore defaults" can
// bring back one that was deleted without duplicating the ones that still exist.
// Keep in sync with client/src/utils/menu.js (the offline fallback).
export const MENU_LOCATIONS = ['header', 'footer_product', 'footer_resources', 'footer_legal'];

export const DEFAULT_MENU = [
    { key: 'h-home', location: 'header', label: 'Home', url: '/' },
    { key: 'h-features', location: 'header', label: 'Features', url: '/features' },
    { key: 'h-testimonials', location: 'header', label: 'Testimonials', url: '/#testimonials' },
    { key: 'h-templates', location: 'header', label: 'Templates', url: '/templates' },
    { key: 'h-cv', location: 'header', label: 'CV Builder', url: '/cv-builder' },
    { key: 'h-products', location: 'header', label: 'Products', url: '/products' },
    { key: 'h-blog', location: 'header', label: 'Blog', url: '/blog' },
    { key: 'h-learn', location: 'header', label: 'Learn', url: '/learn' },
    { key: 'h-jobs', location: 'header', label: 'Jobs', url: '/jobs' },
    // sub-menus: `parentKey` is the key of the top-level item they drop down from
    { key: 'h-learn-tutorials', location: 'header', label: 'Tutorials', url: '/learn', parentKey: 'h-learn' },
    { key: 'h-learn-roadmaps', location: 'header', label: 'All roadmaps', url: '/roadmaps', parentKey: 'h-learn' },
    { key: 'h-learn-roles', location: 'header', label: 'Role roadmaps', url: '/roadmaps?kind=role', parentKey: 'h-learn' },
    { key: 'h-learn-tech', location: 'header', label: 'Technology roadmaps', url: '/roadmaps?kind=technology', parentKey: 'h-learn' },
    { key: 'h-learn-career', location: 'header', label: 'Career paths', url: '/roadmaps?kind=career', parentKey: 'h-learn' },
    { key: 'h-jobs-browse', location: 'header', label: 'Browse jobs', url: '/jobs', parentKey: 'h-jobs' },
    { key: 'h-jobs-interview', location: 'header', label: 'Interview questions', url: '/jobs/interview-questions', parentKey: 'h-jobs' },
    { key: 'h-jobs-salaries', location: 'header', label: 'Salaries', url: '/jobs/salaries', parentKey: 'h-jobs' },
    { key: 'h-jobs-reviews', location: 'header', label: 'Company reviews', url: '/jobs/company-reviews', parentKey: 'h-jobs' },
    { key: 'h-contact', location: 'header', label: 'Contact Us', url: '/#contact-us' },

    { key: 'fp-home', location: 'footer_product', label: 'Home', url: '/' },
    { key: 'fp-support', location: 'footer_product', label: 'Support', url: '/' },
    { key: 'fp-pricing', location: 'footer_product', label: 'Pricing', url: '/' },
    { key: 'fp-affiliate', location: 'footer_product', label: 'Affiliate', url: '/' },

    { key: 'fr-templates', location: 'footer_resources', label: 'Templates', url: '/templates' },
    { key: 'fr-ats', location: 'footer_resources', label: 'ATS Checker', url: '/features/ats-checker' },
    { key: 'fr-cv', location: 'footer_resources', label: 'CV Builder', url: '/cv-builder' },
    { key: 'fr-match', location: 'footer_resources', label: 'Job Match Tool', url: '/resume-job-description-matcher' },
    { key: 'fr-products', location: 'footer_resources', label: 'Products', url: '/products' },
    { key: 'fr-blog', location: 'footer_resources', label: 'Blog', url: '/blog' },
    { key: 'fr-learn', location: 'footer_resources', label: 'Learn', url: '/learn' },
    { key: 'fr-roadmaps', location: 'footer_resources', label: 'Roadmaps', url: '/roadmaps' },
    { key: 'fr-interview', location: 'footer_resources', label: 'Interview Questions', url: '/jobs/interview-questions' },
    { key: 'fr-salaries', location: 'footer_resources', label: 'Salaries', url: '/jobs/salaries' },
    { key: 'fr-reviews', location: 'footer_resources', label: 'Company Reviews', url: '/jobs/company-reviews' },
    { key: 'fr-jobs', location: 'footer_resources', label: 'Jobs', url: '/jobs' },
    { key: 'fr-hire', location: 'footer_resources', label: 'Hire Talent', url: '/hire' },
    { key: 'fr-contact', location: 'footer_resources', label: 'Contact', url: '/contact-us' },

    { key: 'fl-privacy', location: 'footer_legal', label: 'Privacy', url: '/privacy-policy' },
    { key: 'fl-terms', location: 'footer_legal', label: 'Terms', url: '/terms-and-conditions' },
].map((item, i) => ({ ...item, order: i }));
