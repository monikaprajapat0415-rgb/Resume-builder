import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type Health = { ok: boolean; model: string; keyConfigured: boolean };

@Component({
  selector: 'app-models',
  imports: [FormsModule],
  template: `
    <h1>Choose a model</h1>
    <p class="hint">Tell us about your task. We suggest where to start. Always confirm with your own test cases.</p>

    <div class="card">
      <label>What is the task?</label>
      <select [(ngModel)]="task">
        <option value="classify">Sort items into labels (classification)</option>
        <option value="extract">Pull data out of text (extraction)</option>
        <option value="summary">Summarise text</option>
        <option value="reasoning">Hard multi-step thinking</option>
        <option value="coding">Write or fix code</option>
      </select>

      <label>How many requests per day?</label>
      <select [(ngModel)]="volume">
        <option value="low">A few hundred or fewer</option>
        <option value="high">Thousands or more</option>
      </select>

      <label><input type="checkbox" [(ngModel)]="needFast" style="width:auto" /> Users are waiting, so speed matters</label>
    </div>

    <div class="card">
      <h2>Suggestion: {{ suggestion().tier }}</h2>
      <p>{{ suggestion().why }}</p>
    </div>

    <div class="card">
      <h2>Server status</h2>
      @if (health(); as h) {
        <p class="ok">Server is running. Model from .env: <strong>{{ h.model }}</strong></p>
        <p [class]="h.keyConfigured ? 'ok' : 'bad'">{{ h.keyConfigured ? 'API key found.' : 'No API key yet. Add ANTHROPIC_API_KEY to .env.' }}</p>
      } @else if (offline()) {
        <p class="bad">Cannot reach the server. Run <code>npm run server</code> in another terminal.</p>
      } @else {
        <p class="muted">Checking...</p>
      }
    </div>
  `,
})
export class ModelsPage {
  private http = inject(HttpClient);

  task = 'classify';
  volume = 'low';
  needFast = false;

  health = signal<Health | null>(null);
  offline = signal(false);

  constructor() {
    firstValueFrom(this.http.get<Health>('/api/health'))
      .then((h) => this.health.set(h))
      .catch(() => this.offline.set(true));
  }

  suggestion() {
    const hard = this.task === 'reasoning' || this.task === 'coding';
    if (hard && !this.needFast) {
      return { tier: 'Start with a larger, more capable model', why: 'Hard tasks fail more often on small models. Start big, then check whether a smaller one is good enough on your test cases.' };
    }
    if (!hard && (this.volume === 'high' || this.needFast)) {
      return { tier: 'Start with a smaller, faster model', why: 'Simple, repeated tasks do not need the biggest model. A smaller one is cheaper and replies faster. Test your own examples to confirm.' };
    }
    return { tier: 'Start with a mid-size model', why: 'A middle option is a safe first choice. Measure quality, speed and cost, then move up or down.' };
  }
}
