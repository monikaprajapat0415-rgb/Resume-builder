import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stream',
  imports: [FormsModule],
  template: `
    <h1>Streaming reply</h1>
    <p class="hint">Words appear as Claude writes them. Press Stop to cancel; the server stops the request too.</p>

    <div class="card">
      <label for="p">Your prompt</label>
      <textarea id="p" [(ngModel)]="prompt"></textarea>
      <button (click)="start()" [disabled]="running() || !prompt.trim()">Start</button>
      <button class="secondary" (click)="stop()" [disabled]="!running()">Stop</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
      <div class="answer">{{ output() }}@if (running()) { <span class="muted"> ▍</span> }</div>
      @if (info()) { <p class="muted">{{ info() }}</p> }
    </div>
  `,
})
export class StreamPage {
  prompt = 'Write a short professional summary for a welder with 4 years of experience.';
  output = signal('');
  running = signal(false);
  error = signal('');
  info = signal('');
  private controller: AbortController | null = null;

  async start() {
    this.output.set('');
    this.error.set('');
    this.info.set('');
    this.running.set(true);
    this.controller = new AbortController();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: this.prompt }] }),
        signal: this.controller.signal,
      });
      if (!response.ok || !response.body) throw new Error('bad response');

      // Read the stream piece by piece. Events are separated by a blank line.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';
        for (const raw of events) this.handle(raw);
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') this.error.set('Could not stream the reply. Please try again.');
    } finally {
      this.running.set(false);
      this.controller = null;
    }
  }

  private handle(raw: string) {
    const event = /^event: (.*)$/m.exec(raw)?.[1];
    const data = /^data: (.*)$/m.exec(raw)?.[1];
    if (!event || data === undefined) return;
    const value = JSON.parse(data);
    if (event === 'text') this.output.update((t) => t + value);
    if (event === 'done') this.info.set(`Done. ${value.usage.output_tokens} output tokens.`);
    if (event === 'error') this.error.set(value.message);
  }

  stop() {
    this.controller?.abort();
    this.info.set('Stopped.');
  }
}
