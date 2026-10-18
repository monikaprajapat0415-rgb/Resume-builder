import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Source = { id: string; source: string; text: string; score: number; coverage?: number };
type Reply = { answer: string; citations: number[]; invalidCitations?: number[]; sources: Source[]; mode: string };

@Component({
  selector: 'app-rag-plus',
  imports: [FormsModule],
  template: `
    <h1>Better RAG: hybrid search and citations</h1>
    <p class="hint">Compare keyword, vector and hybrid retrieval. The answer must cite its sources, and the server checks the numbers.</p>

    <div class="card">
      <label for="q">Question</label>
      <input id="q" [(ngModel)]="question" (keyup.enter)="ask()" />
      <label for="m">Retrieval mode</label>
      <select id="m" [(ngModel)]="mode">
        <option value="hybrid">Hybrid (BM25 + vector, fused, reranked)</option>
        <option value="keyword">Keyword only (BM25)</option>
        <option value="vector">Vector only</option>
      </select>
      <button (click)="ask()" [disabled]="busy() || !question.trim()">{{ busy() ? 'Working...' : 'Ask' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (reply(); as r) {
      <div class="card">
        <h2>Answer <span class="muted">({{ r.mode }})</span></h2>
        <div class="answer">{{ r.answer }}</div>
        @if (r.invalidCitations?.length) { <div class="err">The model cited sources that do not exist: {{ r.invalidCitations }}. Do not trust this answer.</div> }
        <h2>Sources</h2>
        @for (s of r.sources; track s.id; let i = $index) {
          <p>
            <strong [class.ok]="r.citations.includes(i + 1)">[{{ i + 1 }}] {{ s.id }}</strong>
            <span class="muted">score {{ s.score }}@if (s.coverage !== undefined) { , coverage {{ s.coverage }} }</span>
            @if (r.citations.includes(i + 1)) { <span class="ok"> cited</span> }
          </p>
          <pre class="out">{{ s.text }}</pre>
        }
      </div>
    }
  `,
})
export class RagPlusPage {
  private http = inject(HttpClient);

  question = 'Which fonts and file type are best for a resume?';
  mode = 'hybrid';
  busy = signal(false);
  error = signal('');
  reply = signal<Reply | null>(null);

  async ask() {
    this.busy.set(true);
    this.error.set('');
    try {
      this.reply.set(await firstValueFrom(this.http.post<Reply>('/api/rag-plus', { question: this.question, mode: this.mode })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
