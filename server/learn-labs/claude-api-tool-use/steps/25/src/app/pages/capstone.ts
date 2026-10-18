import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const KEY = 'ai-lab-capstone';

type Item = { id: string; text: string; page?: string };

@Component({
  selector: 'app-capstone',
  imports: [RouterLink],
  template: `
    <h1>Capstone checklist</h1>
    <p class="hint">Tick each skill once you can do it without looking at the lesson. Your ticks are saved in this browser.</p>

    <div class="card">
      <h2>{{ done().length }} of {{ items.length }} skills</h2>
      <div class="bar"><span [style.width.%]="(done().length / items.length) * 100"></span></div>
      @for (i of items; track i.id) {
        <label class="row">
          <input type="checkbox" [checked]="done().includes(i.id)" (change)="toggle(i.id)" />
          <span>{{ i.text }}</span>
          @if (i.page) { <a [routerLink]="'/' + i.page">open page</a> }
        </label>
      }
    </div>

    <div class="card">
      <h2>Project ideas for your portfolio</h2>
      <ul>
        <li>A help-center chatbot for a small business, with cited answers and an evaluation set.</li>
        <li>A resume reviewer that returns structured JSON and explains every suggestion.</li>
        <li>A job-post summariser that redacts personal data and caches repeated posts.</li>
        <li>A notes assistant using an MCP server with approval for every write.</li>
        <li>A study helper that quizzes you from your own course notes.</li>
      </ul>
      <p class="muted">Use the plan template in docs/capstone-plan.md before you write code.</p>
    </div>
  `,
  styles: [`
    .row { display:flex; gap:10px; align-items:center; padding:6px 0; border-bottom:1px solid #e2e8f0; } .row input { width:auto; margin:0; }
    .row a { margin-left:auto; font-size:.85rem; }
    .bar { height:8px; background:#e2e8f0; border-radius:99px; margin:6px 0 10px; } .bar span { display:block; height:100%; background:#4f46e5; border-radius:99px; }
  `],
})
export class CapstonePage implements OnInit {
  items: Item[] = [
    { id: 'chat', text: 'Call the Claude API from a server and keep the key secret', page: 'ask' },
    { id: 'stream', text: 'Stream a reply to the browser', page: 'stream' },
    { id: 'cache', text: 'Use prompt caching and read the usage numbers', page: 'caching' },
    { id: 'tools', text: 'Give Claude tools and limit the loop', page: 'safe-agent' },
    { id: 'json', text: 'Get validated JSON from a model', page: 'match' },
    { id: 'chunk', text: 'Chunk documents and search by meaning', page: 'search' },
    { id: 'store', text: 'Put vectors behind a store interface', page: 'store' },
    { id: 'rag', text: 'Answer from your own documents with checked citations', page: 'rag-plus' },
    { id: 'agent', text: 'Run an agent with memory and a token budget', page: 'agent-loop' },
    { id: 'team', text: 'Split work between specialised agents', page: 'team' },
    { id: 'mcp', text: 'Build and call an MCP server', page: 'mcp-ask' },
    { id: 'safe', text: 'Require approval for write tools and defend against prompt injection', page: 'mcp-safe' },
    { id: 'eval', text: 'Run a test set after every change', page: 'evals' },
    { id: 'pii', text: 'Redact personal data before it leaves the server', page: 'privacy' },
    { id: 'ops', text: 'Add cache, rate limit, timeout, fallback and metrics', page: 'ops' },
  ];
  done = signal<string[]>([]);

  ngOnInit() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) this.done.set(saved.filter((x) => this.items.some((i) => i.id === x)));
    } catch { /* storage can be blocked; the page still works */ }
  }

  toggle(id: string) {
    this.done.update((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
    try { localStorage.setItem(KEY, JSON.stringify(this.done())); } catch { /* ignore */ }
  }
}
