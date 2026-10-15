// Quick-pick suggestions for the CV "Skills & extras" step. Suggestions are only ever *offered*: the user clicks the
// ones that are true for them, so nothing is added to a CV without their choice.
const g = (re, skills, certs = []) => ({ re, skills, certs })

export const ROLE_GROUPS = [
  g(/software|developer|programmer|full.?stack|front.?end|back.?end|web dev|engineer(?!ing manager)|sde|mern|java\b|python|react|node/i,
    ['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'MongoDB', 'REST APIs', 'Git', 'GitHub', 'Docker', 'AWS', 'Data Structures', 'Algorithms', 'Agile', 'Unit Testing', 'CI/CD'],
    ['AWS Certified Cloud Practitioner', 'Oracle Certified Java Programmer', 'Meta Front-End Developer', 'Microsoft Azure Fundamentals']),
  g(/data (analyst|scientist|engineer)|analytics|business intelligence|\bbi\b|machine learning|\bml\b|\bai\b/i,
    ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'Statistics', 'Data Visualization', 'Machine Learning', 'ETL', 'Data Cleaning', 'A/B Testing', 'Scikit-learn', 'Spark'],
    ['Google Data Analytics Certificate', 'Microsoft Power BI Data Analyst', 'AWS Certified Data Engineer']),
  g(/devops|cloud|sre|infrastructure|system admin|sysadmin|network/i,
    ['Linux', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'Git', 'Bash', 'Monitoring', 'Networking', 'Ansible'],
    ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator', 'CompTIA Network+']),
  g(/qa|test(er|ing)?|quality assurance|sdet/i,
    ['Manual Testing', 'Test Automation', 'Selenium', 'Cypress', 'Postman', 'API Testing', 'JIRA', 'Test Cases', 'Regression Testing', 'SQL', 'Agile'],
    ['ISTQB Foundation Level']),
  g(/design|ui|ux|graphic|creative/i,
    ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Wireframing', 'Prototyping', 'User Research', 'Typography', 'Design Systems', 'Visual Design', 'Usability Testing'],
    ['Google UX Design Certificate']),
  g(/market|seo|content|social media|brand|digital|copywrit/i,
    ['SEO', 'Content Marketing', 'Social Media Marketing', 'Google Analytics', 'Email Marketing', 'Copywriting', 'Google Ads', 'Campaign Management', 'Market Research', 'Canva', 'CRM', 'A/B Testing'],
    ['Google Analytics Certification', 'HubSpot Content Marketing Certification']),
  g(/sales|business development|account (manager|executive)|bdm|inside sales/i,
    ['Lead Generation', 'Negotiation', 'CRM', 'Salesforce', 'Client Relationship Management', 'Cold Calling', 'Pipeline Management', 'Presentation Skills', 'Account Management', 'Market Research'],
    ['Salesforce Certified Administrator']),
  g(/account(ant|ing)|financ|audit|tax|bookkeep|banking|investment/i,
    ['Tally', 'Excel', 'Financial Reporting', 'Accounts Payable', 'Accounts Receivable', 'GST', 'Budgeting', 'Financial Analysis', 'Reconciliation', 'SAP', 'QuickBooks', 'Auditing'],
    ['CFA Level I', 'Chartered Accountant (CA) Inter']),
  g(/\bhr\b|human resource|recruit|talent|people ops|payroll/i,
    ['Recruitment', 'Talent Acquisition', 'Onboarding', 'Employee Relations', 'HRIS', 'Payroll', 'Performance Management', 'Interviewing', 'Labor Law', 'Applicant Tracking Systems'],
    ['SHRM-CP', 'PHR Certification']),
  g(/project manag|program manag|scrum|product manag|product owner|delivery/i,
    ['Project Management', 'Agile', 'Scrum', 'JIRA', 'Stakeholder Management', 'Risk Management', 'Roadmapping', 'Budgeting', 'Sprint Planning', 'Requirement Gathering', 'Product Strategy'],
    ['PMP', 'Certified ScrumMaster (CSM)', 'PRINCE2 Foundation']),
  g(/customer (support|service|success)|support (executive|associate|engineer)|call cent|helpdesk|help desk|bpo/i,
    ['Customer Service', 'Communication', 'Problem Solving', 'Zendesk', 'Ticketing Systems', 'Conflict Resolution', 'CRM', 'Typing Speed', 'Email Support', 'Chat Support', 'Active Listening']),
  g(/nurs|health|medical|clinic|pharma|doctor|patient/i,
    ['Patient Care', 'Vital Signs Monitoring', 'Medical Records', 'Infection Control', 'Medication Administration', 'Electronic Health Records', 'Emergency Response', 'First Aid'],
    ['BLS Certification', 'ACLS Certification']),
  g(/teach|tutor|lecturer|professor|trainer|education/i,
    ['Lesson Planning', 'Classroom Management', 'Curriculum Development', 'Student Assessment', 'Public Speaking', 'Mentoring', 'Online Teaching', 'Differentiated Instruction'],
    ['TET / CTET', 'B.Ed']),
  g(/operation|supply chain|logistic|warehouse|procurement|purchas|inventory/i,
    ['Supply Chain Management', 'Inventory Management', 'Procurement', 'Vendor Management', 'ERP', 'SAP', 'Excel', 'Process Improvement', 'Logistics', 'Forecasting'],
    ['Six Sigma Green Belt']),
  g(/mechanical|civil|electrical|electronics|manufactur|production|autocad|site engineer/i,
    ['AutoCAD', 'SolidWorks', 'Quality Control', 'Project Planning', 'Technical Drawing', 'MS Project', 'Safety Standards', 'Maintenance', 'Estimation'],
    ['Six Sigma Green Belt']),
  g(/admin|office|secretary|receptionist|executive assistant|data entry|coordinator/i,
    ['MS Office', 'Excel', 'Data Entry', 'Typing', 'Scheduling', 'Record Keeping', 'Email Management', 'Communication', 'Time Management', 'Documentation']),
]

export const SOFT_SKILLS = ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Leadership', 'Adaptability', 'Critical Thinking', 'Attention to Detail']
export const COMMON_LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia', 'Spanish', 'French', 'German', 'Arabic']
export const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic']
export const OTHER_INFO_QUICK = ['Open to relocation', 'Available to join immediately', 'Willing to travel', 'Valid driving license', 'Open to remote work', 'Notice period: 30 days']
export const ACHIEVEMENT_EXAMPLES = ['Won 1st prize in a college hackathon', 'Employee of the Month', 'Scholarship / merit award', 'Published a paper or article', 'Led a student club or event', 'Top rank in a competition']
export const SUMMARY_QUICK = ['Looking for my first full-time role.', 'Open to relocation.', 'Strong communicator and quick learner.', 'Comfortable working in agile teams.']

const key = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9+#.]/g, '')
export const dictionary = () => {
  const all = new Map()
  ROLE_GROUPS.forEach((gr) => gr.skills.forEach((s) => all.set(key(s), s)))
  SOFT_SKILLS.forEach((s) => all.set(key(s), s))
  return all
}

const dedupe = (list, have) => {
  const seen = new Set(have.map(key)); const out = []
  list.forEach((s) => { const k = key(s); if (k && !seen.has(k)) { seen.add(k); out.push(s) } })
  return out
}

// Skills mentioned in the job description (dictionary skills + a few obvious tech tokens like "Node.js" or "C++").
export const skillsFromJd = (jd) => {
  if (!jd) return []
  const text = String(jd)
  const found = []
  dictionary().forEach((label) => {
    const esc = label.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
    if (new RegExp(`(^|[^A-Za-z0-9+#])${esc}($|[^A-Za-z0-9+#])`, 'i').test(text)) found.push(label)
  })
  return found
}

// Technologies the user typed into their projects: "React, Express, MongoDB" -> chips.
export const skillsFromInput = (input) => {
  const parts = [
    ...(input.projects || []).flatMap((p) => String(p.technologies || '').split(/[,;|/]/)),
  ].map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40)
  return parts
}

