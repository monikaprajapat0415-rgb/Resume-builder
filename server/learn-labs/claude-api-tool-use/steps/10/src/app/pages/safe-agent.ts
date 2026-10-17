import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Note = { id: string; title: string; text: string };
type Action = { name: string; input: unknown };
type Reply = { sessionId: string; notes: Note[]; status: 'done' | 'needs_approval'; text?: string; actions?: Action[] };
type Line = { who: 'You' | 'Claude'; text: string };

@Component({
  selector: 'app-safe-agent',
  imports: [FormsModule],
  template: `
    <h1>Safe tools with approval</h1>
    <p class="hint">Saving a note is fine. Deleting one needs your approval. Try: "Save a note called Skills: add MIG welding" and then "Delete note 1".</p>

    <div class="card">
      @for (l of lines(); track $index) { <p><strong>{{ l.who }}:</strong> <span class="answer">{{ l.text }}</span></p> }

      @if (pending(); as actions) {
        <div class="err">
          Claude wants to do this:
          @for (a of actions; track $index) { <pre class="out">{{ a.name }}({{ show(a.input) }})</pre> }
          <button class="danger" (click)="decide(true)" [disabled]="busy()">Approve</button>
          <button class="secondary" (click)="decide(false)" [disabled]="busy()">Deny</button>
        </div>
      }
      @if (error()) { <div class="err">{{ error() }}</div> }

      <label for="m">Message</label>
      <textarea id="m" [(ngModel)]="message" style="min-height:70px" [disabled]="!!pending()"></textarea>
      <button (click)="send()" [disabled]="busy() || !!pending() || !message.trim()">{{ busy() ? 'Working...' : 'Send' }}</button>
    </div>

    <div class="card">
      <h2>Saved notes</h2>
      @for (n of notes(); track n.id) { <p><strong>#{{ n.id }} {{ n.title }}</strong><br />{{ n.text }}</p> } @empty { <p class="muted">No notes.</p> }
    </div>
  `,
})
export class SafeAgentPage {
  private http = inject(HttpClient);
  private sessionId = '';

  message = '';
  busy = signal(false);
  error = signal('');
  lines = signal<Line[]>([]);
  notes = signal<Note[]>([]);
  pending = signal<Action[] | null>(null);

  show(v: unknown) { return JSON.stringify(v); }

  async send() {
    const text = this.message.trim();
    this.lines.update((l) => [...l, { who: 'You', text }]);
    this.message = '';
    await this.call('/api/safe-agent', { sessionId: this.sessionId, message: text });
  }

  async decide(approve: boolean) {
    this.lines.update((l) => [...l, { who: 'You', text: approve ? '(approved)' : '(denied)' }]);
    await this.call('/api/safe-agent/decision', { sessionId: this.sessionId, approve });
  }

  private async call(url: string, body: object) {
    this.busy.set(true);
    this.error.set('');
    try {
      const r = await firstValueFrom(this.http.post<Reply>(url, body));
      this.sessionId = r.sessionId;
      this.notes.set(r.notes);
      if (r.status === 'needs_approval') {
        this.pending.set(r.actions ?? []);
      } else {
        this.pending.set(null);
        this.lines.update((l) => [...l, { who: 'Claude', text: r.text ?? '' }]);
      }
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
