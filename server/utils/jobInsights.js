// Original, per-job guidance built from the posting itself (no AI call, no cost).
// Everything is derived from the job's own title, location and text, so each page differs.

const SKILLS = [
    ['JavaScript', /\bjavascript\b/i], ['TypeScript', /\btypescript\b/i], ['React', /\breact(\.js|js)?\b/i], ['Angular', /\bangular\b/i], ['Vue', /\bvue(\.js|js)?\b/i],
    ['Node.js', /\bnode(\.js|js)?\b/i], ['Express', /\bexpress(\.js)?\b/i], ['Next.js', /\bnext\.?js\b/i], ['HTML/CSS', /\b(html5?|css3?)\b/i], ['Tailwind', /\btailwind\b/i],
    ['Python', /\bpython\b/i], ['Django', /\bdjango\b/i], ['Flask', /\bflask\b/i], ['FastAPI', /\bfastapi\b/i], ['Java', /\bjava\b(?!script)/i], ['Spring Boot', /\bspring( boot)?\b/i],
    ['Kotlin', /\bkotlin\b/i], ['Swift', /\bswift\b/i], ['Go', /\b(golang|go (lang|developer|services))\b/i], ['Rust', /\brust\b/i], ['C++', /c\+\+/i], ['C#', /c#|\.net\b/i],
    ['PHP', /\bphp\b/i], ['Laravel', /\blaravel\b/i], ['Ruby on Rails', /\brails\b/i], ['Scala', /\bscala\b/i],
    ['SQL', /\bsql\b/i], ['PostgreSQL', /\bpostgres(ql)?\b/i], ['MySQL', /\bmysql\b/i], ['MongoDB', /\bmongo(db)?\b/i], ['Redis', /\bredis\b/i], ['Elasticsearch', /\belastic(search)?\b/i],
    ['Kafka', /\bkafka\b/i], ['GraphQL', /\bgraphql\b/i], ['REST APIs', /\brest(ful)?( api)?s?\b/i], ['Microservices', /\bmicroservices?\b/i],
    ['AWS', /\baws\b|amazon web services/i], ['Azure', /\bazure\b/i], ['Google Cloud', /\b(gcp|google cloud)\b/i], ['Docker', /\bdocker\b/i], ['Kubernetes', /\bkubernetes|\bk8s\b/i],
    ['Terraform', /\bterraform\b/i], ['CI/CD', /\bci\/cd\b|continuous (integration|delivery)/i], ['Linux', /\blinux\b/i], ['Git', /\bgit(hub)?\b/i],
    ['Machine learning', /machine learning|\bml\b/i], ['Deep learning', /deep learning/i], ['LLMs', /\bllms?\b|large language model|generative ai/i], ['TensorFlow', /\btensorflow\b/i], ['PyTorch', /\bpytorch\b/i],
    ['Data analysis', /data analy(sis|tics)/i], ['Tableau', /\btableau\b/i], ['Power BI', /power ?bi\b/i], ['Excel', /\bexcel\b/i], ['Spark', /\bspark\b/i], ['Airflow', /\bairflow\b/i], ['Snowflake', /\bsnowflake\b/i],
    ['Figma', /\bfigma\b/i], ['UX research', /\bux research|user research/i], ['Product roadmap', /\broadmap/i], ['A/B testing', /a\/b test/i], ['Agile', /\bagile|scrum\b/i], ['Jira', /\bjira\b/i],
    ['SEO', /\bseo\b/i], ['Content marketing', /content (marketing|strategy)/i], ['Salesforce', /\bsalesforce\b/i], ['CRM', /\bcrm\b/i], ['Account management', /account management/i],
    ['Customer support', /customer (support|success|service)/i], ['Stakeholder management', /stakeholder/i], ['Communication', /communication skills/i], ['Leadership', /\bleadership|mentor/i],
    ['Security', /\b(security|infosec|owasp)\b/i], ['Testing', /\b(unit|integration|automated|qa) test|test automation|\bselenium|\bcypress|\bjest\b/i], ['Android', /\bandroid\b/i], ['iOS', /\bios\b/i], ['React Native', /react native/i], ['Flutter', /\bflutter\b/i],
];

const FAMILIES = [
    ['data', /data (scientist|engineer|analyst)|machine learning|\bml\b|analytics|\bbi\b|\bdba\b/i],
    ['design', /designer|\bux\b|\bui\b|\bdesign\b/i],
    ['product', /product (manager|owner|lead)|program manager|project manager/i],
    ['devops', /devops|\bsre\b|platform engineer|infrastructure|cloud engineer|site reliability/i],
    ['engineering', /engineer|developer|programmer|architect|\bsde\b|software/i],
    ['sales', /sales|business development|account (executive|manager)|\bbdr\b|\bsdr\b|customer success/i],
    ['marketing', /marketing|seo|content|growth|brand|social media/i],
    ['support', /support|operations|coordinator|assistant|admin|office|hr\b|recruiter|talent/i],
];

const LEVELS = [
    ['Intern / trainee', /\b(intern|internship|trainee|apprentice)\b/i],
    ['Entry level', /\b(junior|jr\.?|graduate|entry[- ]level|fresher|associate)\b/i],
    ['Leadership', /\b(head of|director|vp\b|vice president|chief|principal|staff|engineering manager|team lead|tech lead|lead)\b/i],
    ['Senior', /\bsenior|sr\.?\b/i],
];

const TIPS = {
    engineering: ['Pick two or three projects that use the technologies named in this posting and describe what you built and its result in one line each.', 'Be ready to explain your own code: why you chose a design, what went wrong and how you fixed it.', 'Practise the basics the role needs (data structures, API design, debugging) and keep a link to your code on GitHub.'],
    devops: ['Describe systems you kept running: uptime, deploy frequency, cost saved or incidents reduced.', 'Be ready to talk through an outage you handled, step by step.', 'Show hands-on use of the tools listed here, not just names on a list.'],
    data: ['Lead with the question you answered and the decision your analysis changed, then the tools you used.', 'Prepare to explain one dataset you cleaned and what you found.', 'Show numbers: accuracy, time saved, revenue or cost impact.'],
    design: ['Link a portfolio with two or three case studies: the problem, your process and the outcome.', 'Be ready to explain a design decision you changed after user feedback.', 'Mention the tools you use (Figma, prototyping, research methods) by name.'],
    product: ['Write bullets that show outcomes you owned: users, revenue, retention or time to launch.', 'Be ready to explain how you decide what to build first and what to cut.', 'Show you can work with engineers, designers and customers.'],
    sales: ['Use numbers: quota reached, deals closed, pipeline built, accounts grown.', 'Show you understand the customers this company sells to.', 'Be ready to describe how you handle a lost deal.'],
    marketing: ['Show results with numbers: traffic, leads, signups or revenue from campaigns you ran.', 'Link two or three pieces of your work.', 'Name the channels and tools you have used.'],
    support: ['Show reliability and speed with examples: tickets handled, processes you improved, people you helped.', 'Mention the tools and systems you already know.', 'Be ready to describe a difficult situation you resolved calmly.'],
    other: ['Match the words in this posting to your real experience and use the same terms in your resume.', 'Show results with numbers wherever you honestly can.', 'Keep your resume to the most relevant experience for this role.'],
};

const list = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

export const jobInsights = (job) => {
    const title = String(job.title || '');
    const text = `${title}\n${job.description || ''}`;
    const skills = SKILLS.filter(([, rx]) => rx.test(text)).map(([n]) => n).slice(0, 14);
    const family = (FAMILIES.find(([, rx]) => rx.test(title)) || FAMILIES.find(([, rx]) => rx.test(text)) || ['other'])[0];
    const level = (LEVELS.find(([, rx]) => rx.test(title)) || [''])[0];
    const yrs = [...text.matchAll(/(\d{1,2})\s*(?:\+|-\s*\d{1,2}\s*)?\s*(?:years?|yrs)\b/gi)].map((m) => +m[1]).filter((n) => n > 0 && n < 25);
    const years = yrs.length ? Math.min(...yrs) : null;
    const where = job.remote ? 'remote' : job.location || '';

    const lines = [];
    lines.push(`${job.company} is hiring for the role of ${title}${where ? (job.remote ? ' (remote)' : ` in ${job.location}`) : ''}.`);
    if (level) lines.push(`The title points to a ${level.toLowerCase()} role.`);
    if (years) lines.push(`The posting asks for about ${years}+ years of experience.`);
    if (skills.length) lines.push(`It mentions ${list(skills.slice(0, 6))}${skills.length > 6 ? ' and more' : ''}.`);
    const summary = lines.join(' ');

    const tips = [...TIPS[family]];
    if (skills.length >= 3) tips.unshift(`Use these exact words in your resume where they are true for you: ${list(skills.slice(0, 5))}. Applicant tracking systems match on them.`);
    if (years && years >= 3) tips.push(`The posting asks for ${years}+ years, so put your most relevant experience at the top.`);

    const faqs = [
        { q: `What does ${job.company} look for in a ${title}?`, a: skills.length ? `This posting mentions ${list(skills.slice(0, 8))}${years ? ` and about ${years}+ years of experience` : ''}. Read the full description above for the exact requirements.` : `Read the full description above for the exact requirements. Match the words it uses to your own experience.` },
        { q: `Is this ${title} job remote?`, a: job.remote ? `Yes, the listing says it is remote${job.location && !/^remote$/i.test(job.location) ? ` (${job.location})` : ''}. Check the employer's page for any country limits.` : job.location ? `The listing gives the location as ${job.location}. Check the employer's page to see if remote or hybrid work is allowed.` : `The listing does not state a location. Check the employer's page.` },
        { q: 'How do I apply?', a: `Use the Apply button. It opens the application on ${job.company}'s own website, so your application goes straight to the employer. Never pay money to apply for a job.` },
        { q: 'How can I check my resume for this job?', a: `Use "Check my resume for this job". It compares your resume with this posting and lists the keywords you are missing, so you can fix them before you apply.` },
    ];
    return { summary, skills, level, years, family, tips: tips.slice(0, 5), faqs };
};
