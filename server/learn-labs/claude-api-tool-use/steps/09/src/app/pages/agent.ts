import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Step = { tool: string; input: unknown; output: unknown; isError: boolean };

@Component({
  selector: 'app-agent',
  imports: [FormsModule],
  template: `
    <h1>Claude with tools</h1>
    <p class="hint">Claude can ask our server to run small functions. The trace shows every call it made.</p>

    <div class="card">
      <label for="m">Your request</label>
      <textarea id="m" [(ngModel)]="message" style="min-height:150px"></textarea>
      <button (click)="run()" [disabled]="busy() || !message.trim()">{{ busy() ? 'Working...' : 'Run' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (text()) {
      <div class="card">
        <h2>Answer</h2>
        <div class="answer">{{ text() }}</div>
        <h2>Tool calls ({{ trace().length }})</h2>
        @for (s of trace(); track $index) {
          <p><strong>{{ $index + 1 }}. {{ s.tool }}</strong> <span [class]="s.isError ? 'bad' : 'ok'">{{ s.isError ? 'error' : 'ok' }}</span></p>
          <pre class="out">in:  {{ pretty(s.input) }}
out: {{ pretty(s.output) }}</pre>
        } @empty {
          <p class="muted">Claude answered without using a tool.</p>
        }
      </div>
    }
  `,
})
export class AgentPage {
  private http = inject(HttpClient);

  message = `Here is a job post:\n"We need a customer support executive. You will answer customer calls, solve billing problems in Zendesk and write clear emails. Experience with Zendesk and strong English communication is required. Zendesk training provided."\n\nWhich keywords should my resume include? Also, how many words is this job post?`;
  busy = signal(false);
  error = signal('');
  text = signal('');
  trace = signal<Step[]>([]);

  pretty(v: unknown) {
    return JSON.stringify(v);
  }

  async run() {
    this.busy.set(true);
    this.error.set('');
    this.text.set('');
    this.trace.set([]);
    try {
      const r = await firstValueFrom(this.http.post<{ text: string; trace: Step[] }>('/api/agent', { message: this.message }));
      this.text.set(r.text);
      this.trace.set(r.trace);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
