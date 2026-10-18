import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Row = { id: string; question: string; rank: number | null; retrievalOk: boolean; passed: boolean; answer?: string; missing?: string[]; forbidden?: string[]; faithful?: boolean; reason?: string };
type Report = { summary: { mode: string; total: number; passed: number; hitRate: number; mrr: number }; rows: Row[] };

@Component({
  selector: 'app-evals',
  template: `
    <h1>Evaluate the RAG app</h1>
    <p class="hint">Run the same ten test questions every time you change something. "Retrieval" is free. "Full" calls Claude to answer and to grade each answer.</p>

    <div class="card">
      <button (click)="run('retrieval')" [disabled]="busy()">{{ busy() ? 'Running...' : 'Run retrieval checks (free)' }}</button>
      <button class="secondary" (click)="run('full')" [disabled]="busy()">Run full checks (uses Claude)</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (report(); as r) {
      <div class="card">
        <h2>{{ r.summary.passed }} of {{ r.summary.total }} passed <span class="muted">({{ r.summary.mode }})</span></h2>
        <p class="muted">Hit rate {{ r.summary.hitRate }} (right document in the top 4). MRR {{ r.summary.mrr }} (higher means the right document ranks nearer the top).</p>
        <table>
          <thead><tr><th>Case</th><th>Rank</th><th>Result</th><th>Details</th></tr></thead>
          <tbody>
            @for (x of r.rows; track x.id) {
              <tr>
                <td>{{ x.id }}</td>
                <td>{{ x.rank ?? '-' }}</td>
                <td [class]="x.passed ? 'ok' : 'bad'">{{ x.passed ? 'pass' : 'FAIL' }}</td>
                <td>
                  @if (x.answer !== undefined) {
                    <div>{{ x.answer }}</div>
                    @if (x.missing?.length) { <div class="bad">missing: {{ x.missing }}</div> }
                    @if (x.forbidden?.length) { <div class="bad">forbidden: {{ x.forbidden }}</div> }
                    <div class="muted">judge: {{ x.faithful ? 'faithful' : 'not faithful' }}. {{ x.reason }}</div>
                  } @else { <span class="muted">{{ x.question }}</span> }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class EvalsPage {
  private http = inject(HttpClient);

  busy = signal(false);
  error = signal('');
  report = signal<Report | null>(null);

  async run(mode: 'retrieval' | 'full') {
    this.busy.set(true);
    this.error.set('');
    try {
      this.report.set(await firstValueFrom(this.http.post<Report>('/api/evals/run', { mode })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
