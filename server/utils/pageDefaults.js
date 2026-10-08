// Starting content for the two built-in pages. Copied from the previous hard-coded
// pages; once saved from Admin > Pages the database copy is what visitors see.
// (The placeholder contact address support@yourapp.com was replaced with the real
// support address from the Contact page.)
export const DEFAULT_PAGES = [
    {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        description: "Read Prime Resume AI's Privacy Policy to learn how we collect, use, and protect your information when you use our resume builder.",
        system: true,
        content: [
        {
                "type": "heading",
                "text": "1. Introduction"
        },
        {
                "type": "paragraph",
                "text": "We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our Resume Builder platform."
        },
        {
                "type": "heading",
                "text": "2. Information We Collect"
        },
        {
                "type": "paragraph",
                "text": "We may collect personal information such as your name, email address, phone number, and resume data (education, experience, skills)."
        },
        {
                "type": "heading",
                "text": "3. How We Use Your Information"
        },
        {
                "type": "list",
                "items": [
                        "To provide and improve our services",
                        "To generate and store your resume",
                        "To communicate with you",
                        "To ensure platform security"
                ]
        },
        {
                "type": "heading",
                "text": "4. Data Sharing"
        },
        {
                "type": "paragraph",
                "text": "We do not sell or rent your personal data. Your information may be shared only when required by law or to provide our services (e.g., email delivery)."
        },
        {
                "type": "heading",
                "text": "5. Data Security"
        },
        {
                "type": "paragraph",
                "text": "We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure."
        },
        {
                "type": "heading",
                "text": "6. Cookies"
        },
        {
                "type": "paragraph",
                "text": "We may use cookies to enhance your experience, analyze usage, and improve performance."
        },
        {
                "type": "heading",
                "text": "7. Your Rights"
        },
        {
                "type": "paragraph",
                "text": "You have the right to access, update, or delete your personal data. You can contact us for any privacy-related requests."
        },
        {
                "type": "heading",
                "text": "8. Changes to This Policy"
        },
        {
                "type": "paragraph",
                "text": "We may update this Privacy Policy from time to time. Continued use of the service means you accept the updated policy."
        },
        {
                "type": "heading",
                "text": "9. Contact Us"
        },
        {
                "type": "paragraph",
                "text": "If you have any questions about this Privacy Policy, contact us at [support@primeresumeai.com](mailto:support@primeresumeai.com)."
        }
],
    },
    {
        slug: 'terms-and-conditions',
        title: 'Terms & Conditions',
        description: "Read the Terms & Conditions for using Prime Resume AI's resume builder platform.",
        system: true,
        content: [
        {
                "type": "heading",
                "text": "1. Introduction"
        },
        {
                "type": "paragraph",
                "text": "Welcome to our Resume Builder platform. By accessing or using our services, you agree to comply with and be bound by these Terms & Conditions."
        },
        {
                "type": "heading",
                "text": "2. Use of Service"
        },
        {
                "type": "paragraph",
                "text": "You agree to use our platform only for lawful purposes. You must not misuse the service or attempt to access it using unauthorized methods."
        },
        {
                "type": "heading",
                "text": "3. User Data"
        },
        {
                "type": "paragraph",
                "text": "You are responsible for the information you provide. We do not share your personal data with third parties without consent, except as required by law."
        },
        {
                "type": "heading",
                "text": "4. Intellectual Property"
        },
        {
                "type": "paragraph",
                "text": "All templates, designs, and content are the intellectual property of our platform. You may not copy or redistribute without permission."
        },
        {
                "type": "heading",
                "text": "5. Limitation of Liability"
        },
        {
                "type": "paragraph",
                "text": "We are not responsible for any damages resulting from the use of our service, including loss of data or job opportunities."
        },
        {
                "type": "heading",
                "text": "6. Termination"
        },
        {
                "type": "paragraph",
                "text": "We reserve the right to suspend or terminate your access if you violate these terms."
        },
        {
                "type": "heading",
                "text": "7. Changes to Terms"
        },
        {
                "type": "paragraph",
                "text": "We may update these Terms & Conditions at any time. Continued use of the service means you accept the updated terms."
        },
        {
                "type": "heading",
                "text": "8. Contact Us"
        },
        {
                "type": "paragraph",
                "text": "If you have any questions, contact us at [support@primeresumeai.com](mailto:support@primeresumeai.com)."
        }
],
    },
];
