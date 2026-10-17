import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Report = { score: number; strong_matches: string[]; missing_keywords: string[]; suggestions: string[] };

@Component({
  selector: 'app-match',
  imports: [FormsModule],
  template: `
    <h1>Resume and job match</h1>
    <p class="hint">Paste a resume and a job post. Claude fills a fixed report shape, and the server checks it before we show it.</p>

    <div class="grid2">
      <div class="card"><label for="r">Resume</label><textarea id="r" [(ngModel)]="resume" style="min-height:200px"></textarea></div>
      <div class="card"><label for="j">Job description</label><textarea id="j" [(ngModel)]="job" style="min-height:200px"></textarea></div>
    </div>
    <button (click)="run()" [disabled]="busy() || resume.length < 30 || job.length < 30">{{ busy() ? 'Comparing...' : 'Compare' }}</button>
    @if (error()) { <div class="err">{{ error() }}</div> }

    @if (report(); as r) {
      <div class="card">
        <h2>Match score: {{ r.score }} / 100</h2>
        <div style="background:#e2e8f0;border-radius:99px;height:10px"><div [style.width.%]="r.score" style="background:#4f46e5;height:10px;border-radius:99px"></div></div>
        <h2>Strong matches</h2>
        <div class="chips">@for (s of r.strong_matches; track s) { <span>{{ s }}</span> } @empty { <span class="muted">None</span> }</div>
        <h2>Missing keywords</h2>
        <div class="chips miss">@for (s of r.missing_keywords; track s) { <span>{{ s }}</span> } @empty { <span class="muted">None</span> }</div>
        <h2>Suggestions</h2>
        <ul>@for (s of r.suggestions; track s) { <li>{{ s }}</li> }</ul>
        <p class="muted">This is guidance only. It is not how any employer's system will score you.</p>
      </div>
    }
  `,
})
export class MatchPage {
  private http = inject(HttpClient);

  resume = '';
  job = '';
  busy = signal(false);
  error = signal('');
  report = signal<Report | null>(null);

  async run() {
    this.busy.set(true);
    this.error.set('');
    this.report.set(null);
    try {
      const r = await firstValueFrom(this.http.post<{ report: Report }>('/api/match', { resume: this.resume, job: this.job }));
      this.report.set(r.report);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
