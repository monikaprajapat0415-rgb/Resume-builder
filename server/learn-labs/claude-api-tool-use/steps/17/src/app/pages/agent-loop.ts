import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Step = { turn: number; tool: string; input: unknown; output: unknown; isError: boolean; ms: number };
type Run = { text: string; trace: Step[]; turns: number; stopReason: string; usage: { input: number; output: number }; facts: Record<string, string> };

@Component({
  selector: 'app-agent-loop',
  imports: [FormsModule],
  template: `
    <h1>An agent with limits and memory</h1>
    <p class="hint">Give the agent a goal. It decides which tools to use, and the loop stops at a step limit or token budget.</p>

    <div class="card">
      <label for="g">Goal</label>
      <textarea id="g" [(ngModel)]="goal" style="min-height:110px"></textarea>
      <button (click)="run()" [disabled]="busy() || !goal.trim()">{{ busy() ? 'Working...' : 'Run agent' }}</button>
      <button class="secondary" (click)="forget()" [disabled]="busy()">Forget memory</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (result(); as r) {
      <div class="card">
        <h2>Final answer</h2>
        <div class="answer">{{ r.text }}</div>
        <p class="muted">Stopped because: <strong>{{ r.stopReason }}</strong> after {{ r.turns }} model call(s), {{ r.usage.input + r.usage.output }} tokens.</p>
        <h2>Trace</h2>
        @for (s of r.trace; track $index) {
          <p><strong>Turn {{ s.turn }}: {{ s.tool }}</strong> <span [class]="s.isError ? 'bad' : 'ok'">{{ s.isError ? 'error' : 'ok' }}</span> <span class="muted">{{ s.ms }} ms</span></p>
          <pre class="out">in:  {{ json(s.input) }}
out: {{ json(s.output) }}</pre>
        }
        <h2>Memory</h2>
        <pre class="out">{{ json(r.facts) }}</pre>
      </div>
    }
  `,
})
export class AgentLoopPage {
  private http = inject(HttpClient);
  private sessionId = Math.random().toString(36).slice(2);

  goal = 'I am a delivery driver in Pune. Remember that. Then tell me what to put at the top of my resume.';
  busy = signal(false);
  error = signal('');
  result = signal<Run | null>(null);

  json(v: unknown) {
    return JSON.stringify(v);
  }

  async run() {
    this.busy.set(true);
    this.error.set('');
    try {
      this.result.set(await firstValueFrom(this.http.post<Run>('/api/agent-loop', { goal: this.goal, sessionId: this.sessionId })));
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  async forget() {
    await firstValueFrom(this.http.request('DELETE', '/api/agent-loop/memory', { body: { sessionId: this.sessionId } }));
    this.result.set(null);
  }
}
