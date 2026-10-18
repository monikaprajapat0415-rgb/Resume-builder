import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Step = { tool: string; input: unknown; rule: string; isError: boolean; flagged: boolean; output: string };
type Out = { status: 'done' | 'pending'; text?: string; approval?: { id: string; tool: string; input: unknown }; trace: Step[] };

@Component({
  selector: 'app-mcp-safe',
  imports: [FormsModule],
  template: `
    <h1>Safe MCP: approval and prompt injection</h1>
    <p class="hint">Read tools run at once. Write tools wait for your approval. Delete tools are never allowed. Text from the inbox is treated as untrusted.</p>

    <div class="card">
      <label for="m">Your request</label>
      <textarea id="m" [(ngModel)]="message" style="min-height:110px"></textarea>
      <button (click)="start()" [disabled]="busy() || !message.trim()">{{ busy() ? 'Working...' : 'Send' }}</button>
      <p class="muted">Try: "Save a note: call the recruiter on Monday", or "Read my inbox and summarise it".</p>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (out(); as o) {
      <div class="card">
        @if (o.status === 'pending' && o.approval) {
          <h2>Approval needed</h2>
          <p>Claude wants to run <strong>{{ o.approval.tool }}</strong> with:</p>
          <pre class="out">{{ json(o.approval.input) }}</pre>
          <button (click)="decide(true)" [disabled]="busy()">Approve</button>
          <button class="danger" (click)="decide(false)" [disabled]="busy()">Decline</button>
        } @else {
          <h2>Answer</h2>
          <div class="answer">{{ o.text }}</div>
        }
        <h2>Tool calls ({{ o.trace.length }})</h2>
        @for (s of o.trace; track $index) {
          <p><strong>{{ s.tool }}</strong> <span class="muted">rule: {{ s.rule }}</span>
            <span [class]="s.isError ? 'bad' : 'ok'"> {{ s.isError ? 'blocked or failed' : 'ran' }}</span>
            @if (s.flagged) { <span class="bad"> possible prompt injection in the result</span> }</p>
          <pre class="out">{{ s.output }}</pre>
        }
      </div>
    }
  `,
})
export class McpSafePage {
  private http = inject(HttpClient);

  message = 'Read my inbox and summarise it.';
  busy = signal(false);
  error = signal('');
  out = signal<Out | null>(null);

  json(v: unknown) {
    return JSON.stringify(v, null, 2);
  }

  private async go(req: Promise<Out>) {
    this.busy.set(true);
    this.error.set('');
    try {
      this.out.set(await req);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  start() {
    this.out.set(null);
    return this.go(firstValueFrom(this.http.post<Out>('/api/mcp/safe', { message: this.message })));
  }

  decide(approved: boolean) {
    const id = this.out()?.approval?.id;
    return this.go(firstValueFrom(this.http.post<Out>('/api/mcp/approve', { id, approved })));
  }
}
