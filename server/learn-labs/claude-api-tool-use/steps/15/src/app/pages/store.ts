import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Item = { id: string; source: string; text: string; score?: number };

@Component({
  selector: 'app-store',
  imports: [FormsModule],
  template: `
    <h1>Vector store</h1>
    <p class="hint">Add your own notes, search them by meaning, filter by source and delete them. Data is saved in server/runtime/vectors.json.</p>

    <div class="card">
      <h2>Add a note</h2>
      <textarea [(ngModel)]="newText" placeholder="Write something to remember..." style="min-height:90px"></textarea>
      <button (click)="add()" [disabled]="busy() || newText.trim().length < 10">Add to store</button>
    </div>

    <div class="card">
      <h2>Search ({{ count() }} items)</h2>
      <input [(ngModel)]="query" (keyup.enter)="search()" placeholder="Search by meaning..." />
      <label for="src">Only this source (optional)</label>
      <select id="src" [(ngModel)]="source">
        <option value="">All sources</option>
        @for (s of sources(); track s) { <option [value]="s">{{ s }}</option> }
      </select>
      <button (click)="search()" [disabled]="busy() || !query.trim()">Search</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
      @for (h of hits(); track h.id) {
        <p><strong>{{ h.id }}</strong> <span class="muted">similarity {{ h.score }}</span>
          <button class="danger" style="margin-left:8px" (click)="remove(h.id)">Delete</button></p>
        <pre class="out">{{ h.text }}</pre>
      }
    </div>
  `,
})
export class StorePage implements OnInit {
  private http = inject(HttpClient);

  newText = '';
  query = 'how do I protect my personal details';
  source = '';
  busy = signal(false);
  error = signal('');
  count = signal(0);
  sources = signal<string[]>([]);
  hits = signal<Item[]>([]);

  ngOnInit() {
    this.refresh();
  }

  private async guard(fn: () => Promise<void>) {
    this.busy.set(true);
    this.error.set('');
    try {
      await fn();
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  refresh() {
    return this.guard(async () => {
      const r = await firstValueFrom(this.http.get<{ count: number; sources: string[] }>('/api/store'));
      this.count.set(r.count);
      this.sources.set(r.sources);
    });
  }

  add() {
    return this.guard(async () => {
      await firstValueFrom(this.http.post('/api/store/upsert', { text: this.newText, source: 'my-notes.md' }));
      this.newText = '';
      const r = await firstValueFrom(this.http.get<{ count: number; sources: string[] }>('/api/store'));
      this.count.set(r.count);
      this.sources.set(r.sources);
    });
  }

  search() {
    return this.guard(async () => {
      const r = await firstValueFrom(this.http.post<{ hits: Item[] }>('/api/store/query', { query: this.query, source: this.source || undefined }));
      this.hits.set(r.hits);
    });
  }

  remove(id: string) {
    return this.guard(async () => {
      await firstValueFrom(this.http.delete(`/api/store/${encodeURIComponent(id)}`));
      this.hits.update((h) => h.filter((x) => x.id !== id));
      const r = await firstValueFrom(this.http.get<{ count: number; sources: string[] }>('/api/store'));
      this.count.set(r.count);
      this.sources.set(r.sources);
    });
  }
}
