import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Msg = { role: 'user' | 'assistant'; content: string };
type ChatReply = { text: string; usage: { input_tokens: number; output_tokens: number }; stopReason: string };

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  template: `
    <h1>Chat with memory</h1>
    <p class="hint">Claude does not remember earlier calls. This page keeps the history and sends it every time.</p>

    <div class="card">
      <label for="sys">System prompt (rules and persona)</label>
      <textarea id="sys" [(ngModel)]="system" style="min-height:70px"></textarea>

      <label for="keep">Messages to send each time</label>
      <select id="keep" [(ngModel)]="keep">
        <option [ngValue]="4">Last 4</option>
        <option [ngValue]="10">Last 10</option>
        <option [ngValue]="20">Last 20</option>
      </select>
    </div>

    <div class="card">
      @for (m of history(); track $index) {
        <p><strong>{{ m.role === 'user' ? 'You' : 'Claude' }}:</strong> <span class="answer">{{ m.content }}</span></p>
      } @empty {
        <p class="muted">No messages yet. Say hello.</p>
      }
      @if (cutOff()) { <div class="err">The reply was cut off because it hit the length limit. Ask Claude to continue.</div> }
      @if (error()) { <div class="err">{{ error() }}</div> }

      <label for="msg">Your message</label>
      <textarea id="msg" [(ngModel)]="draft" style="min-height:70px"></textarea>
      <button (click)="send()" [disabled]="busy() || !draft.trim()">{{ busy() ? 'Thinking...' : 'Send' }}</button>
      <button class="secondary" (click)="clear()">Clear chat</button>
      <p class="muted">Sending {{ toSend().length }} of {{ history().length }} messages.</p>
    </div>
  `,
})
export class ChatPage {
  private http = inject(HttpClient);

  system = 'You are a careful career coach. Keep answers short and never invent facts about the user.';
  keep = 10;
  draft = '';
  history = signal<Msg[]>([]);
  busy = signal(false);
  error = signal('');
  cutOff = signal(false);

  toSend() {
    return this.history().slice(-this.keep);
  }

  async send() {
    const text = this.draft.trim();
    if (!text) return;
    this.history.update((h) => [...h, { role: 'user', content: text }]);
    this.draft = '';
    this.busy.set(true);
    this.error.set('');
    this.cutOff.set(false);
    try {
      const r = await firstValueFrom(
        this.http.post<ChatReply>('/api/chat', { system: this.system, messages: this.toSend() }),
      );
      this.history.update((h) => [...h, { role: 'assistant', content: r.text }]);
      this.cutOff.set(r.stopReason === 'max_tokens');
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  clear() {
    this.history.set([]);
    this.error.set('');
    this.cutOff.set(false);
  }
}
