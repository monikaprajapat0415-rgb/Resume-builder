import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Metrics = { requests: number; cacheHits: number; fallbacks: number; errors: number; inputTokens: number; outputTokens: number; avgMs: number; cacheHitRate: number; estimatedCost: number | null; currency: string };
type Reply = { answer: string; cached: boolean; fallback?: boolean; sources: { id: string; text: string }[] };

@Component({
  selector: 'app-ops',
  imports: [FormsModule],
  template: `
    <h1>Production basics</h1>
    <p class="hint">Ask the same question twice to see the cache work. Ask more than 10 questions in a minute to see the rate limit. The numbers below come from the server.</p>

    <div class="card">
      <label for="q">Question</label>
      <input id="q" [(ngModel)]="question" (keyup.enter)="ask()" />
      <button (click)="ask()" [disabled]="busy() || !question.trim()">{{ busy() ? 'Asking...' : 'Ask' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
      @if (reply(); as r) {
        <div class="answer">{{ r.answer }}</div>
        <p>
          @if (r.cached) { <span class="ok">served from cache (no AI cost)</span> }
          @if (r.fallback) { <span class="bad">fallback: AI unavailable</span> }
        </p>
        @if (r.fallback) { @for (s of r.sources; track s.id) { <pre class="out">{{ s.text }}</pre> } }
      }
    </div>

    @if (metrics(); as m) {
      <div class="card">
        <h2>Server metrics <button class="secondary" style="margin-left:8px" (click)="load()">Refresh</button></h2>
        <table>
          <tbody>
            <tr><td>Requests</td><td>{{ m.requests }}</td></tr>
            <tr><td>Cache hits</td><td>{{ m.cacheHits }} ({{ m.cacheHitRate * 100 }}%)</td></tr>
            <tr><td>Fallbacks / errors</td><td>{{ m.fallbacks }} / {{ m.errors }}</td></tr>
            <tr><td>Average time</td><td>{{ m.avgMs }} ms</td></tr>
            <tr><td>Tokens in / out</td><td>{{ m.inputTokens }} / {{ m.outputTokens }}</td></tr>
            <tr><td>Estimated cost</td><td>{{ m.estimatedCost === null ? 'set PRICE_* in .env' : m.estimatedCost + ' ' + m.currency }}</td></tr>
          </tbody>
        </table>
      </div>
    }
  `,
})
export class OpsPage implements OnInit {
  private http = inject(HttpClient);

  question = 'How should I answer a salary question in an interview?';
  busy = signal(false);
  error = signal('');
  reply = signal<Reply | null>(null);
  metrics = signal<Metrics | null>(null);

  ngOnInit() {
    this.load();
  }

  async load() {
    this.metrics.set(await firstValueFrom(this.http.get<Metrics>('/api/ops/metrics')));
  }

  async ask() {
    this.busy.set(true);
    this.error.set('');
    try {
      this.reply.set(await firstValueFrom(this.http.post<Reply>('/api/ops/ask', { question: this.question })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
      this.load();
    }
  }
}
