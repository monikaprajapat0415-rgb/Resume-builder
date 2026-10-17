import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Result = { text: string; checks: { threeBullets: boolean; shortLines: boolean }; tokens: number };
type Row = { id: string; a: Result; b: Result };
type Run = { rows: Row[]; summary: { total: number; passedA: number; passedB: number } };

@Component({
  selector: 'app-prompt-lab',
  imports: [FormsModule],
  template: `
    <h1>Prompt lab</h1>
    <p class="hint">Compare a plain prompt (A) with your improved prompt (B) on a small test set. Edit B until every check passes.</p>

    <div class="grid2">
      <div class="card"><h2>Prompt A (plain)</h2><pre class="out">{{ promptA }}</pre></div>
      <div class="card"><label for="b">Prompt B (you can edit this)</label><textarea id="b" [(ngModel)]="promptB" style="min-height:230px"></textarea></div>
    </div>
    <button (click)="run()" [disabled]="busy()">{{ busy() ? 'Running 6 requests...' : 'Run the test set' }}</button>
    @if (error()) { <div class="err">{{ error() }}</div> }

    @if (result(); as r) {
      <div class="card">
        <h2>Pass rate: A {{ r.summary.passedA }}/{{ r.summary.total }} &nbsp; B {{ r.summary.passedB }}/{{ r.summary.total }}</h2>
        <table>
          <thead><tr><th>Job</th><th>Prompt A</th><th>Prompt B</th></tr></thead>
          <tbody>
            @for (row of r.rows; track row.id) {
              <tr>
                <td>{{ row.id }}</td>
                <td><div class="answer">{{ row.a.text }}</div>{{ badges(row.a) }}</td>
                <td><div class="answer">{{ row.b.text }}</div>{{ badges(row.b) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class PromptLabPage {
  private http = inject(HttpClient);

  promptA = '';
  promptB = '';
  busy = signal(false);
  error = signal('');
  result = signal<Run | null>(null);

  constructor() {
    firstValueFrom(this.http.get<{ promptA: string; promptB: string }>('/api/prompt-lab/default')).then((d) => {
      this.promptA = d.promptA;
      this.promptB = d.promptB;
    });
  }

  badges(r: Result) {
    return `${r.checks.threeBullets ? '✔' : '✘'} exactly 3 bullets   ${r.checks.shortLines ? '✔' : '✘'} 20 words or fewer   (${r.tokens} output tokens)`;
  }

  async run() {
    this.busy.set(true);
    this.error.set('');
    try {
      this.result.set(await firstValueFrom(this.http.post<Run>('/api/prompt-lab', { promptB: this.promptB })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
