import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Pricing = { inputPerMillion: number | null; outputPerMillion: number | null; currency: string };
type Usage = { input_tokens: number; output_tokens: number };

@Component({
  selector: 'app-tokens',
  imports: [FormsModule],
  template: `
    <h1>Tokens and cost</h1>
    <p class="hint">Count tokens before you send, then see what a real request used and what it cost.</p>

    <div class="card">
      <label for="t">Text</label>
      <textarea id="t" [(ngModel)]="text" placeholder="Paste a job description or a resume here..."></textarea>
      <button class="secondary" (click)="count()" [disabled]="busy() || !text.trim()">Count input tokens</button>
      <button (click)="send()" [disabled]="busy() || !text.trim()">Send to Claude</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
      @if (counted() !== null) { <p>This text is about <strong>{{ counted() }}</strong> input tokens.</p> }
    </div>

    @if (calls().length) {
      <div class="card">
        <h2>Usage log</h2>
        <table>
          <thead><tr><th>#</th><th>Input</th><th>Output</th><th>Cost</th></tr></thead>
          <tbody>
            @for (c of calls(); track $index) {
              <tr><td>{{ $index + 1 }}</td><td>{{ c.input_tokens }}</td><td>{{ c.output_tokens }}</td><td>{{ cost(c) }}</td></tr>
            }
          </tbody>
        </table>
        <p><strong>Total this session: {{ totalCost() }}</strong></p>
        @if (!hasPrices()) {
          <p class="muted">Add PRICE_INPUT_PER_MTOK and PRICE_OUTPUT_PER_MTOK to your .env file to see money amounts.</p>
        }
      </div>
    }
  `,
})
export class TokensPage {
  private http = inject(HttpClient);

  text = '';
  busy = signal(false);
  error = signal('');
  counted = signal<number | null>(null);
  calls = signal<Usage[]>([]);
  pricing = signal<Pricing>({ inputPerMillion: null, outputPerMillion: null, currency: 'USD' });

  constructor() {
    firstValueFrom(this.http.get<Pricing>('/api/pricing')).then((p) => this.pricing.set(p)).catch(() => {});
  }

  hasPrices() {
    const p = this.pricing();
    return p.inputPerMillion !== null && p.outputPerMillion !== null;
  }

  cost(u: Usage): string {
    const p = this.pricing();
    if (!this.hasPrices()) return '-';
    const money = (u.input_tokens / 1_000_000) * p.inputPerMillion! + (u.output_tokens / 1_000_000) * p.outputPerMillion!;
    return `${money.toFixed(6)} ${p.currency}`;
  }

  totalCost(): string {
    const p = this.pricing();
    if (!this.hasPrices()) return '-';
    const money = this.calls().reduce(
      (sum, u) => sum + (u.input_tokens / 1_000_000) * p.inputPerMillion! + (u.output_tokens / 1_000_000) * p.outputPerMillion!,
      0,
    );
    return `${money.toFixed(6)} ${p.currency}`;
  }

  async count() {
    await this.run(async () => {
      const r = await firstValueFrom(this.http.post<{ inputTokens: number }>('/api/count', { text: this.text }));
      this.counted.set(r.inputTokens);
    });
  }

  async send() {
    await this.run(async () => {
      const r = await firstValueFrom(this.http.post<{ usage: Usage }>('/api/ask', { question: this.text }));
      this.calls.update((list) => [...list, r.usage]);
    });
  }

  private async run(job: () => Promise<void>) {
    this.busy.set(true);
    this.error.set('');
    try { await job(); } catch (e) { this.error.set(errorText(e)); } finally { this.busy.set(false); }
  }
}