export const buildSkillSuggestions = ({ jobTitle, jd, input, have = [] }) => {
  const role = ROLE_GROUPS.filter((r) => r.re.test(`${jobTitle || ''}`)).flatMap((r) => r.skills)
  const roleFromJd = role.length ? [] : ROLE_GROUPS.filter((r) => r.re.test(`${jd || ''}`.slice(0, 600))).slice(0, 1).flatMap((r) => r.skills)
  const groups = [
    { id: 'yours', label: 'From your projects', items: dedupe(skillsFromInput(input), have) },
    { id: 'jd', label: 'Mentioned in the job description', items: dedupe(skillsFromJd(jd), have) },
  ]
  const used = new Set([...groups.flatMap((x) => x.items), ...have].map(key))
  const popular = dedupe([...role, ...roleFromJd], [...have]).filter((s) => !used.has(key(s))).slice(0, 14)
  groups.push({ id: 'role', label: jobTitle ? `Popular for ${jobTitle}` : 'Popular skills', items: popular })
  const soft = dedupe(SOFT_SKILLS, [...have, ...groups.flatMap((x) => x.items)])
  groups.push({ id: 'soft', label: 'Soft skills', items: soft })
  return groups.filter((x) => x.items.length)
}

export const certSuggestions = (jobTitle, jd, have = []) =>
  dedupe(ROLE_GROUPS.filter((r) => r.re.test(`${jobTitle || ''}`) || (!jobTitle && r.re.test(`${jd || ''}`.slice(0, 600)))).flatMap((r) => r.certs), have).slice(0, 6)

// "a, b\n- c • d" pasted in one go -> ['a','b','c','d']
export const splitPasted = (text) => String(text || '').split(/[\n,;•·|]+/).map((s) => s.replace(/^[\s\-–*\d.)]+/, '').trim()).filter(Boolean)
