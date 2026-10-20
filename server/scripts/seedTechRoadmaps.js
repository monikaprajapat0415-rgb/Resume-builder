// Role and technology roadmaps (Full Stack, Frontend, SQL Developer, React, Docker ...), built from reusable topic
// modules so every roadmap shows the stack end to end and the best places to learn each step.
// Safe to re-run: roadmaps that already exist (same slug) are left alone, so admin edits are never overwritten.
//   node scripts/seedTechRoadmaps.js [--replace]
// Learning links are well-known official or long-standing free sites. Run `node scripts/checkRoadmapLinks.js`
// now and then to find links that have moved.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Roadmap from '../models/Roadmap.js';

const R = (label, url, type = 'docs', free = true) => ({ label, url, type, free });
const L = (label, url) => ({ label, url });

// ---------------- topic modules ----------------
const M = {};
const mod = (key, layer, title, description, skills, tips, resources, links = []) => { M[key] = { layer, title, description, skills, tips, resources, links }; };

// -- fundamentals
mod('internet', 'Fundamentals', 'How the internet and the web work',
  'Before writing code, understand what happens when you open a web page: browsers, servers, DNS, HTTP requests and responses, and what a URL is made of. Everything else you learn sits on top of this.',
  ['HTTP and HTTPS', 'DNS', 'Browsers', 'Client and server'],
  ['Open your browser developer tools, go to the Network tab and watch the requests a page makes.'],
  [R('MDN: How the web works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development'), R('web.dev Learn', 'https://web.dev/learn', 'course'), R('Cloudflare: Learning Center', 'https://www.cloudflare.com/learning/', 'docs')]);
mod('cs-basics', 'Fundamentals', 'Programming and problem-solving basics',
  'Learn to think in steps: variables, conditions, loops, functions and how to break a big problem into small ones. A structured beginner course gives you the habit of solving problems on your own.',
  ['Variables and data types', 'Loops and conditions', 'Functions', 'Problem solving'],
  ['Type the examples yourself instead of copying them, and change them to see what breaks.'],
  [R('CS50: Introduction to Computer Science', 'https://cs50.harvard.edu/x/', 'course'), R('freeCodeCamp', 'https://www.freecodecamp.org/learn', 'course'), R('The Odin Project', 'https://www.theodinproject.com/', 'course')]);
mod('git', 'Fundamentals', 'Version control with Git and GitHub',
  'Git records the history of your code and lets teams work on the same project. Learn to commit, branch, merge, resolve conflicts and open a pull request on GitHub. Almost every software job expects it.',
  ['Git', 'GitHub', 'Branching and merging', 'Pull requests'],
  ['Put every practice project on GitHub. It doubles as your portfolio.'],
  [R('Pro Git book', 'https://git-scm.com/book/en/v2', 'book'), R('GitHub Skills', 'https://skills.github.com/', 'practice')]);
mod('linux-basics', 'Fundamentals', 'Linux and the command line',
  'Servers mostly run Linux. Learn to move around the file system, read and edit files, manage permissions and processes, and write small shell scripts.',
  ['Linux command line', 'File permissions', 'Processes', 'Shell scripting'],
  ['Use the terminal for everyday tasks for a few weeks and it will start to feel natural.'],
  [R('Linux Journey', 'https://linuxjourney.com/', 'course'), R('Bash reference manual', 'https://www.gnu.org/software/bash/manual/', 'docs')]);
mod('networking', 'Fundamentals', 'Networking basics',
  'Understand IP addresses, ports, TCP and UDP, DNS, firewalls, load balancers and how traffic gets from one machine to another. Cloud, DevOps and security work all depend on it.',
  ['IP addressing', 'TCP and UDP', 'DNS', 'Firewalls', 'Load balancing'],
  ['Draw the path of a request from your laptop to a website, step by step.'],
  [R('Cloudflare: Learning Center', 'https://www.cloudflare.com/learning/', 'docs'), R('MDN: HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', 'docs')]);
mod('dsa', 'Fundamentals', 'Data structures and algorithms',
  'Arrays, lists, hash maps, stacks, queues, trees, sorting and searching, and how to judge how fast code runs. Many technical interviews test this, and it improves how you design solutions.',
  ['Arrays and hash maps', 'Trees and graphs', 'Sorting and searching', 'Big-O thinking'],
  ['Solve a few problems regularly rather than many in one weekend.'],
  [R('NeetCode roadmap', 'https://neetcode.io/roadmap', 'practice'), R('LeetCode', 'https://leetcode.com/', 'practice'), R('CS50', 'https://cs50.harvard.edu/x/', 'course')]);

// -- frontend
mod('html', 'Frontend', 'HTML: structure of a web page',
  'HTML describes the content of a page: headings, paragraphs, links, images, lists, forms and tables. Learn semantic tags and accessibility basics so pages make sense to people, search engines and screen readers.',
  ['HTML', 'Semantic markup', 'Forms', 'Accessibility basics'],
  ['Build a simple page with no styling first. If it reads well plain, the structure is right.'],
  [R('MDN: HTML', 'https://developer.mozilla.org/en-US/docs/Web/HTML'), R('freeCodeCamp: Responsive Web Design', 'https://www.freecodecamp.org/learn', 'course')]);
mod('css', 'Frontend', 'CSS: layout and design',
  'CSS controls how a page looks: colours, fonts, spacing, Flexbox and Grid layouts and responsive design for phones and desktops. Add a utility framework such as Tailwind once the basics are clear.',
  ['CSS', 'Flexbox', 'CSS Grid', 'Responsive design', 'Tailwind CSS'],
  ['Test every page at phone width first. Most visitors are on phones.'],
  [R('MDN: CSS', 'https://developer.mozilla.org/en-US/docs/Web/CSS'), R('web.dev: Learn CSS', 'https://web.dev/learn/css', 'course'), R('Tailwind CSS docs', 'https://tailwindcss.com/docs')]);
mod('js', 'Frontend', 'JavaScript',
  'JavaScript makes pages interactive and also runs on servers. Learn the language properly: types, functions, scope, objects and arrays, the DOM, events, promises and async/await, and modules.',
  ['JavaScript', 'DOM and events', 'Promises and async/await', 'ES modules', 'Fetch API'],
  ['Build small things (a to-do list, a quiz, a weather widget) before jumping to a framework.'],
  [R('javascript.info', 'https://javascript.info/', 'course'), R('MDN: JavaScript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'), R('The Odin Project: JavaScript', 'https://www.theodinproject.com/', 'course')]);
