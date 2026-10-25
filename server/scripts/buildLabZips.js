// Builds the downloadable "solution" zips for a lesson lab.
//
// A lab lives in server/learn-labs/<name>/ and has:
//   base/        files every step shares (Angular config, styles, server skeleton)
//   steps/NN/    the files added or changed by lesson NN
//   steps/pages.json   the Angular pages, in lesson order (used to write the router and the menu)
//
// The zip for lesson N = base + steps 01..N (later steps overwrite earlier files).
//
// Usage (from server/):
//   node scripts/buildLabZips.js claude-api-tool-use            -> writes zips/ai-lab-lesson-NN.zip
//   node scripts/buildLabZips.js claude-api-tool-use --stage 5  -> also leaves the unzipped project in /tmp/lab-stage/5
// Needs the "zip" command (macOS and Linux have it).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const name = process.argv[2];
if (!name) { console.error('Usage: node scripts/buildLabZips.js <lab-name> [--stage N]'); process.exit(1); }
const stageIdx = process.argv.indexOf('--stage');
const onlyStage = stageIdx > -1 ? Number(process.argv[stageIdx + 1]) : null;

const lab = path.join(here, '..', 'learn-labs', name);
const pagesFile = path.join(lab, 'steps', 'pages.json');
const pages = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile, 'utf8')) : [];
// Optional lab.json: { "title": "AI Basics Lab", "folder": "ai-basics-lab", "zipPrefix": "ai-basics-lesson", "readme": "readme.md" }
// "readme" is a file in the lab folder with {{n}} and {{total}} placeholders. Without lab.json the original AI Lab defaults apply.
const cfgFile = path.join(lab, 'lab.json');
const cfg = fs.existsSync(cfgFile) ? JSON.parse(fs.readFileSync(cfgFile, 'utf8')) : {};
const TITLE = cfg.title || 'AI Lab';
const FOLDER = cfg.folder || 'ai-lab';
const PREFIX = cfg.zipPrefix || 'ai-lab-lesson';
const stepDirs = fs.readdirSync(path.join(lab, 'steps')).filter((d) => /^\d+$/.test(d)).sort();
const zipsDir = path.join(lab, 'zips');
fs.mkdirSync(zipsDir, { recursive: true });

const appTs = (list) => `import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <header>
      <strong>${TITLE}</strong>
      <nav>
${list.map((p) => `        <a routerLink="/${p.path}" routerLinkActive="active">${p.step}. ${p.label}</a>`).join('\n')}
      </nav>
    </header>
    <main><router-outlet /></main>
  \`,
  styles: [\`
    header { background:#fff; border-bottom:1px solid #e2e8f0; padding:10px 16px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
    nav { display:flex; gap:6px; flex-wrap:wrap; }
    nav a { color:#475569; text-decoration:none; padding:4px 10px; border-radius:999px; font-size:.9rem; }
    nav a.active { background:#eef2ff; color:#3730a3; font-weight:600; }
    main { max-width:860px; margin:0 auto; padding:16px; }
  \`],
})
export class App {}
`;

const routesTs = (list) => `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '${list[0].path}' },
${list.map((p) => `  { path: '${p.path}', loadComponent: () => import('./pages/${p.file}').then((m) => m.${p.cls}) },`).join('\n')}
  { path: '**', redirectTo: '${list[0].path}' },
];
`;

const readme = (n, total) => cfg.readme ? fs.readFileSync(path.join(lab, cfg.readme), 'utf8').replaceAll('{{n}}', n).replaceAll('{{total}}', total) : `# AI Lab (Angular + Node) - solution after lesson ${n} of ${total}

A small Angular app plus a Node server that talks to the Claude API. Your API key stays on the server and never reaches the browser.

## Run it

1. Install Node.js (version 20 or newer) and run \`npm install\` in this folder.
2. Copy \`.env.example\` to \`.env\` and put your key in \`ANTHROPIC_API_KEY\`. Never commit \`.env\`.
3. Terminal 1: \`npm run server\`   (API on http://localhost:3000)
4. Terminal 2: \`npm start\`        (Angular on http://localhost:4200)

Open http://localhost:4200. The menu shows one page for every lesson you have completed (${n} of ${total}).

## Layout

- \`server/index.js\` loads every file in \`server/routes/\` as an API route.
- \`server/claude.js\` creates the Claude client from \`.env\`.
- \`src/app/pages/\` has one Angular page per lesson.
- \`proxy.conf.json\` sends \`/api\` calls from Angular to the server during development.
${n >= 13 ? `- \`server/rag/\` holds the RAG code and the sample documents in \`server/rag/docs/\`. Files the app writes while running (the vector store, notes, usage log) go to \`server/runtime/\`.
` : ''}${n >= 19 ? `- \`server/mcp/\` holds the MCP servers (\`servers.json\` lists them) and the host code that talks to them. Run \`npm run mcp:test\` to list their tools.
` : ''}
Model names, features and prices change. Check docs.anthropic.com before you rely on them.
`;

const total = stepDirs.length;
for (const dir of stepDirs) {
  const n = Number(dir);
  if (onlyStage && n !== onlyStage) continue;
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lab-'));
  const proj = path.join(tmpRoot, FOLDER);
  fs.cpSync(path.join(lab, 'base'), proj, { recursive: true });
  for (const d of stepDirs.filter((x) => Number(x) <= n)) {
    fs.cpSync(path.join(lab, 'steps', d), proj, { recursive: true, force: true });
  }
  if (!cfg.plain) { // "plain": true in lab.json = not an Angular lab (e.g. the MERN lab): no generated router or menu
    const list = pages.filter((p) => p.step <= n);
    fs.writeFileSync(path.join(proj, 'src/app/app.ts'), appTs(list));
    fs.writeFileSync(path.join(proj, 'src/app/app.routes.ts'), routesTs(list));
  }
  fs.writeFileSync(path.join(proj, 'README.md'), readme(n, total));

  const out = path.join(zipsDir, `${PREFIX}-${String(n).padStart(2, '0')}.zip`);
  fs.rmSync(out, { force: true });
  execFileSync('zip', ['-qr', '-X', out, FOLDER], { cwd: tmpRoot });
  if (onlyStage) {
    const dest = path.join('/tmp/lab-stage', String(n));
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(proj, dest, { recursive: true });
  }
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  console.log('built', path.basename(out), `${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
