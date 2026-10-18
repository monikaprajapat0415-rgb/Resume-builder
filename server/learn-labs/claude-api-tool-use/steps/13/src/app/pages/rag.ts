import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Source = { id: string; source: string; text: string; score: number };

@Component({
  selector: 'app-rag',
  imports: [FormsModule],
  template: `
    <h1>Ask the help center (RAG)</h1>
    <p class="hint">The server finds the best paragraphs in our own documents, then asks Claude to answer from them only.</p>

    <div class="card">
      <label for="q">Your question</label>
      <input id="q" [(ngModel)]="question" (keyup.enter)="ask()" />
      <button (click)="ask()" [disabled]="busy() || !question.trim()">{{ busy() ? 'Searching...' : 'Ask' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (answer()) {
      <div class="card">
        <h2>Answer</h2>
        <div class="answer">{{ answer() }}</div>
        <h2>Sources used ({{ sources().length }})</h2>
        @for (s of sources(); track s.id) {
          <p><strong>{{ s.source }}</strong> <span class="muted">score {{ s.score }}</span></p>
          <pre class="out">{{ s.text }}</pre>
        } @empty {
          <p class="muted">Nothing matched, so the model was not called.</p>
        }
      </div>
    }
  `,
})
export class RagPage {
  private http = inject(HttpClient);

  question = 'How many pages should my resume be?';
  busy = signal(false);
  error = signal('');
  answer = signal('');
  sources = signal<Source[]>([]);

  async ask() {
    this.busy.set(true);
    this.error.set('');
    this.answer.set('');
    try {
      const r = await firstValueFrom(this.http.post<{ answer: string; sources: Source[] }>('/api/rag', { question: this.question }));
      this.answer.set(r.answer);
      this.sources.set(r.sources);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
