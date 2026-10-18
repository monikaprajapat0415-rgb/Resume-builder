import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Step = { tool: string; input: unknown; output: string; isError: boolean };

@Component({
  selector: 'app-mcp-ask',
  imports: [FormsModule],
  template: `
    <h1>Claude using an MCP server</h1>
    <p class="hint">The tools come from our own resume-tools MCP server. Claude picks a tool, our host calls it over MCP and returns the result.</p>

    <div class="card">
      <label for="m">Your request</label>
      <textarea id="m" [(ngModel)]="message" style="min-height:140px"></textarea>
      <button (click)="run()" [disabled]="busy() || !message.trim()">{{ busy() ? 'Working...' : 'Run' }}</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (text()) {
      <div class="card">
        <h2>Answer</h2>
        <div class="answer">{{ text() }}</div>
        <p class="muted">Tools offered to Claude: {{ offered().join(', ') }}</p>
        <h2>MCP calls ({{ trace().length }})</h2>
        @for (s of trace(); track $index) {
          <p><strong>{{ s.tool }}</strong> <span [class]="s.isError ? 'bad' : 'ok'">{{ s.isError ? 'error' : 'ok' }}</span></p>
          <pre class="out">in:  {{ json(s.input) }}
out: {{ s.output }}</pre>
        }
      </div>
    }
  `,
})
export class McpAskPage {
  private http = inject(HttpClient);

  message = 'Check these resume bullets and tell me what to fix:\n1. Responsible for customer calls\n2. Handled 40 billing tickets a day and cut waiting time by 15%';
  busy = signal(false);
  error = signal('');
  text = signal('');
  trace = signal<Step[]>([]);
  offered = signal<string[]>([]);

  json(v: unknown) {
    return JSON.stringify(v);
  }

  async run() {
    this.busy.set(true);
    this.error.set('');
    this.text.set('');
    try {
      const r = await firstValueFrom(this.http.post<{ text: string; trace: Step[]; tools: string[] }>('/api/mcp/ask', { message: this.message }));
      this.text.set(r.text);
      this.trace.set(r.trace);
      this.offered.set(r.tools);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
