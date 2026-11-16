const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'nextjs-course';
export const quizzes = {
  'what-is-nextjs-and-why-use-it': [
    Q('What is Next.js?', ['A framework built on top of React', 'A replacement for JavaScript', 'A database'], 0, 'Next.js adds routing, server rendering, data loading and tools around React.'),
    Q('Which problem does Next.js help with compared with a plain React app?', ['It can send finished HTML, which helps search engines and link previews', 'It removes the need for components', 'It makes browsers faster'], 0),
    Q('What should you know before learning Next.js?', ['React basics such as components, props, state and hooks', 'Only HTML', 'Python'], 0, 'Every Next.js page is made of React components.'),
  ],
  'rendering-explained-csr-ssr-ssg-isr': [
    Q('When is a page built with static site generation (SSG)?', ['At build time, before visitors arrive', 'On every visit', 'Only in the browser'], 0),
    Q('Which style builds the page on the server for each request?', ['SSR', 'SSG', 'CSR'], 0, 'Server-side rendering makes fresh HTML for every request.'),
    Q('What does ISR add to static pages?', ['A page can be refreshed in the background after a set time', 'It turns off caching', 'It moves rendering to the browser'], 0),
  ],
  'nextjs-architecture-app-router-vs-pages-router': [
    Q('Which folder does the App Router use?', ['app', 'pages', 'routes'], 0),
    Q('In the App Router, which file makes a folder reachable as a page?', ['page', 'index', 'main'], 0, 'The file must be named page, followed by the extension.'),
    Q('Why does this course teach the App Router?', ['It is the recommended choice for new projects', 'The Pages Router is deleted', 'It needs no React'], 0),
  ],
  'create-your-first-nextjs-app-and-folder-structure': [
    Q('Which Node.js version does Next.js 16 need?', ['20.9 or newer', '12', 'Any version'], 0),
    Q('What is the public folder for?', ['Files served as they are, such as images', 'Your page components', 'Installed packages'], 0),
    Q('Which command prepares the site for real visitors?', ['npm run build', 'npm run dev', 'npm install'], 0, 'npm run build makes the production build and prints the route list.'),
  ],
  'file-based-routing-pages-and-nested-routes': [
    Q('A folder app/about holds a file page.tsx. What address does it answer?', ['/about', '/app/about', '/page'], 0),
    Q('What happens if a folder has no page file?', ['It is not reachable as an address', 'It shows a blank page', 'The build stops'], 0),
    Q('Where would you put a page for /dashboard/settings?', ['app/dashboard/settings/page.tsx', 'app/settings-dashboard.tsx', 'pages/dashboard.tsx'], 0),
  ],
  'dynamic-routes-catch-all-and-optional-catch-all': [
    Q('Which folder name matches any single value in that position?', ['[slug]', '(slug)', '_slug'], 0),
    Q('Which route also matches /docs with nothing after it?', ['[[...slug]]', '[...slug]', '[slug]'], 0, 'The double brackets make the catch-all optional.'),
    Q('In Next.js 16, how do you read the params prop?', ['Await it, because it is a Promise', 'Read it directly as an object', 'Use localStorage'], 0),
  ],
  'route-groups-private-folders-and-project-organisation': [
    Q('Does the folder name (marketing) appear in the address?', ['No, it is only for organising files', 'Yes, as /marketing', 'Only in development'], 0),
    Q('What does a folder that starts with an underscore do?', ['It is private and never becomes a route', 'It becomes a page', 'It is deleted at build'], 0),
    Q('Two groups both contain an about page. What happens?', ['Both mean /about, so the build gives an error', 'Next.js merges them', 'The first one wins silently'], 0),
  ],
  'link-userouter-usepathname-and-usesearchparams': [
    Q('Why use Link instead of a plain a tag for links inside your site?', ['It moves between pages without a full reload and can prefetch', 'It makes the text bigger', 'It is required by HTML'], 0),
    Q('Which hook tells you the current path, such as /about?', ['usePathname', 'useSearchParams', 'useState'], 0),
    Q('A file that uses useRouter must start with which line?', ['use client', 'use server', 'use router'], 0),
  ],
  'redirects-not-found-loading-and-error-pages': [
    Q('Which file shows while a route waits for its data?', ['loading', 'error', 'template'], 0),
    Q('Why must error.tsx be a client component?', ['It needs the reset button, which runs in the browser', 'It uses a database', 'It runs only at build time'], 0),
    Q('In the lab, what status did an address with no matching folder return?', ['404', '200', '500'], 0, 'An address with no matching folder returned 404. A page that calls notFound while streaming can keep status 200.'),
  ],
  'server-components-vs-client-components-use-client': [
    Q('What can a Server Component do that a Client Component cannot?', ['Read a database directly and keep secrets on the server', 'Use useState', 'Handle onClick'], 0),
    Q('Where does the line use client go?', ['At the very top of the file', 'At the bottom', 'In next.config.ts'], 0),
    Q('Why place use client as low in the tree as possible?', ['Everything in that file and its imports is sent to the browser', 'It makes the page load slower on purpose', 'It is a style rule only'], 0),
  ],
  'layouts-templates-and-metadata': [
    Q('Which tags must the root layout contain?', ['html and body', 'head only', 'main only'], 0),
    Q('What is the difference between a layout and a template?', ['A layout is kept between pages, a template is created again on every visit', 'They are the same', 'A template wraps the whole site only'], 0),
    Q('How do you set a different title for a dynamic page?', ['Export generateMetadata', 'Edit package.json', 'Add a title tag in globals.css'], 0),
  ],
  'styling-global-css-modules-tailwind-styled-components': [
    Q('What is the benefit of a CSS Module?', ['Class names become unique, so styles do not clash', 'It runs on the server only', 'It replaces JavaScript'], 0),
    Q('Where should global CSS be imported?', ['In the root layout', 'In every component', 'In package.json'], 0),
    Q('Why does styled-components need extra care in the App Router?', ['It runs in the browser, so it needs Client Components and some setup', 'It cannot be installed', 'It is part of Next.js'], 0),
  ],
  'component-composition-and-passing-data': [
    Q('Which value can a Server Component pass to a Client Component as a prop?', ['A string or a number', 'A normal function', 'A class instance with methods'], 0, 'Props must be values that can be sent as a message.'),
    Q('What is children in a component?', ['Whatever is placed between the opening and closing tags', 'A hook', 'A CSS class'], 0),
    Q('Why pass only the needed field of a large object to a client component?', ['Everything passed in props is sent to the browser', 'Objects are not allowed', 'It makes the code shorter only'], 0),
  ],
};
