// The menu the site shipped with. Each has a stable `key` so "Restore defaults" can
// bring back one that was deleted without duplicating the ones that still exist.
// Keep in sync with client/src/utils/menu.js (the offline fallback).
export const MENU_LOCATIONS = ['header', 'footer_product', 'footer_resources', 'footer_legal'];
// Icons the admin can pick for a sub-menu link (client/src/utils/menuIcons.js draws them).
export const MENU_ICONS = ['sparkles', 'file-text', 'award', 'briefcase', 'graduation-cap', 'route', 'users', 'search', 'star', 'shield-check', 'layout', 'book-open', 'wand', 'circle-check', 'lightbulb', 'trending-up', 'mail', 'list-checks', 'linkedin', 'scale', 'message-square', 'file-check', 'target', 'zoom-in', 'file-image', 'code'];

const RAW_MENU = [
    { key: 'h-home', location: 'header', label: 'Home', url: '/' },
    { key: 'h-builder', location: 'header', label: 'Resume', url: '/app' },
    { key: 'h-products', location: 'header', label: 'Tools', url: '/products' },
    { key: 'h-learn', location: 'header', label: 'Learn', url: '/learn' },
    { key: 'h-jobs', location: 'header', label: 'Jobs', url: '/jobs' },
    { key: 'h-blog', location: 'header', label: 'Blog', url: '/blog' },
    // sub-menus: `parentKey` is the key of the top-level item they drop down from
    { key: 'h-builder-app', location: 'header', label: 'Resume builder', url: '/app', icon: 'sparkles', description: 'Build, edit and download an ATS-friendly resume', parentKey: 'h-builder' },
    { key: 'h-builder-cv', location: 'header', label: 'CV builder', url: '/cv-builder', icon: 'file-text', description: 'A tailored CV from your real details', parentKey: 'h-builder' },
    { key: 'h-builder-templates', location: 'header', label: 'Templates', url: '/templates', icon: 'layout', description: 'ATS-friendly designs to start from', parentKey: 'h-builder' },
    { key: 'h-builder-examples', location: 'header', label: 'Examples', url: '/examples', icon: 'award', description: 'Sample resumes and CVs that pass the automatic ATS checks', parentKey: 'h-builder' },
    { key: 'h-builder-ats', location: 'header', label: 'ATS checker', url: '/features/ats-checker', icon: 'file-check', description: 'Upload a resume and get a score with fixes', parentKey: 'h-builder' },
    { key: 'h-builder-match', location: 'header', label: 'Job match', url: '/resume-job-description-matcher', icon: 'target', description: 'See which job keywords your resume lacks', parentKey: 'h-builder' },
    { key: 'h-products-all', location: 'header', label: 'All free tools', url: '/products', icon: 'layout', description: 'Every tool in one place, with search', parentKey: 'h-products' },
    { key: 'h-products-bullets', location: 'header', label: 'Resume bullet improver', url: '/products/resume-bullet-improver', icon: 'list-checks', description: 'Make weak resume lines clear and strong', parentKey: 'h-products' },
    { key: 'h-products-cover', location: 'header', label: 'Cover letter generator', url: '/products/cover-letter-generator', icon: 'mail', description: 'A short, honest draft for any job advert', parentKey: 'h-products' },
    { key: 'h-products-mock', location: 'header', label: 'Mock interview practice', url: '/products/mock-interview-practice', icon: 'message-square', description: 'Answer real questions and get feedback', parentKey: 'h-products' },
    { key: 'h-products-playground', location: 'header', label: 'Code playground', url: '/products/code-playground', icon: 'code', description: 'Write React or Angular and see it run', parentKey: 'h-products' },
    { key: 'h-products-enhancer', location: 'header', label: 'Image enhancer', url: '/products/image-enhancer', icon: 'zoom-in', description: 'Sharpen photos and enlarge them to 4K or 8K', parentKey: 'h-products' },
    { key: 'h-products-converter', location: 'header', label: 'Image to PDF, Word, text', url: '/products/image-converter', icon: 'file-image', description: 'Pictures to one PDF, Word or text file', parentKey: 'h-products' },
    { key: 'h-learn-tutorials', location: 'header', label: 'Tutorials', url: '/learn', parentKey: 'h-learn' },
    { key: 'h-learn-roadmaps', location: 'header', label: 'Roadmaps', url: '/roadmaps', parentKey: 'h-learn' },
    { key: 'h-learn-interview', location: 'header', label: 'Interview questions', url: '/jobs/interview-questions', parentKey: 'h-learn' },
    { key: 'h-jobs-browse', location: 'header', label: 'Browse jobs', url: '/jobs', parentKey: 'h-jobs' },
    { key: 'h-jobs-salaries', location: 'header', label: 'Salaries', url: '/jobs/salaries', parentKey: 'h-jobs' },
    { key: 'h-jobs-reviews', location: 'header', label: 'Company reviews', url: '/jobs/company-reviews', parentKey: 'h-jobs' },

    { key: 'fp-home', location: 'footer_product', label: 'Home', url: '/' },
    { key: 'fp-support', location: 'footer_product', label: 'Support', url: '/' },
    { key: 'fp-pricing', location: 'footer_product', label: 'Pricing', url: '/' },
    { key: 'fp-affiliate', location: 'footer_product', label: 'Affiliate', url: '/' },

    { key: 'fr-templates', location: 'footer_resources', label: 'Templates', url: '/templates' },
    { key: 'fr-ats', location: 'footer_resources', label: 'ATS Checker', url: '/features/ats-checker' },
    { key: 'fr-cv', location: 'footer_resources', label: 'CV Builder', url: '/cv-builder' },
    { key: 'fr-examples', location: 'footer_resources', label: '100/100 Resume Examples', url: '/examples' },
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


// Explicit order so the header always reads Home, Resume, Tools, Learn, Jobs, Blog and every dropdown keeps its own order.
// (Footer items keep the order they were listed in.)
export const DEFAULT_MENU = (() => {
    const tops = RAW_MENU.filter((d) => d.location === 'header' && !d.parentKey);
    const topOrder = Object.fromEntries(tops.map((d, i) => [d.key, i + 1]));
    const seen = {};
    return RAW_MENU.map((d, i) => {
        if (d.location !== 'header') return { ...d, order: 100 + i };
        if (!d.parentKey) return { ...d, order: topOrder[d.key] };
        seen[d.parentKey] = (seen[d.parentKey] || 0) + 1;
        return { ...d, order: topOrder[d.parentKey] + 0.01 * seen[d.parentKey] };
    });
})();
