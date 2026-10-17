import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type AskReply = { text: string; usage: { input_tokens: number; output_tokens: number }; stopReason: string };

@Component({
  selector: 'app-ask',
  imports: [FormsModule],
  template: `
    <h1>Ask Claude</h1>
    <p class="hint">Your first real request. The browser talks to our server, and the server talks to Claude. The API key never reaches the browser.</p>

    <div class="card">
      <label for="q">Your question</label>
      <textarea id="q" [(ngModel)]="question" placeholder="Give me three tips for a fresher's resume."></textarea>
      <button (click)="send()" [disabled]="loading() || !question.trim()">{{ loading() ? 'Thinking...' : 'Ask' }}</button>

      @if (error()) { <div class="err">{{ error() }}</div> }
      @if (reply(); as r) {
        <div class="answer">{{ r.text }}</div>
        <p class="muted">Used {{ r.usage.input_tokens }} input and {{ r.usage.output_tokens }} output tokens.</p>
      }
    </div>
  `,
})
export class AskPage {
  private http = inject(HttpClient);

  question = '';
  loading = signal(false);
  error = signal('');
  reply = signal<AskReply | null>(null);

  async send() {
    this.loading.set(true);
    this.error.set('');
    this.reply.set(null);
    try {
      this.reply.set(await firstValueFrom(this.http.post<AskReply>('/api/ask', { question: this.question })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.loading.set(false);
    }
  }
}
