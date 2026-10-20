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


    { key: 'hero_chips', group: 'Homepage trust chips', label: 'Chips under the headline (comma separated, keep them true)', type: 'text', value: 'Free to start, ATS-friendly templates, For office, factory and skilled jobs' },

    { key: 'career_title', group: 'Career section', label: 'Heading', type: 'text', value: 'Grow your career, not just your resume' },
    { key: 'career_text', group: 'Career section', label: 'Sub-heading', type: 'textarea', value: 'Find what to learn next, prepare for interviews, and check pay and employers before you apply. All free to read.' },
    { key: 'career_chips', group: 'Career section', label: 'Popular searches (comma separated)', type: 'text', value: 'Full Stack Developer, Frontend Developer, SQL Developer, DevOps Engineer, Data Analyst, React' },

    { key: 'why_title', group: 'Why use us section', label: 'Heading', type: 'text', value: 'Why job seekers use Prime Resume AI' },
    { key: 'faq_1_q', group: 'FAQ', label: 'Question 1', type: 'text', value: 'Is Prime Resume AI free?' },
    { key: 'faq_1_a', group: 'FAQ', label: 'Answer 1', type: 'textarea', value: 'Yes. You can build a resume and download it for free. Some extras may need an account.' },
    { key: 'faq_2_q', group: 'FAQ', label: 'Question 2', type: 'text', value: 'Are the resume templates ATS-friendly?' },
    { key: 'faq_2_a', group: 'FAQ', label: 'Answer 2', type: 'textarea', value: 'Yes. The templates use clean, single-flow layouts that applicant tracking systems can parse. You can also run your resume through the free ATS checker.' },
    { key: 'faq_3_q', group: 'FAQ', label: 'Question 3', type: 'text', value: 'Can I use it if I have no office experience?' },
    { key: 'faq_3_a', group: 'FAQ', label: 'Answer 3', type: 'textarea', value: 'Yes. It supports factory, trade, driving, retail and other skilled jobs, and fresher resumes with no work history.' },
    { key: 'faq_4_q', group: 'FAQ', label: 'Question 4', type: 'text', value: 'Does the AI write my resume for me?' },
    { key: 'faq_4_a', group: 'FAQ', label: 'Answer 4', type: 'textarea', value: 'It suggests wording for your summary and bullet points. You review and edit every line before you download.' },
    { key: 'faq_5_q', group: 'FAQ', label: 'Question 5', type: 'text', value: 'How are salary figures and company reviews checked?' },
    { key: 'faq_5_a', group: 'FAQ', label: 'Answer 5', type: 'textarea', value: 'They are shared by members and reviewed before they appear. A salary range or an average rating is shown only after at least three reports agree.' },
    { key: 'faq_6_q', group: 'FAQ', label: 'Question 6', type: 'text', value: 'Where can I find interview questions?' },
    { key: 'faq_6_a', group: 'FAQ', label: 'Answer 6', type: 'textarea', value: 'Under Jobs, Interview questions: questions for freshers and experienced candidates with model answers.' },

    { key: 'cta_text', group: 'Bottom call to action', label: 'Message', type: 'textarea', value: 'Build a Professional Resume That Help You Stand Out and Get Hired' },
    { key: 'cta_button', group: 'Bottom call to action', label: 'Button text', type: 'text', value: 'Get Started' },

    { key: 'contact_email', group: 'Contact page', label: 'Email', type: 'text', value: 'support@primeresumeai.com' },
    { key: 'contact_phone', group: 'Contact page', label: 'Phone', type: 'text', value: '+91 7976204889' },
    { key: 'contact_address', group: 'Contact page', label: 'Address', type: 'text', value: 'New Delhi, India' },

    // Managed from Admin > Appearance, not from the homepage text page.
    { key: 'theme_primary', group: 'Appearance', label: 'Main colour', type: 'color', value: '#00a63e', hidden: true },
    { key: 'feature_cover_letter', group: 'Appearance', label: 'Show the Cover Letter button in the resume builder', type: 'toggle', value: 'false', hidden: true },
];

export const SITE_DEFAULTS = Object.fromEntries(SITE_FIELDS.map((f) => [f.key, f.value]));
