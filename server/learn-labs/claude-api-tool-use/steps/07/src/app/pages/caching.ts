import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Row = { input: number; output: number; cacheWrite: number; cacheRead: number };

@Component({
  selector: 'app-caching',
  imports: [FormsModule],
  template: `
    <h1>Prompt caching</h1>
    <p class="hint">Run the same check twice within a few minutes. The first call writes the long rules into the cache. The second reads them back at a lower cost.</p>

    <div class="card">
      <label for="r">Resume text</label>
      <textarea id="r" [(ngModel)]="resume"></textarea>
      <button (click)="run()" [disabled]="busy() || !resume.trim()">{{ busy() ? 'Working...' : 'Review resume' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (rows().length) {
      <div class="card">
        <h2>Token usage per call</h2>
        <table>
          <thead><tr><th>Call</th><th>Normal input</th><th>Cache write</th><th>Cache read</th><th>Output</th></tr></thead>
          <tbody>
            @for (r of rows(); track $index) {
              <tr>
                <td>{{ $index + 1 }}</td><td>{{ r.input }}</td>
                <td [class.ok]="r.cacheWrite > 0">{{ r.cacheWrite }}</td>
                <td [class.ok]="r.cacheRead > 0">{{ r.cacheRead }}</td>
                <td>{{ r.output }}</td>
              </tr>
            }
          </tbody>
        </table>
        <p class="muted">If both cache columns stay at 0, the rules text may be under the minimum size for caching on your model. Check the docs.</p>
        <div class="answer">{{ lastText() }}</div>
      </div>
    }
  `,
})
export class CachingPage {
  private http = inject(HttpClient);

  resume = 'Ravi Kumar, Pune. Electrician, 5 years. Installed wiring in houses and small shops. ITI certificate 2019. Skills: wiring, panel work, testing. Languages: Hindi, English.';
  busy = signal(false);
  error = signal('');
  rows = signal<Row[]>([]);
  lastText = signal('');

  async run() {
    this.busy.set(true);
    this.error.set('');
    try {
      const r = await firstValueFrom(this.http.post<{ text: string; usage: Row }>('/api/cached', { resume: this.resume }));
      this.rows.update((list) => [...list, r.usage]);
      this.lastText.set(r.text);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
