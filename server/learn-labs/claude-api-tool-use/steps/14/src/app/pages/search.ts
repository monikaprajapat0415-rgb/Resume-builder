import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Hit = { id: string; source: string; text: string; score: number };

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  template: `
    <h1>Chunks and vector search</h1>
    <p class="hint">Change the chunk size and overlap and watch which chunks come back. No Claude call, no cost.</p>

    <div class="card">
      <label for="q">Search for</label>
      <input id="q" [(ngModel)]="query" (keyup.enter)="run()" />
      <div class="grid2">
        <div><label for="s">Chunk size (words): {{ size }}</label><input id="s" type="range" min="20" max="200" step="10" [(ngModel)]="size" /></div>
        <div><label for="o">Overlap (words): {{ overlap }}</label><input id="o" type="range" min="0" max="60" step="5" [(ngModel)]="overlap" /></div>
      </div>
      <button (click)="run()" [disabled]="busy() || !query.trim()">{{ busy() ? 'Searching...' : 'Search' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (hits().length) {
      <div class="card">
        <h2>Top {{ hits().length }} of {{ chunkCount() }} chunks</h2>
        @for (h of hits(); track h.id) {
          <p><strong>{{ h.id }}</strong> <span class="muted">similarity {{ h.score }}</span></p>
          <div class="bar"><span [style.width.%]="percent(h.score)"></span></div>
          <pre class="out">{{ h.text }}</pre>
        }
      </div>
    }
  `,
  styles: [`.bar { height:8px; background:#e2e8f0; border-radius:99px; margin:4px 0 6px; } .bar span { display:block; height:100%; background:#4f46e5; border-radius:99px; }`],
})
export class SearchPage {
  private http = inject(HttpClient);

  query = 'what should go in the skills section for the ATS';
  size = 80;
  overlap = 20;
  busy = signal(false);
  error = signal('');
  hits = signal<Hit[]>([]);
  chunkCount = signal(0);

  percent(score: number) {
    return Math.max(2, Math.min(100, Math.round(score * 100)));
  }

  async run() {
    this.busy.set(true);
    this.error.set('');
    try {
      const r = await firstValueFrom(
        this.http.post<{ chunkCount: number; hits: Hit[] }>('/api/search', { query: this.query, size: Number(this.size), overlap: Number(this.overlap), k: 4 }),
      );
      this.hits.set(r.hits);
      this.chunkCount.set(r.chunkCount);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
