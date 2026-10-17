import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reliable',
  imports: [FormsModule],
  template: `
    <h1>Reliable requests</h1>
    <p class="hint">The server retries temporary errors. The page shows a clear message, lets you try again, and lets you cancel.</p>

    <div class="card">
      <label for="q">Question</label>
      <textarea id="q" [(ngModel)]="question" style="min-height:70px"></textarea>

      <label for="sim">Test mode</label>
      <select id="sim" [(ngModel)]="simulate">
        <option value="">Real request</option>
        <option value="flaky">Fake: fails twice, then works (retry succeeds)</option>
        <option value="down">Fake: service is down (all retries fail)</option>
        <option value="bad">Fake: bad request (never retried)</option>
      </select>

      <button (click)="send()" [disabled]="busy() || !question.trim()">{{ busy() ? 'Working...' : 'Send' }}</button>
      <button class="secondary" (click)="cancel()" [disabled]="!busy()">Cancel</button>

      @if (error(); as e) {
        <div class="err">
          {{ e.message }} (attempts: {{ e.attempts }})
          @if (e.retryable) { <button class="secondary" (click)="send()">Try again</button> }
        </div>
      }
      @if (text()) {
        <div class="answer">{{ text() }}</div>
        <p class="muted">Worked after {{ attempts() }} attempt(s).</p>
      }
    </div>
  `,
})
export class ReliablePage {
  private http = inject(HttpClient);
  private sub: Subscription | null = null;

  question = 'Give me one tip for a strong resume headline.';
  simulate = 'flaky';
  busy = signal(false);
  text = signal('');
  attempts = signal(0);
  error = signal<{ message: string; retryable: boolean; attempts: number } | null>(null);

  send() {
    this.busy.set(true);
    this.error.set(null);
    this.text.set('');
    this.sub = this.http
      .post<{ text: string; attempts: number }>('/api/reliable-ask', { question: this.question, simulate: this.simulate })
      .subscribe({
        next: (r) => { this.text.set(r.text); this.attempts.set(r.attempts); this.busy.set(false); },
        error: (e) => {
          this.error.set(e?.error?.error ?? { message: 'Something went wrong.', retryable: true, attempts: 1 });
          this.busy.set(false);
        },
      });
  }

  cancel() {
    this.sub?.unsubscribe(); // the browser drops the request
    this.busy.set(false);
  }
}