mod('ts', 'Frontend', 'TypeScript',
  'TypeScript adds types to JavaScript so many mistakes are caught before the code runs. It is now common in frontend and Node.js teams. Learn basic types, interfaces, generics and how to type API data.',
  ['TypeScript', 'Interfaces and types', 'Generics'],
  ['Turn a small JavaScript project into TypeScript to learn quickly.'],
  [R('TypeScript documentation', 'https://www.typescriptlang.org/docs/'), R('TypeScript handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'book')]);
mod('react', 'Frontend', 'React',
  'React builds interfaces from reusable components. Learn components, props, state, hooks, forms, routing and how to fetch and show data from an API.',
  ['React', 'Components and props', 'State and hooks', 'React Router', 'Data fetching'],
  ['Build one project with real data and several pages, for example a job board or a recipe finder.'],
  [R('React documentation: Learn', 'https://react.dev/learn'), R('freeCodeCamp', 'https://www.freecodecamp.org/learn', 'course')]);
mod('nextjs', 'Frontend', 'Next.js and server-rendered React',
  'Next.js adds routing, server rendering and API routes to React. It matters when search visibility and fast first load are important, for example on marketing sites and blogs.',
  ['Next.js', 'Server-side rendering', 'Routing', 'SEO basics'],
  ['Compare the HTML your page returns with JavaScript turned off. That is what search engines see first.'],
  [R('Next.js Learn', 'https://nextjs.org/learn', 'course')]);
mod('angular', 'Frontend', 'Angular',
  'Angular is a full framework with TypeScript, components, services, routing, forms and dependency injection built in. Common in larger company projects.',
  ['Angular', 'Components and templates', 'Services and dependency injection', 'RxJS', 'Angular Router'],
  ['Get comfortable with TypeScript before you start. Angular uses it everywhere.'],
  [R('Angular tutorials', 'https://angular.dev/tutorials'), R('Angular documentation', 'https://angular.dev/overview')]);
mod('vue', 'Frontend', 'Vue.js',
  'Vue is a gentle, progressive framework. Learn templates, reactivity, components, the Composition API, routing and state with Pinia.',
  ['Vue.js', 'Reactivity', 'Composition API', 'Vue Router', 'Pinia'],
  ['Start with the official interactive tutorial, then build a small app of your own.'],
  [R('Vue tutorial', 'https://vuejs.org/tutorial/', 'course'), R('Vue guide', 'https://vuejs.org/guide/introduction.html')]);
mod('frontend-testing', 'Testing', 'Testing frontend code',
  'Write tests so changes do not break things: unit tests for functions and components, and a few end-to-end tests of the main user journeys.',
  ['Unit testing', 'Component testing', 'End-to-end testing'],
  ['Test behaviour a user would notice, not internal details.'],
  [R('Jest: Getting started', 'https://jestjs.io/docs/getting-started'), R('Playwright: Introduction', 'https://playwright.dev/docs/intro')]);
mod('perf-a11y', 'Frontend', 'Performance, accessibility and SEO',
  'Fast, accessible pages keep visitors and rank better. Learn Core Web Vitals, image and script loading, keyboard and screen-reader basics, and the metadata search engines read.',
  ['Core Web Vitals', 'Accessibility', 'Image optimisation', 'Technical SEO'],
  ['Run Lighthouse in Chrome on your own project and fix the first three issues it lists.'],
  [R('web.dev Learn', 'https://web.dev/learn', 'course'), R('MDN: Accessibility', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility')]);

// -- backend
mod('node', 'Backend', 'Node.js',
  'Node.js runs JavaScript on the server. Learn modules, the file system, environment variables, asynchronous code, and building a server that talks to a database.',
  ['Node.js', 'npm', 'Asynchronous programming', 'Environment variables'],
  ['Keep secrets such as API keys in environment variables, never in code you commit.'],
  [R('Node.js: Learn', 'https://nodejs.org/en/learn'), R('The Odin Project: NodeJS', 'https://www.theodinproject.com/', 'course')]);
mod('express', 'Backend', 'Express and building a web server',
  'Express is the most common Node.js web framework. Learn routing, middleware, request validation, error handling and serving JSON to a frontend.',
  ['Express.js', 'Routing and middleware', 'Validation', 'Error handling'],
  ['Return the right HTTP status codes. Clear errors save hours of debugging.'],
  [R('Express documentation', 'https://expressjs.com/')]);
mod('rest-api', 'Backend', 'REST APIs',
  'An API lets a frontend, a phone app or another system talk to your backend. Learn resources and HTTP methods, status codes, pagination, versioning and how to document an API. Add GraphQL later if you need it.',
  ['REST API design', 'JSON', 'HTTP methods and status codes', 'API documentation'],
  ['Test every endpoint with a tool such as Postman before building a frontend on it.'],
  [R('Postman Learning Center', 'https://learning.postman.com/', 'course'), R('RESTful API tutorial', 'https://restfulapi.net/', 'docs'), R('GraphQL: Learn', 'https://graphql.org/learn/')]);
mod('auth-security', 'Backend', 'Authentication and web security',
  'Learn how logins work (hashed passwords, sessions, tokens), how to restrict who can see what, and the common web attacks: injection, cross-site scripting and broken access control.',
  ['Authentication', 'JWT and sessions', 'Password hashing', 'OWASP Top 10', 'Input validation'],
  ['Never store plain-text passwords, and never trust data coming from the browser.'],
  [R('OWASP Top Ten', 'https://owasp.org/www-project-top-ten/'), R('PortSwigger Web Security Academy', 'https://portswigger.net/web-security', 'practice')]);
mod('caching-redis', 'Backend', 'Caching and Redis',
  'Caching keeps frequently used data in fast memory so your app answers quicker and your database works less. Learn when to cache, how long, and how to avoid showing stale data.',
  ['Caching', 'Redis', 'Cache invalidation'],
  ['Measure first. Cache only what is actually slow.'],
  [R('Redis documentation', 'https://redis.io/docs/')]);
mod('system-design', 'Backend', 'System design basics',
  'Learn how larger systems are put together: load balancers, caches, queues, databases and how to scale and keep them reliable. It also helps you explain your choices in interviews.',
  ['System design', 'Scalability', 'Load balancing', 'Message queues'],
  ['Practise explaining the design of a small system (a URL shortener) out loud.'],
  [R('System Design Primer', 'https://github.com/donnemartin/system-design-primer', 'book')]);
mod('python', 'Backend', 'Python',
  'Python is readable, popular and used for web, automation, data and AI. Learn the syntax, data structures, functions, files, errors, virtual environments and packages.',
  ['Python', 'Lists, dictionaries and sets', 'Functions and modules', 'Virtual environments'],
  ['Automate something boring in your own life. It keeps motivation high.'],
  [R('Python tutorial (official)', 'https://docs.python.org/3/tutorial/'), R('Automate the Boring Stuff with Python', 'https://automatetheboringstuff.com/', 'book')]);
mod('python-web', 'Backend', 'Python web frameworks',
  'Build web APIs and sites with a framework such as FastAPI, Flask or Django. Learn routing, templates or JSON responses, database access and authentication.',
  ['FastAPI', 'Flask', 'Django', 'REST APIs in Python'],
  ['Pick one framework and finish a project before comparing the others.'],
  [R('FastAPI tutorial', 'https://fastapi.tiangolo.com/tutorial/'), R('Django tutorial', 'https://docs.djangoproject.com/en/stable/intro/tutorial01/'), R('Flask quickstart', 'https://flask.palletsprojects.com/en/stable/quickstart/')]);
mod('java', 'Backend', 'Java',
  'Java is widely used for enterprise and Android back ends. Learn the syntax, object-oriented programming, collections, exceptions, streams and a build tool such as Maven or Gradle.',
  ['Java', 'Object-oriented programming', 'Collections', 'Exceptions', 'Maven or Gradle'],
  ['Write small console programs until classes and interfaces feel natural.'],
  [R('dev.java: Learn', 'https://dev.java/learn/'), R('MOOC.fi Java Programming', 'https://java-programming.mooc.fi/', 'course')]);
mod('spring-boot', 'Backend', 'Spring Boot',
  'Spring Boot is the standard way to build Java back ends: REST controllers, dependency injection, data access with JPA, configuration, security and testing.',
  ['Spring Boot', 'Spring Data JPA', 'Dependency injection', 'Spring Security'],
  ['Follow one official guide end to end, then rebuild it from memory.'],
  [R('Spring guides', 'https://spring.io/guides'), R('Spring Boot reference', 'https://docs.spring.io/spring-boot/index.html')]);
mod('csharp', 'Backend', 'C#',
  'C# is the main language of the .NET platform. Learn the syntax, classes, LINQ, collections, async/await and how to organise a project.',
  ['C#', 'Object-oriented programming', 'LINQ', 'async/await'],
  ['Use Visual Studio or VS Code and run small programs often.'],
  [R('C# documentation', 'https://learn.microsoft.com/en-us/dotnet/csharp/'), R('Microsoft Learn: C#', 'https://learn.microsoft.com/en-us/training/paths/get-started-with-csharp/', 'course')]);
mod('aspnet', 'Backend', 'ASP.NET Core',
  'ASP.NET Core builds web APIs and sites on .NET. Learn minimal APIs and controllers, dependency injection, Entity Framework Core, authentication and configuration.',
  ['ASP.NET Core', 'Entity Framework Core', 'Web API', 'Dependency injection'],
  ['Build a small API with a database and a login before anything bigger.'],
  [R('ASP.NET Core documentation', 'https://learn.microsoft.com/en-us/aspnet/core/'), R('Microsoft Learn: ASP.NET Core', 'https://learn.microsoft.com/en-us/training/paths/aspnet-core-minimal-api/', 'course')]);
mod('unit-testing', 'Testing', 'Unit and integration testing',
  'Automated tests catch mistakes early and let you change code with confidence. Learn to write unit tests, use mocks sensibly and test your API and database together.',
  ['Unit testing', 'Integration testing', 'Test-driven development'],
  ['Write a test for every bug you fix so it cannot come back unnoticed.'],
  [R('The Practical Test Pyramid', 'https://martinfowler.com/articles/practical-test-pyramid.html', 'book'), R('pytest documentation', 'https://docs.pytest.org/en/stable/'), R('JUnit 5 user guide', 'https://junit.org/junit5/docs/current/user-guide/')]);

// -- databases
mod('sql-basics', 'Database', 'SQL basics',
  'SQL is how you ask a relational database questions. Learn SELECT, WHERE, ORDER BY, GROUP BY, aggregate functions, joins and how to create, insert, update and delete data.',
  ['SQL', 'SELECT and WHERE', 'JOINs', 'GROUP BY and aggregates', 'INSERT, UPDATE, DELETE'],
  ['Practise on real-looking data. Write the query by hand before using any tool that writes it for you.'],
  [R('SQLBolt', 'https://sqlbolt.com/', 'practice'), R('SQLZoo', 'https://sqlzoo.net/', 'practice'), R('Mode: SQL tutorial', 'https://mode.com/sql-tutorial/', 'course')]);
mod('sql-advanced', 'Database', 'Advanced SQL and performance',
  'Go beyond the basics: subqueries, common table expressions, window functions, indexes, reading execution plans, transactions and stored procedures. This is what separates a SQL developer from a beginner.',
  ['Subqueries and CTEs', 'Window functions', 'Indexes', 'Query optimisation', 'Transactions', 'Stored procedures'],
  ['Learn to read an execution plan. It shows you why a query is slow.'],
  [R('PostgreSQL tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), R('Mode: Advanced SQL', 'https://mode.com/sql-tutorial/', 'course'), R('Use The Index, Luke', 'https://use-the-index-luke.com/', 'book')]);
mod('db-design', 'Database', 'Database design',
  'Good design prevents messy data. Learn tables, primary and foreign keys, relationships, normalisation, constraints and how to draw an entity-relationship diagram.',
  ['Database design', 'Normalisation', 'Primary and foreign keys', 'ER diagrams'],
  ['Sketch the tables on paper before creating them.'],
  [R('PostgreSQL: Data definition', 'https://www.postgresql.org/docs/current/ddl.html'), R('MySQL documentation', 'https://dev.mysql.com/doc/')]);
mod('rdbms', 'Database', 'A relational database in depth (PostgreSQL or MySQL)',
  'Pick one popular relational database and learn it well: installation, users and permissions, backups, data types, indexes and the tools that come with it. SQL Server and Oracle are common in larger companies, and the SQL skills transfer.',
  ['PostgreSQL', 'MySQL', 'Backups and restore', 'Users and permissions'],
  ['Practise a backup and a restore. You do not want to learn that during an emergency.'],
  [R('PostgreSQL documentation', 'https://www.postgresql.org/docs/'), R('MySQL reference manual', 'https://dev.mysql.com/doc/')]);
mod('mongodb', 'Database', 'MongoDB and document databases',
  'MongoDB stores flexible JSON-like documents. Learn collections, queries, indexes, the aggregation pipeline and how to model data when relations are not enforced for you.',
  ['MongoDB', 'Mongoose', 'Aggregation pipeline', 'Indexes', 'Data modelling'],
  ['Design documents around how the app reads them, and remember that indexes matter just as much as in SQL.'],
  [R('MongoDB University', 'https://learn.mongodb.com/', 'course'), R('MongoDB documentation', 'https://www.mongodb.com/docs/')]);

// -- devops and cloud
mod('docker', 'DevOps', 'Docker and containers',
  'A container packages an app with everything it needs so it runs the same everywhere. Learn images, containers, volumes, networks, Dockerfiles and Docker Compose.',
  ['Docker', 'Dockerfile', 'Docker Compose', 'Container networking'],
  ['Containerise one of your own projects end to end.'],
  [R('Docker: Get started', 'https://docs.docker.com/get-started/'), R('Play with Docker', 'https://labs.play-with-docker.com/', 'practice')]);
mod('ci-cd', 'DevOps', 'CI/CD and automation',
  'Continuous integration runs your tests on every change, and continuous delivery deploys safely. Learn pipelines, build artifacts, secrets and a simple release process, for example with GitHub Actions.',
  ['CI/CD', 'GitHub Actions', 'Automated deployment', 'Secrets management'],
  ['Make a pipeline that runs tests on every push to your project.'],
  [R('GitHub Actions documentation', 'https://docs.github.com/en/actions')]);
mod('kubernetes', 'DevOps', 'Kubernetes',
  'Kubernetes runs and scales containers across many machines. Learn pods, deployments, services, config, storage and how to debug a failing workload.',
  ['Kubernetes', 'Pods and deployments', 'Services and ingress', 'kubectl'],
  ['Learn Docker properly first. Kubernetes builds on it.'],
  [R('Kubernetes tutorials', 'https://kubernetes.io/docs/tutorials/'), R('Kubernetes basics', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/')]);
mod('terraform', 'DevOps', 'Infrastructure as code',
  'Describe servers, networks and databases in code so they can be reviewed, repeated and rolled back. Terraform is the most common tool; Ansible helps configure machines.',
  ['Terraform', 'Infrastructure as code', 'Ansible'],
  ['Create and destroy a small environment several times until it is boring.'],
  [R('Terraform tutorials', 'https://developer.hashicorp.com/terraform/tutorials'), R('Ansible documentation', 'https://docs.ansible.com/')]);
mod('monitoring', 'DevOps', 'Monitoring and logging',
  'You cannot fix what you cannot see. Learn metrics, logs, dashboards and alerts so you notice problems before users do.',
  ['Monitoring', 'Logging', 'Prometheus', 'Grafana', 'Alerting'],
  ['Alert on what users feel (errors and slowness), not on every small blip.'],
  [R('Prometheus overview', 'https://prometheus.io/docs/introduction/overview/'), R('Grafana tutorials', 'https://grafana.com/tutorials/')]);
mod('nginx', 'DevOps', 'Web servers and deployment',
  'Learn to put an app on a real server: a web server or reverse proxy such as nginx, HTTPS certificates, process managers and zero-downtime restarts.',
  ['nginx', 'Reverse proxy', 'HTTPS and certificates', 'Process managers'],
  ['Deploy one project to a small server of your own and keep it running for a month.'],
  [R('nginx beginner guide', 'https://nginx.org/en/docs/beginners_guide.html')]);
mod('cloud-aws', 'Cloud', 'Amazon Web Services (AWS)',
  'Learn the core services: compute (EC2, Lambda), storage (S3), databases (RDS, DynamoDB), networking (VPC), identity (IAM) and monitoring. Use the free tier and set a budget alert.',
  ['AWS', 'EC2 and Lambda', 'S3', 'IAM', 'VPC'],
  ['Set a billing alert before you create anything, and delete what you are not using.'],
  [R('AWS Skill Builder and training', 'https://aws.amazon.com/training/', 'course'), R('AWS documentation', 'https://docs.aws.amazon.com/')]);
mod('cloud-azure', 'Cloud', 'Microsoft Azure',
  'Learn the core Azure services: virtual machines, App Service, storage, databases, networking, identity and monitoring.',
  ['Azure', 'App Service', 'Azure Storage', 'Azure AD / Entra ID'],
  ['Choose one cloud first. The concepts carry over to the others.'],
  [R('Microsoft Learn: Azure', 'https://learn.microsoft.com/en-us/training/azure/', 'course'), R('Azure documentation', 'https://learn.microsoft.com/en-us/azure/')]);
mod('cloud-gcp', 'Cloud', 'Google Cloud',
  'Learn the core Google Cloud services: Compute Engine, Cloud Run, Cloud Storage, BigQuery, networking and identity.',
  ['Google Cloud', 'Cloud Run', 'BigQuery', 'Cloud Storage'],
  ['Use the free tier carefully and watch your spending.'],
  [R('Google Cloud: Learn', 'https://cloud.google.com/learn', 'course'), R('Google Cloud documentation', 'https://cloud.google.com/docs')]);

// -- testing / QA
mod('qa-fundamentals', 'Testing', 'Software testing fundamentals',
  'Learn what testing is for: test levels and types, writing clear test cases, finding and reporting bugs, and how testers work in agile teams.',
  ['Test cases', 'Bug reporting', 'Test planning', 'Agile testing'],
  ['A good bug report lets a stranger reproduce the problem in two minutes.'],
  [R('ISTQB glossary', 'https://glossary.istqb.org/'), R('Ministry of Testing', 'https://www.ministryoftesting.com/', 'course', false)]);
mod('api-testing', 'Testing', 'API testing',
  'Test endpoints directly: requests, responses, status codes, authentication and edge cases. Then automate those checks so they run on every change.',
  ['API testing', 'Postman', 'Test automation'],
  ['Check what happens with missing, wrong and very large input, not just good input.'],
  [R('Postman Learning Center', 'https://learning.postman.com/', 'course')]);
mod('e2e', 'Testing', 'End-to-end test automation',
  'Automate a real browser to test whole user journeys. Playwright and Selenium are common choices. Learn locators, waiting, test data and how to keep tests stable.',
  ['Playwright', 'Selenium', 'Locators', 'Page object pattern'],
  ['Keep end-to-end tests few and meaningful. Slow, flaky tests get ignored.'],
  [R('Playwright documentation', 'https://playwright.dev/docs/intro'), R('Selenium documentation', 'https://www.selenium.dev/documentation/')]);
mod('perf-testing', 'Testing', 'Performance testing',
  'Check how a system behaves under load: response times, error rates and limits. Learn to design a realistic load test and read the results.',
  ['Load testing', 'k6', 'Performance metrics'],
  ['Test against an environment that resembles production, and change one thing at a time.'],
  [R('k6 documentation', 'https://grafana.com/docs/k6/latest/')]);

// -- data
mod('excel', 'Data', 'Spreadsheets and Excel',
  'Most analysis starts in a spreadsheet. Learn formulas, lookups, pivot tables, charts, cleaning messy data and building a clear summary sheet.',
  ['Excel', 'Formulas', 'Pivot tables', 'Data cleaning', 'Charts'],
  ['Re-do a report you have already seen, from raw data, to check your numbers match.'],
  [R('Microsoft Excel support', 'https://support.microsoft.com/en-us/excel'), R('Google Sheets help', 'https://support.google.com/docs/')]);
mod('statistics', 'Data', 'Statistics for data work',
  'Learn averages and spread, distributions, sampling, correlation, hypothesis tests and how not to be fooled by a pattern that is only chance.',
  ['Descriptive statistics', 'Probability', 'Hypothesis testing', 'Correlation'],
  ['Always ask: how many data points is this based on?'],
  [R('Khan Academy: Statistics and probability', 'https://www.khanacademy.org/math/statistics-probability', 'course')]);
mod('python-data', 'Data', 'Python for data: pandas and NumPy',
  'Load, clean, reshape and summarise data with pandas and NumPy, and draw charts with Matplotlib or similar. Notebooks let you show your working.',
  ['pandas', 'NumPy', 'Data cleaning', 'Jupyter notebooks', 'Data visualisation'],
  ['Pick a public dataset you care about and publish a short write-up of what you found.'],
  [R('pandas: Getting started', 'https://pandas.pydata.org/docs/getting_started/index.html'), R('Kaggle Learn', 'https://www.kaggle.com/learn', 'course'), R('NumPy: Learn', 'https://numpy.org/learn/')]);
mod('dataviz-bi', 'Data', 'Dashboards and BI tools',
  'Turn data into dashboards people can use. Learn to choose the right chart, model data for reports, and build with Power BI or Tableau.',
  ['Power BI', 'Tableau', 'DAX basics', 'Dashboard design', 'Data storytelling'],
  ['A dashboard should answer a question. Start from the decision it supports.'],
  [R('Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/power-bi/', 'course'), R('Tableau training', 'https://www.tableau.com/learn/training', 'course')]);
mod('data-warehouse', 'Data', 'Data modelling and warehousing',
  'Learn how data is organised for reporting: facts and dimensions, star schemas, and the difference between a transactional database and a warehouse.',
  ['Data warehousing', 'Star schema', 'Dimensional modelling', 'ETL vs ELT'],
  ['Model a small business (a shop, a school) as a star schema on paper.'],
  [R('dbt documentation', 'https://docs.getdbt.com/'), R('Google BigQuery documentation', 'https://cloud.google.com/bigquery/docs')]);
mod('etl-airflow', 'Data', 'Pipelines and orchestration',
  'Pipelines move and transform data on a schedule. Learn to build reliable ones: extract, transform, load, handle failures and re-runs, and schedule them with a tool such as Apache Airflow.',
  ['ETL pipelines', 'Apache Airflow', 'dbt', 'Data quality checks'],
  ['Design every step so it can be safely re-run.'],
  [R('Apache Airflow documentation', 'https://airflow.apache.org/docs/'), R('dbt documentation', 'https://docs.getdbt.com/')]);
mod('spark-kafka', 'Data', 'Big data and streaming',
  'When data no longer fits on one machine, you need distributed tools: Apache Spark for large-scale processing and Apache Kafka for streams of events.',
  ['Apache Spark', 'Apache Kafka', 'Streaming', 'Parquet'],
  ['Learn why distributed processing is harder before reaching for it. Many jobs do not need it.'],
  [R('Apache Spark documentation', 'https://spark.apache.org/docs/latest/'), R('Apache Kafka documentation', 'https://kafka.apache.org/documentation/')]);
mod('ml-basics', 'AI and ML', 'Machine learning fundamentals',
  'Learn how models learn from data: supervised and unsupervised learning, training and test sets, overfitting, metrics, and how to use scikit-learn.',
  ['Machine learning', 'scikit-learn', 'Model evaluation', 'Feature engineering'],
  ['Spend more time understanding the data than choosing the model.'],
  [R('Google Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'course'), R('scikit-learn user guide', 'https://scikit-learn.org/stable/user_guide.html'), R('Kaggle Learn', 'https://www.kaggle.com/learn', 'course')]);
mod('deep-learning', 'AI and ML', 'Deep learning',
  'Neural networks power image, speech and language models. Learn the ideas, then use PyTorch or TensorFlow on a small project.',
  ['Neural networks', 'PyTorch', 'TensorFlow', 'Computer vision', 'Natural language processing'],
  ['Re-use pre-trained models before training your own.'],
  [R('fast.ai: Practical Deep Learning', 'https://course.fast.ai/', 'course'), R('DeepLearning.AI', 'https://www.deeplearning.ai/', 'course', false), R('Hugging Face Learn', 'https://huggingface.co/learn', 'course')]);
mod('mlops', 'AI and ML', 'Putting models into production',
  'A model is only useful when it runs reliably. Learn how to package, serve, monitor and update models, and how to track experiments and data versions.',
  ['Model deployment', 'Experiment tracking', 'Monitoring models', 'Rules of ML'],
  ['Start with a simple model in production before a complicated one in a notebook.'],
  [R('Google: Rules of Machine Learning', 'https://developers.google.com/machine-learning/guides/rules-of-ml')]);
mod('llm-apps', 'AI and ML', 'Building with large language models',
  'Learn to build features with LLMs: prompting, structured output, tool use, retrieval from your own documents, evaluation and cost and safety basics.',
  ['Prompt engineering', 'LLM APIs', 'Tool use', 'Retrieval (RAG)', 'Evaluation'],
  ['Test with real examples and keep a list of cases that must keep working as you change prompts.'],
  [R('Claude API documentation', 'https://docs.claude.com/'), R('Hugging Face Learn', 'https://huggingface.co/learn', 'course')],
  [L('Free AI tutorials on Learn', '/learn')]);

// -- mobile
mod('kotlin', 'Mobile', 'Kotlin',
  'Kotlin is the main language for Android. Learn syntax, null safety, classes, collections, lambdas and coroutines.',
  ['Kotlin', 'Null safety', 'Coroutines', 'Collections'],
  ['Use the online playground while you learn the syntax.'],
  [R('Kotlin documentation', 'https://kotlinlang.org/docs/getting-started.html'), R('Android Basics with Compose', 'https://developer.android.com/courses', 'course')]);
mod('android-ui', 'Mobile', 'Android apps with Jetpack Compose',
  'Build real Android apps: screens with Jetpack Compose, navigation, lifecycle, local storage with Room, and calling web APIs.',
  ['Android Studio', 'Jetpack Compose', 'Room database', 'Retrofit and APIs', 'Navigation'],
  ['Test on a real low-cost phone, not only the emulator.'],
  [R('Android Developers: Courses', 'https://developer.android.com/courses', 'course'), R('Jetpack Compose', 'https://developer.android.com/compose')]);
mod('flutter', 'Mobile', 'Flutter and Dart',
  'Flutter builds apps for Android, iOS and the web from one codebase. Learn Dart, widgets, layout, state management, navigation and calling APIs.',
  ['Flutter', 'Dart', 'Widgets', 'State management'],
  ['Build and finish one complete app before starting another.'],
  [R('Flutter documentation', 'https://docs.flutter.dev/'), R('Dart language tour', 'https://dart.dev/language')]);
mod('react-native', 'Mobile', 'React Native',
  'React Native builds mobile apps with React and JavaScript. Learn core components, navigation, state, device features and how to build and test on a phone.',
  ['React Native', 'Expo', 'Navigation', 'Native device features'],
  ['Know React first. It makes this much easier.'],
  [R('React Native documentation', 'https://reactnative.dev/docs/getting-started'), R('Expo documentation', 'https://docs.expo.dev/')]);
mod('swift-ios', 'Mobile', 'Swift and SwiftUI for iPhone',
  'Swift is the language for Apple platforms and SwiftUI the modern way to build their interfaces. You need a Mac to build and publish iOS apps.',
  ['Swift', 'SwiftUI', 'Xcode', 'iOS app lifecycle'],
  ['Follow Apple’s own tutorials first. They are well written.'],
  [R('Swift: Getting started', 'https://www.swift.org/getting-started/'), R('Develop in Swift tutorials', 'https://developer.apple.com/tutorials/app-dev-training/')]);
mod('publishing', 'Mobile', 'Testing and publishing an app',
  'Learn to test on real devices, handle permissions and offline use, and publish to the Play Store or App Store, including the review rules and privacy information.',
  ['App testing', 'App store publishing', 'App permissions', 'Crash reporting'],
  ['Read the store policies before you build, not after.'],
  [R('Google Play Console help', 'https://support.google.com/googleplay/android-developer/'), R('App Store Connect help', 'https://developer.apple.com/help/app-store-connect/')]);

// -- security
mod('security-fundamentals', 'Security', 'Security fundamentals',
  'Learn the core ideas: confidentiality, integrity and availability, threats and risks, encryption, authentication, least privilege, and how attacks usually unfold.',
  ['Security principles', 'Cryptography basics', 'Threat modelling', 'Identity and access'],
  ['Only test systems you own or have written permission to test.'],
  [R('OWASP Cheat Sheet Series', 'https://cheatsheetseries.owasp.org/'), R('Cloudflare: Learning Center', 'https://www.cloudflare.com/learning/', 'docs')]);
mod('web-sec', 'Security', 'Web application security',
  'Practise finding and fixing the common web flaws: injection, broken authentication, cross-site scripting, request forgery and insecure access control, in safe training labs.',
  ['OWASP Top 10', 'Burp Suite basics', 'SQL injection', 'Cross-site scripting'],
  ['Use deliberately vulnerable practice labs, never real sites you do not own.'],
  [R('PortSwigger Web Security Academy', 'https://portswigger.net/web-security', 'practice'), R('OWASP Top Ten', 'https://owasp.org/www-project-top-ten/')]);
mod('security-ops', 'Security', 'Security tools and hands-on practice',
  'Build practical skill in guided labs: scanning and analysing networks, reading logs, investigating alerts and writing up what you found.',
  ['Network scanning', 'Log analysis', 'Incident response basics', 'Security reporting'],
  ['Keep a write-up of every lab. It is great material for interviews.'],
  [R('TryHackMe', 'https://tryhackme.com/', 'practice', false), R('Hack The Box Academy', 'https://academy.hackthebox.com/', 'practice', false)]);

// -- final step
mod('hired', 'Get hired', 'Build your portfolio, resume and interview skills',
  'Employers want proof. Finish two or three projects you can show and explain, put them on GitHub, write a clear resume that matches the jobs you apply for, and practise the interview questions for the role.',
  ['Portfolio projects', 'Technical resume', 'Interview preparation'],
  ['Describe what you built, why, and what you would improve. That is what interviewers ask about.'],
  [], [L('Build your resume', '/cv-builder'), L('Check your resume (ATS)', '/features/ats-checker'), L('Interview questions', '/jobs/interview-questions'), L('Salaries', '/jobs/salaries'), L('Browse jobs', '/jobs')]);

// ---------------- roadmaps ----------------
const PACE = ['Start here', 'Next', 'Then', 'After that', 'Later', 'Later'];
const FRONT = 'Software roles', DATA = 'Data and AI roles', INFRA = 'Cloud, DevOps and security', TECH = 'Technologies';
const defs = [];
const role = (slug, name, badge, audience, aliases, tags, mods, summary) => defs.push({ slug, name, kind: 'role', badge, audience, aliases, tags, mods, summary });
const tech = (slug, name, badge, aliases, tags, mods, summary) => defs.push({ slug, name, kind: 'technology', badge, audience: TECH, aliases, tags, mods, summary });

role('frontend-developer', 'Frontend Developer', 'FE', FRONT, ['frontend', 'front end', 'front-end developer', 'ui developer', 'web developer', 'react developer', 'javascript developer'], ['frontend', 'web', 'react', 'javascript'],
  ['internet', 'git', 'html', 'css', 'js', 'ts', 'react', 'frontend-testing', 'perf-a11y', 'hired'], 'Everything a frontend developer needs, from HTML and CSS to React, TypeScript, testing and performance.');
role('backend-developer', 'Backend Developer', 'BE', FRONT, ['backend', 'back end', 'back-end developer', 'api developer', 'server side developer'], ['backend', 'api', 'server', 'database'],
  ['internet', 'git', 'linux-basics', 'node', 'express', 'rest-api', 'sql-basics', 'mongodb', 'auth-security', 'caching-redis', 'docker', 'system-design', 'hired'], 'The server side end to end: a language, APIs, databases, security, caching, containers and system design.');
role('full-stack-developer', 'Full Stack Developer', 'FS', FRONT, ['fullstack', 'full-stack developer', 'full stack', 'fullstack developer', 'web developer', 'mern', 'mean', 'mern stack developer', 'mean stack developer'], ['full stack', 'mern', 'web', 'javascript'],
  ['internet', 'git', 'html', 'css', 'js', 'ts', 'react', 'node', 'express', 'rest-api', 'sql-basics', 'mongodb', 'auth-security', 'docker', 'ci-cd', 'hired'], 'The complete web stack: frontend, backend, databases, security, containers and deployment, in a sensible order.');
role('mern-stack-developer', 'MERN Stack Developer', 'MN', FRONT, ['mern', 'mern stack', 'mongodb express react node', 'react node developer'], ['mern', 'mongodb', 'express', 'react', 'node'],
  ['js', 'git', 'react', 'node', 'express', 'mongodb', 'rest-api', 'auth-security', 'nginx', 'hired'], 'MongoDB, Express, React and Node.js: learn each part, then connect them into one deployed application.');
role('java-developer', 'Java Developer', 'JV', FRONT, ['java', 'spring boot developer', 'java backend developer', 'j2ee developer', 'core java'], ['java', 'spring', 'backend'],
  ['cs-basics', 'git', 'java', 'sql-basics', 'spring-boot', 'rest-api', 'unit-testing', 'docker', 'system-design', 'hired'], 'From core Java to Spring Boot, databases, testing and deployment.');
role('python-developer', 'Python Developer', 'PY', FRONT, ['python', 'python backend developer', 'django developer', 'flask developer', 'fastapi developer'], ['python', 'backend', 'django', 'fastapi'],
  ['python', 'git', 'sql-basics', 'python-web', 'rest-api', 'unit-testing', 'docker', 'hired'], 'Python language, web frameworks, databases, testing and deployment.');
role('dotnet-developer', '.NET Developer', 'NET', FRONT, ['dotnet', 'dot net developer', 'c# developer', 'asp.net developer', 'asp.net core', '.net core developer'], ['.net', 'c#', 'asp.net', 'backend'],
  ['cs-basics', 'git', 'csharp', 'sql-basics', 'aspnet', 'rest-api', 'unit-testing', 'cloud-azure', 'hired'], 'C#, ASP.NET Core, SQL Server style databases, testing and Azure.');
role('software-engineer', 'Software Engineer', 'SE', FRONT, ['software developer', 'programmer', 'sde', 'computer science', 'swe'], ['software engineer', 'dsa', 'system design'],
  ['cs-basics', 'git', 'dsa', 'sql-basics', 'unit-testing', 'system-design', 'hired'], 'The shared foundations of software work: problem solving, algorithms, version control, databases, testing and design.');
role('sql-developer', 'SQL Developer', 'SQL', DATA, ['sql', 'database developer', 'dba', 'database administrator', 't-sql developer', 'pl/sql developer', 'sql server developer', 'mysql developer', 'postgresql developer', 'database engineer'], ['sql', 'database', 'queries'],
  ['sql-basics', 'sql-advanced', 'db-design', 'rdbms', 'etl-airflow', 'python-data', 'dataviz-bi', 'hired'], 'From first SELECT to indexes, stored procedures, database design, ETL and reporting.');
role('data-analyst', 'Data Analyst', 'DA', DATA, ['analyst', 'business analyst', 'data analytics', 'reporting analyst', 'excel analyst'], ['data analyst', 'excel', 'sql', 'power bi'],
  ['excel', 'sql-basics', 'statistics', 'python-data', 'dataviz-bi', 'hired'], 'Spreadsheets, SQL, statistics, Python and dashboards: the toolkit for turning data into decisions.');
role('bi-developer', 'BI Developer', 'BI', DATA, ['business intelligence', 'power bi developer', 'tableau developer', 'bi analyst', 'reporting developer'], ['bi', 'power bi', 'tableau', 'reporting'],
  ['excel', 'sql-basics', 'sql-advanced', 'data-warehouse', 'dataviz-bi', 'hired'], 'Data modelling, SQL and dashboards in Power BI or Tableau.');
role('data-engineer', 'Data Engineer', 'DE', DATA, ['big data engineer', 'etl developer', 'data pipeline engineer', 'analytics engineer'], ['data engineer', 'etl', 'spark', 'airflow'],
  ['python', 'sql-basics', 'sql-advanced', 'data-warehouse', 'etl-airflow', 'spark-kafka', 'cloud-aws', 'docker', 'hired'], 'Pipelines, warehouses, big data tools and cloud: how data gets from source to analyst.');
role('data-scientist', 'Data Scientist', 'DS', DATA, ['data science', 'ds', 'statistician', 'research scientist'], ['data scientist', 'statistics', 'machine learning'],
  ['python', 'python-data', 'statistics', 'sql-basics', 'ml-basics', 'deep-learning', 'hired'], 'Python, statistics, SQL and machine learning, with the habits that make results trustworthy.');
role('machine-learning-engineer', 'Machine Learning Engineer', 'ML', DATA, ['ml engineer', 'ai engineer', 'mlops engineer', 'artificial intelligence', 'llm engineer', 'genai developer'], ['machine learning', 'ai', 'deep learning', 'llm'],
  ['python', 'python-data', 'ml-basics', 'deep-learning', 'mlops', 'llm-apps', 'docker', 'hired'], 'From Python and ML fundamentals to production deployment and applications built on large language models.');
role('devops-engineer', 'DevOps Engineer', 'DO', INFRA, ['devops', 'site reliability engineer', 'sre', 'platform engineer', 'release engineer', 'build engineer'], ['devops', 'docker', 'kubernetes', 'ci/cd'],
  ['linux-basics', 'networking', 'git', 'docker', 'ci-cd', 'kubernetes', 'terraform', 'monitoring', 'cloud-aws', 'hired'], 'Linux, networking, containers, pipelines, Kubernetes, infrastructure as code, monitoring and cloud.');
role('cloud-engineer', 'Cloud Engineer', 'CL', INFRA, ['cloud', 'cloud architect', 'aws engineer', 'azure engineer', 'cloud administrator', 'cloud developer'], ['cloud', 'aws', 'azure', 'gcp'],
  ['networking', 'linux-basics', 'cloud-aws', 'cloud-azure', 'cloud-gcp', 'terraform', 'docker', 'kubernetes', 'hired'], 'Networking and Linux first, then AWS, Azure and Google Cloud, infrastructure as code and containers.');
role('qa-automation-engineer', 'QA Automation Engineer', 'QA', INFRA, ['qa', 'tester', 'test engineer', 'sdet', 'automation tester', 'quality assurance', 'software tester', 'selenium tester'], ['qa', 'testing', 'automation', 'selenium'],
  ['qa-fundamentals', 'git', 'js', 'api-testing', 'e2e', 'ci-cd', 'perf-testing', 'hired'], 'Testing fundamentals, API and browser automation, pipelines and performance testing.');
role('cyber-security-analyst', 'Cyber Security Analyst', 'CS', INFRA, ['cybersecurity', 'cyber security', 'security analyst', 'security engineer', 'ethical hacker', 'penetration tester', 'pentester', 'soc analyst', 'infosec'], ['security', 'cybersecurity', 'owasp', 'ethical hacking'],
  ['networking', 'linux-basics', 'security-fundamentals', 'web-sec', 'security-ops', 'hired'], 'Networking, Linux, security principles, web security and hands-on lab practice.');
role('android-developer', 'Android Developer', 'AN', FRONT, ['android', 'kotlin developer', 'mobile developer', 'android app developer'], ['android', 'kotlin', 'mobile'],
  ['cs-basics', 'git', 'kotlin', 'android-ui', 'rest-api', 'publishing', 'hired'], 'Kotlin, Jetpack Compose, local data, APIs and publishing on the Play Store.');
role('ios-developer', 'iOS Developer', 'IOS', FRONT, ['ios', 'swift developer', 'iphone developer', 'apple developer'], ['ios', 'swift', 'swiftui', 'mobile'],
  ['cs-basics', 'git', 'swift-ios', 'rest-api', 'publishing', 'hired'], 'Swift, SwiftUI, APIs and publishing on the App Store.');
role('flutter-developer', 'Flutter Developer', 'FL', FRONT, ['flutter', 'dart developer', 'cross platform mobile developer', 'mobile app developer', 'react native developer'], ['flutter', 'dart', 'react native', 'mobile'],
  ['cs-basics', 'git', 'flutter', 'rest-api', 'publishing', 'hired'], 'Build Android and iOS apps from one codebase with Flutter, with a pointer to React Native.');

tech('react', 'React', 'RE', ['reactjs', 'react.js', 'react developer', 'react hooks'], ['react', 'javascript', 'frontend'], ['js', 'ts', 'react', 'nextjs', 'frontend-testing'], 'Learn JavaScript and TypeScript, then React, Next.js and testing.');
tech('angular', 'Angular', 'NG', ['angularjs', 'angular developer', 'angular 17', 'rxjs'], ['angular', 'typescript', 'frontend'], ['js', 'ts', 'angular', 'rest-api', 'frontend-testing'], 'JavaScript, TypeScript and Angular with APIs and testing.');
tech('vue', 'Vue.js', 'VU', ['vuejs', 'vue developer', 'nuxt'], ['vue', 'frontend', 'javascript'], ['js', 'vue', 'rest-api', 'frontend-testing'], 'JavaScript, then Vue with APIs and tests.');
tech('javascript', 'JavaScript', 'JS', ['js', 'ecmascript', 'es6', 'javascript developer'], ['javascript', 'web'], ['internet', 'html', 'css', 'js', 'ts', 'node'], 'The web basics, then JavaScript and TypeScript on the browser and the server.');
tech('typescript', 'TypeScript', 'TS', ['ts', 'typescript developer'], ['typescript', 'javascript'], ['js', 'ts', 'node', 'unit-testing'], 'JavaScript first, then TypeScript on the server and in tests.');
tech('nodejs', 'Node.js', 'ND', ['node', 'node js', 'express', 'express.js', 'nodejs developer'], ['node', 'express', 'backend', 'javascript'], ['js', 'node', 'express', 'rest-api', 'mongodb', 'auth-security'], 'JavaScript on the server: Node.js, Express, APIs, databases and security.');
tech('sql', 'SQL', 'SQ', ['sql query', 'structured query language', 'sql basics', 'learn sql', 'relational database'], ['sql', 'database'], ['sql-basics', 'sql-advanced', 'db-design', 'rdbms', 'python-data', 'dataviz-bi'], 'From first query to indexes and design, then analysing the results in Python and dashboards.');
tech('postgresql', 'PostgreSQL', 'PG', ['postgres', 'postgre sql', 'psql'], ['postgresql', 'sql', 'database'], ['sql-basics', 'rdbms', 'sql-advanced', 'db-design', 'docker', 'monitoring'], 'SQL and PostgreSQL: queries, administration, performance and design, then running and watching it in production.');
tech('mongodb', 'MongoDB', 'MG', ['mongo', 'mongo db', 'nosql', 'mongoose'], ['mongodb', 'nosql', 'database'], ['js', 'mongodb', 'db-design', 'node'], 'Document databases: queries, indexes, modelling and use with Node.js.');
tech('python', 'Python', 'PY', ['python3', 'python programming', 'learn python'], ['python'], ['python', 'python-data', 'python-web', 'unit-testing'], 'Python language, data work, web frameworks and testing.');
tech('java', 'Java', 'JA', ['core java', 'java programming', 'jdk'], ['java'], ['java', 'sql-basics', 'spring-boot', 'unit-testing'], 'Core Java, databases, Spring Boot and testing.');
tech('spring-boot', 'Spring Boot', 'SB', ['spring', 'spring framework', 'spring boot microservices'], ['spring', 'java'], ['java', 'spring-boot', 'rest-api', 'sql-basics', 'docker'], 'Java, Spring Boot, REST APIs, SQL and Docker.');
tech('docker', 'Docker', 'DK', ['containers', 'docker compose', 'containerization', 'dockerfile'], ['docker', 'containers'], ['linux-basics', 'docker', 'ci-cd', 'kubernetes'], 'Linux basics, containers, pipelines and where Kubernetes fits.');
tech('kubernetes', 'Kubernetes', 'K8', ['k8s', 'kube', 'container orchestration'], ['kubernetes', 'k8s'], ['docker', 'kubernetes', 'monitoring', 'terraform', 'cloud-aws'], 'Containers, Kubernetes, monitoring, infrastructure as code and a cloud to run it on.');
tech('aws', 'AWS', 'AW', ['amazon web services', 'aws cloud', 'ec2', 's3', 'lambda'], ['aws', 'cloud'], ['networking', 'cloud-aws', 'terraform', 'monitoring'], 'Networking, core AWS services, infrastructure as code and monitoring.');
tech('git-and-github', 'Git and GitHub', 'GT', ['git', 'github', 'version control', 'github actions'], ['git', 'github'], ['linux-basics', 'git', 'ci-cd', 'docker'], 'Command line, version control, automated checks on every change, and containers.');
tech('linux', 'Linux', 'LX', ['linux administration', 'bash', 'shell scripting', 'ubuntu', 'command line'], ['linux', 'bash'], ['linux-basics', 'networking', 'nginx', 'monitoring'], 'Command line, networking, running a web server and watching it.');
tech('machine-learning', 'Machine Learning', 'ML', ['ml', 'ai', 'artificial intelligence', 'deep learning', 'scikit-learn'], ['machine learning', 'ai'], ['python-data', 'statistics', 'ml-basics', 'deep-learning'], 'Data skills, statistics, machine learning and deep learning.');
tech('power-bi', 'Power BI', 'PB', ['powerbi', 'power bi developer', 'dax', 'tableau'], ['power bi', 'bi', 'dashboards'], ['excel', 'sql-basics', 'dataviz-bi', 'data-warehouse'], 'Spreadsheets, SQL, dashboards and data modelling.');
tech('flutter', 'Flutter', 'FL', ['flutter app', 'dart'], ['flutter', 'dart'], ['git', 'flutter', 'rest-api', 'publishing'], 'Flutter and Dart, calling APIs, then testing and publishing.');
tech('html-css', 'HTML and CSS', 'HC', ['html', 'css', 'html5', 'css3', 'web design', 'tailwind', 'responsive design'], ['html', 'css', 'web design'], ['internet', 'html', 'css', 'perf-a11y'], 'The foundations of every web page: structure, style, accessibility and speed.');

const shortName = (n) => n.replace(/ Developer$| Engineer$/, '');
const build = (d, order) => {
  const steps = d.mods.map((k, i) => {
    const m = M[k];
    if (!m) throw new Error(`Unknown module ${k} in ${d.slug}`);
    return {
      title: m.title, pace: k === 'hired' ? 'When you are ready' : PACE[Math.min(i, PACE.length - 1)], description: m.description, skills: m.skills, tips: m.tips,
      links: m.links || [], layer: m.layer, resources: m.resources,
    };
  });
  const isRole = d.kind === 'role';
  const title = `${d.name} Roadmap`;
  return {
    slug: `${d.slug}-roadmap`, title, kind: d.kind, badge: d.badge, audience: d.audience, order: 100 + order,
    summary: d.summary,
    description: isRole
      ? `A step-by-step ${d.name} roadmap: the full stack, the skills to learn in order and the best places to learn each step.`
      : `A step-by-step ${d.name} roadmap: what to learn in order, the related skills and the best places to learn each step.`,
    metaTitle: `${d.name} Roadmap: Stack and Resources`.length <= 42 ? `${d.name} Roadmap: Stack and Resources` : `${d.name} Roadmap`,
    keywords: `${d.name} roadmap, how to become a ${shortName(d.name)}, ${d.name} skills, learn ${shortName(d.name)}`,
    aliases: d.aliases, tags: d.tags, steps,
    faqs: [
      { q: `Where should I start with ${d.name}?`, a: `Start at step 1 and work down in order, because later steps build on earlier ones. If you are signed in, the roadmap compares your resume with each step and marks where you could start.` },
      isRole
        ? { q: `Do I need a degree to work as a ${d.name}?`, a: 'It depends on the employer and the country. Many employers accept proven skills and projects, while others ask for a degree. Read the adverts for the roles you want and ask the employer if it is unclear.' }
        : { q: `Is ${d.name} worth learning?`, a: `Check how many job adverts in your area mention ${d.name}, and whether it fits the kind of work you want. This roadmap shows what to learn; the Browse jobs page shows what employers are asking for.` },
      { q: 'How do I know I am ready to apply?', a: 'When you can build a small project from start to finish without copying a tutorial, and explain why you made your choices. Apply while you keep learning; you do not need to know everything.' },
    ],
  };
};

const replace = process.argv.includes('--replace');
await connectDB();
let n = 0;
for (const d of defs) {
  const r = build(d, n++);
  const exists = await Roadmap.exists({ slug: r.slug });
  if (exists && !replace) { console.log(`skip   ${r.slug} (already exists)`); continue; }
  await Roadmap.findOneAndUpdate({ slug: r.slug }, { ...r, published: true, modifiedAt: new Date() }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  console.log(`${exists ? 'reset ' : 'added '} ${r.slug} (${r.steps.length} steps)`);
}
await mongoose.disconnect();
