// Every homepage / contact text the admin can edit. Keep in sync with
// client/src/utils/siteContent.js (the offline fallback used if the API is down).
export const SITE_FIELDS = [
    { key: 'banner_show', group: 'Top banner', label: 'Show the banner', type: 'toggle', value: 'true' },
    { key: 'banner_badge', group: 'Top banner', label: 'Badge text', type: 'text', value: 'New' },
    { key: 'banner_text', group: 'Top banner', label: 'Banner message', type: 'text', value: 'AI Feature Added' },

    { key: 'hero_line1', group: 'Homepage headline', label: 'Headline, first part', type: 'text', value: 'Land your dream job with' },
    { key: 'hero_highlight', group: 'Homepage headline', label: 'Headline, highlighted words (green)', type: 'text', value: 'AI-powered' },
    { key: 'hero_line2', group: 'Homepage headline', label: 'Headline, last part', type: 'text', value: 'resumes.' },
    { key: 'hero_subtext', group: 'Homepage headline', label: 'Sub-heading', type: 'textarea', value: 'Create, edit, and download professional resumes with AI-powered assistance.' },
    { key: 'hero_button', group: 'Homepage headline', label: 'Main button text', type: 'text', value: 'Create my resume' },

    { key: 'cta_text', group: 'Bottom call to action', label: 'Message', type: 'textarea', value: 'Build a Professional Resume That Help You Stand Out and Get Hired' },
    { key: 'cta_button', group: 'Bottom call to action', label: 'Button text', type: 'text', value: 'Get Started' },

    { key: 'contact_email', group: 'Contact page', label: 'Email', type: 'text', value: 'support@primeresumeai.com' },
    { key: 'contact_phone', group: 'Contact page', label: 'Phone', type: 'text', value: '+91 7976204889' },
    { key: 'contact_address', group: 'Contact page', label: 'Address', type: 'text', value: 'New Delhi, India' },
];

export const SITE_DEFAULTS = Object.fromEntries(SITE_FIELDS.map((f) => [f.key, f.value]));
