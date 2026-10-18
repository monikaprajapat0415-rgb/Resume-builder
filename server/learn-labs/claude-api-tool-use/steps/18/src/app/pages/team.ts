import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Team = {
  plan: string[];
  research: { question: string; notes: string }[];
  draft: string;
  review: { approved: boolean; problems: string[] };
  final: string;
  revised: boolean;
  usage: { input: number; output: number };
};

@Component({
  selector: 'app-team',
  imports: [FormsModule],
  template: `
    <h1>A team of agents</h1>
    <p class="hint">A supervisor plans, researchers look things up, a writer drafts and a reviewer checks. Every hand-off is shown below.</p>

    <div class="card">
      <label for="t">Topic</label>
      <input id="t" [(ngModel)]="topic" (keyup.enter)="run()" />
      <button (click)="run()" [disabled]="busy() || !topic.trim()">{{ busy() ? 'The team is working...' : 'Start' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (team(); as t) {
      <div class="card">
        <h2>Final guide @if (t.revised) { <span class="muted">(revised after review)</span> }</h2>
        <div class="answer">{{ t.final }}</div>
        <p class="muted">{{ t.usage.input + t.usage.output }} tokens across all agents.</p>
      </div>
      <div class="card">
        <h2>1. Supervisor plan</h2>
        <ol>@for (q of t.plan; track q) { <li>{{ q }}</li> }</ol>
        <h2>2. Researcher notes</h2>
        @for (r of t.research; track r.question) {
          <p><strong>{{ r.question }}</strong></p>
          <pre class="out">{{ r.notes }}</pre>
        }
        <h2>3. Writer draft</h2>
        <pre class="out">{{ t.draft }}</pre>
        <h2>4. Reviewer</h2>
        <p [class]="t.review.approved ? 'ok' : 'bad'">{{ t.review.approved ? 'Approved' : 'Problems found' }}</p>
        <ul>@for (p of t.review.problems; track p) { <li>{{ p }}</li> }</ul>
      </div>
    }
  `,
})
export class TeamPage {
  private http = inject(HttpClient);

  topic = 'How to prepare a resume and an interview for a first job';
  busy = signal(false);
  error = signal('');
  team = signal<Team | null>(null);

  async run() {
    this.busy.set(true);
    this.error.set('');
    this.team.set(null);
    try {
      this.team.set(await firstValueFrom(this.http.post<Team>('/api/team', { topic: this.topic })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
